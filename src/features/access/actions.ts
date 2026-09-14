"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/currentUser";
import { getCurrentFactory } from "@/features/factory/currentFactory";
import { getMyFactories } from "@/features/factory/queries";
import { ACCESS_ROLE_ORDER } from "./data";
import type { AccessRole } from "./types";

export type ActionResult =
  | { ok: true; count: number }
  | { ok: false; message: string };

const UNIQUE_VIOLATION = "23505";

const STALE_FACTORY = "โรงงานที่เลือกเปลี่ยนไปแล้ว กรุณารีเฟรชหน้า";
const NOT_ADMIN = "คุณไม่ได้เป็นผู้ดูแลของโรงงานนี้";
const ALREADY_REVIEWED = "คำขอนี้ถูกพิจารณาไปแล้ว หรือไม่ใช่ของโรงงานนี้";

// ═══ ฝั่งผู้ใช้ ════════════════════════════════════════════════

export async function requestFactoryAccess(input: {
  factoryIds: string[];
  role: AccessRole;
  reason?: string;
}): Promise<ActionResult> {
  // ฟอร์มตรวจฝั่ง client แล้ว แต่ client แก้ได้ จึงตรวจซ้ำที่นี่
  if (!ACCESS_ROLE_ORDER.includes(input.role)) {
    return { ok: false, message: "ระดับสิทธิ์ไม่ถูกต้อง" };
  }

  const factoryIds = [...new Set(input.factoryIds)];
  if (factoryIds.length === 0) {
    return { ok: false, message: "เลือกอย่างน้อย 1 โรงงาน" };
  }

  const [{ user }, myFactories] = await Promise.all([
    requireUser(),
    getMyFactories(),
  ]);

  // ตัดโรงงานที่เป็นสมาชิกอยู่แล้วทิ้ง — ขอซ้ำไปก็ไม่มีความหมาย
  const memberOf = new Set(myFactories.map((factory) => factory.id));
  const targets = factoryIds.filter((id) => !memberOf.has(id));
  if (targets.length === 0) {
    return { ok: false, message: "คุณเป็นสมาชิกของโรงงานที่เลือกอยู่แล้ว" };
  }

  // เหตุผลไม่บังคับ — เว้นว่างให้เป็น null ไม่ใช่สตริงว่าง
  const reason = input.reason?.trim() || null;

  const supabase = await createClient();
  const { error } = await supabase.from("factory_join_requests").insert(
    targets.map((factoryId) => ({
      factory_id: factoryId,
      // ตัวตนมาจาก session เสมอ ไม่รับจากฟอร์ม
      user_id: user.id,
      requested_role: input.role,
      request_reason: reason,
      status: "pending" as const,
    })),
  );

  if (error) {
    return {
      ok: false,
      message:
        error.code === UNIQUE_VIOLATION
          ? "มีคำขอที่รออนุมัติของโรงงานนี้อยู่แล้ว"
          : error.message,
    };
  }

  revalidatePath("/access");
  return { ok: true, count: targets.length };
}

// ยกเลิก = ลบแถว เพราะ enum ไม่มีสถานะ cancelled
// ยกเลิกได้เฉพาะคำขอของตัวเองที่ยังรออนุมัติ (RLS บังคับซ้ำอีกชั้น)
export async function cancelFactoryAccessRequest(
  requestId: string,
): Promise<ActionResult> {
  const { user } = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("factory_join_requests")
    .delete()
    .eq("id", requestId)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .select("id");

  if (error) return { ok: false, message: error.message };

  // RLS ปฏิเสธจะไม่ error แต่จะไม่มีแถวไหนถูกลบ
  if (!data?.length) {
    return {
      ok: false,
      message: "ยกเลิกไม่ได้ — คำขอนี้อาจถูกพิจารณาไปแล้ว",
    };
  }

  revalidatePath("/access");
  return { ok: true, count: data.length };
}

// ═══ ฝั่งแอดมิน ════════════════════════════════════════════════

// factoryId จาก client มีไว้ "ตรวจ" ว่ายังเป็นโรงงานเดียวกับที่เลือกอยู่เท่านั้น
// ถ้าผู้ใช้สลับโรงงานในอีกแท็บแล้วกดบันทึกในแท็บนี้ จะได้ไม่แก้ผิดโรงงาน
async function adminContext(
  factoryId: string,
): Promise<{ ok: true; userId: string } | { ok: false; message: string }> {
  const [{ user }, factory] = await Promise.all([
    requireUser(),
    getCurrentFactory(),
  ]);

  if (!factory || factory.id !== factoryId) {
    return { ok: false, message: STALE_FACTORY };
  }
  if (factory.role !== "admin") {
    return { ok: false, message: NOT_ADMIN };
  }

  return { ok: true, userId: user.id };
}

// อนุมัติ = ให้สิทธิ์ตามที่ผู้ใช้ขอเท่านั้น จึงไม่รับ role จาก client เลย
// (ถ้ารับ ต่อให้ modal ไม่มีตัวเลือก คนยิง action ตรงก็ยังให้ระดับอื่นได้)
// แอดมินยังปรับระดับทีหลังได้ในตารางผู้ใช้ผ่าน updateMemberRoles
export async function approveJoinRequest(input: {
  requestId: string;
  factoryId: string;
  note?: string;
}): Promise<ActionResult> {
  const ctx = await adminContext(input.factoryId);
  if (!ctx.ok) return ctx;

  const supabase = await createClient();

  const { data: request } = await supabase
    .from("factory_join_requests")
    .select("user_id, factory_id, status, requested_role")
    .eq("id", input.requestId)
    .maybeSingle();

  if (
    !request ||
    request.factory_id !== input.factoryId ||
    request.status !== "pending"
  ) {
    return { ok: false, message: ALREADY_REVIEWED };
  }

  // เพิ่มสมาชิกก่อน แล้วค่อยปิดคำขอ — สองคำสั่งนี้ไม่อยู่ใน transaction เดียวกัน
  // ถ้าขั้นที่สองพัง คำขอยัง pending อยู่ กดอนุมัติซ้ำได้ และ upsert ไม่สร้างแถวซ้ำ
  const { error: memberError } = await supabase.from("factory_members").upsert(
    {
      factory_id: input.factoryId,
      user_id: request.user_id,
      role: request.requested_role,
    },
    { onConflict: "factory_id,user_id" },
  );

  if (memberError) return { ok: false, message: memberError.message };

  const { data, error } = await supabase
    .from("factory_join_requests")
    .update({
      status: "approved",
      reviewed_by: ctx.userId,
      reviewed_at: new Date().toISOString(),
      review_reason: input.note?.trim() || null,
    })
    .eq("id", input.requestId)
    .eq("status", "pending")
    .select("id");

  if (error) return { ok: false, message: error.message };
  if (!data?.length) return { ok: false, message: ALREADY_REVIEWED };

  revalidatePath("/permissions");
  return { ok: true, count: 1 };
}

export async function rejectJoinRequest(input: {
  requestId: string;
  factoryId: string;
  note?: string;
}): Promise<ActionResult> {
  const ctx = await adminContext(input.factoryId);
  if (!ctx.ok) return ctx;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("factory_join_requests")
    .update({
      status: "rejected",
      reviewed_by: ctx.userId,
      reviewed_at: new Date().toISOString(),
      review_reason: input.note?.trim() || null,
    })
    .eq("id", input.requestId)
    .eq("factory_id", input.factoryId)
    .eq("status", "pending")
    .select("id");

  if (error) return { ok: false, message: error.message };
  if (!data?.length) return { ok: false, message: ALREADY_REVIEWED };

  revalidatePath("/permissions");
  return { ok: true, count: 1 };
}

export async function updateMemberRoles(input: {
  factoryId: string;
  // key คือ user id
  changes: Record<string, AccessRole>;
}): Promise<ActionResult> {
  const ctx = await adminContext(input.factoryId);
  if (!ctx.ok) return ctx;

  // แก้สิทธิ์ตัวเองไม่ได้ — กันแอดมินคนสุดท้ายลดระดับตัวเองจนโรงงานไม่มีใครดูแล
  const entries = Object.entries(input.changes).filter(
    ([userId, role]) =>
      userId !== ctx.userId && ACCESS_ROLE_ORDER.includes(role),
  );

  if (entries.length === 0) {
    return { ok: false, message: "ไม่มีการเปลี่ยนแปลงที่บันทึกได้" };
  }

  const supabase = await createClient();
  const results = await Promise.all(
    entries.map(([userId, role]) =>
      supabase
        .from("factory_members")
        .update({ role })
        .eq("factory_id", input.factoryId)
        .eq("user_id", userId)
        .select("user_id"),
    ),
  );

  const count = results.reduce(
    (sum, result) => sum + (result.data?.length ?? 0),
    0,
  );

  // บันทึกไปแล้วบางแถวก็ต้องให้หน้าเห็นค่าล่าสุด แม้จะมีแถวอื่นพัง
  if (count > 0) revalidatePath("/permissions");

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return {
      ok: false,
      message: `บันทึกได้ ${count} จาก ${entries.length} รายการ: ${failed.error.message}`,
    };
  }

  if (count === 0) return { ok: false, message: NOT_ADMIN };

  return { ok: true, count };
}

export async function removeMember(input: {
  factoryId: string;
  userId: string;
}): Promise<ActionResult> {
  const ctx = await adminContext(input.factoryId);
  if (!ctx.ok) return ctx;

  if (input.userId === ctx.userId) {
    return { ok: false, message: "ถอนสิทธิ์ตัวเองไม่ได้" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("factory_members")
    .delete()
    .eq("factory_id", input.factoryId)
    .eq("user_id", input.userId)
    .select("user_id");

  if (error) return { ok: false, message: error.message };
  if (!data?.length) return { ok: false, message: NOT_ADMIN };

  revalidatePath("/permissions");
  return { ok: true, count: 1 };
}
