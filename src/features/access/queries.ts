import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/currentUser";
import { themeFor } from "@/features/factory/theme";
import { formatThaiDateTime } from "@/lib/datetime";
import type {
  AccessFactory,
  AccessRequest,
  FactoryMember,
  JoinRequestForReview,
} from "./types";

type ProfileRef = {
  first_name: string;
  last_name: string;
  email: string | null;
} | null;

const displayName = (profile: ProfileRef) =>
  (profile ? `${profile.first_name} ${profile.last_name}`.trim() : "") ||
  "ไม่ทราบชื่อ";

// โรงงานทุกแห่งในระบบ — หน้านี้ต้องโชว์โรงงานที่ "ยังไม่มีสิทธิ์" ด้วย
// จึงใช้ getMyFactories() ไม่ได้ (ตัวนั้นคืนเฉพาะที่สังกัด)
// ต้องมี RLS "read all factories" ถึงจะเห็นครบ
export const getAllFactories = cache(async (): Promise<AccessFactory[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("factories")
    .select("id, name, short_name, location")
    .order("short_name");

  if (error) {
    throw new Error(`โหลดรายชื่อโรงงานไม่สำเร็จ: ${error.message}`);
  }

  return (data ?? []).map((row, index) => ({
    id: row.id,
    code: row.short_name ?? row.name.slice(0, 3).toUpperCase(),
    name: row.name,
    location: row.location,
    ...themeFor(row.short_name, index),
  }));
});

// คำขอของตัวเองทุกสถานะ ใหม่ -> เก่า
export const getMyJoinRequests = cache(async (): Promise<AccessRequest[]> => {
  const { user } = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("factory_join_requests")
    .select(
      "id, factory_id, requested_role, request_reason, status, requested_at, reviewed_at, review_reason",
    )
    .eq("user_id", user.id)
    .order("requested_at", { ascending: false });

  if (error) {
    throw new Error(`โหลดคำขอสิทธิ์ไม่สำเร็จ: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    factoryId: row.factory_id,
    role: row.requested_role,
    status: row.status,
    requestedAt: formatThaiDateTime(row.requested_at),
    reviewedAt: row.reviewed_at ? formatThaiDateTime(row.reviewed_at) : undefined,
    reason: row.request_reason ?? undefined,
    note: row.review_reason ?? undefined,
  }));
});

// ── ฝั่งแอดมิน — รับ factoryId เสมอ ไม่เรียก getCurrentFactory() เอง ──

// คำขอที่รออนุมัติของโรงงานนี้ เก่า -> ใหม่ (ใครขอก่อนได้ดูก่อน)
export const getFactoryJoinRequests = cache(
  async (factoryId: string): Promise<JoinRequestForReview[]> => {
    const supabase = await createClient();

    // ตารางนี้มี FK ไป profiles 2 ตัว (user_id และ reviewed_by)
    // ต้องบอกให้ชัดว่าเอาโปรไฟล์ของ "คนขอ" ไม่งั้น PostgREST แยกไม่ออก
    const { data, error } = await supabase
      .from("factory_join_requests")
      .select(
        "id, user_id, requested_role, request_reason, requested_at, profiles!user_id(first_name, last_name, email)",
      )
      .eq("factory_id", factoryId)
      .eq("status", "pending")
      .order("requested_at", { ascending: true });

    if (error) {
      throw new Error(`โหลดคิวคำขอไม่สำเร็จ: ${error.message}`);
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      userName: displayName(row.profiles),
      userEmail: row.profiles?.email ?? "",
      role: row.requested_role,
      reason: row.request_reason ?? undefined,
      requestedAt: formatThaiDateTime(row.requested_at),
    }));
  },
);

export const getFactoryMembers = cache(
  async (factoryId: string): Promise<FactoryMember[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("factory_members")
      .select("user_id, role, profiles(first_name, last_name, email)")
      .eq("factory_id", factoryId)
      .order("joined_at");

    if (error) {
      throw new Error(`โหลดรายชื่อสมาชิกไม่สำเร็จ: ${error.message}`);
    }

    return (data ?? []).map((row) => ({
      userId: row.user_id,
      name: displayName(row.profiles),
      email: row.profiles?.email ?? "",
      role: row.role,
    }));
  },
);
