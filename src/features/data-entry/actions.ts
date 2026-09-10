"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/currentUser";
import { getCurrentFactory } from "@/features/factory/currentFactory";
import {
  toReportMonth,
  type EntryKind,
  type TransactionType,
} from "./types";

export type ActionResult = { ok: true } | { ok: false; message: string };

const UNIQUE_VIOLATION = "23505";

const MONTH_TAKEN = "เดือนนี้มีข้อมูลอยู่แล้ว กรุณาแก้ไขรายการเดิมแทน";

const NOT_ALLOWED =
  "แก้ไขไม่ได้ — แก้ได้ภายใน 1 วันหลังบันทึกเท่านั้น หลังจากนั้นต้องให้ผู้ดูแลโรงงานแก้ให้";

export type UtilityInput = {
  kind: EntryKind;
  year: number;
  month: number;
  values: Record<string, number>;
};

function invalid(values: Record<string, number>) {
  return Object.values(values).some(
    (value) => !Number.isFinite(value) || value <= 0,
  );
}

export async function saveUtilityReport(
  input: UtilityInput,
  recordId?: string,
): Promise<ActionResult> {
  if (input.month < 0 || input.month > 11 || invalid(input.values)) {
    return { ok: false, message: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" };
  }

  const [{ user }, factory] = await Promise.all([
    requireUser(),
    getCurrentFactory(),
  ]);
  if (!factory) return { ok: false, message: "ไม่พบโรงงานที่กำลังใช้งาน" };

  const supabase = await createClient();
  const report_month = toReportMonth(input.year, input.month);
  const updated_at = new Date().toISOString();
  const values = input.values;

  // ตอนแก้ไม่แตะ report_month — ฟอร์มล็อกเดือนไว้แล้ว และกันไม่ให้ชน unique constraint
  const base = { updated_at };
  const forInsert = { ...base, report_month, factory_id: factory.id, created_by: user.id };
  const onConflict = { onConflict: "factory_id,report_month" } as const;

  // แตก switch แทนที่จะประกอบชื่อตารางเป็นตัวแปร เพราะ Supabase ผูก type ของ
  // payload กับชื่อตาราง — แบบนี้เขียนคอลัมน์ผิดตารางแล้ว compile ไม่ผ่าน
  //
  // แก้ของเดิม: update ตรง id ถ้าย้ายไปเดือนที่มีข้อมูลแล้วจะชน unique constraint
  // สร้างใหม่: upsert เพื่อทับเดือนเดิม ตรงกับที่ฟอร์มเตือนไว้ว่า "จะเขียนทับ"
  const run = () => {
    switch (input.kind) {
      case "electricity": {
        const cols = {
          consumption_kwh: values.consumption_kwh,
          cost: values.cost,
        };
        return recordId
          ? supabase
              .from("electricity_reports")
              .update({ ...base, ...cols })
              .eq("id", recordId)
              .select("id")
          : supabase
              .from("electricity_reports")
              .upsert({ ...forInsert, ...cols }, onConflict)
              .select("id");
      }
      case "water": {
        const cols = {
          consumption_m3: values.consumption_m3,
          cost: values.cost,
        };
        return recordId
          ? supabase
              .from("water_reports")
              .update({ ...base, ...cols })
              .eq("id", recordId)
              .select("id")
          : supabase
              .from("water_reports")
              .upsert({ ...forInsert, ...cols }, onConflict)
              .select("id");
      }
      case "workforce": {
        const cols = { headcount: Math.round(values.headcount) };
        return recordId
          ? supabase
              .from("workforce_reports")
              .update({ ...base, ...cols })
              .eq("id", recordId)
              .select("id")
          : supabase
              .from("workforce_reports")
              .upsert({ ...forInsert, ...cols }, onConflict)
              .select("id");
      }
    }
  };

  const { data, error } = await run();

  if (error) {
    return {
      ok: false,
      message: error.code === UNIQUE_VIOLATION ? MONTH_TAKEN : error.message,
    };
  }

  // RLS ปฏิเสธจะไม่ error แต่จะไม่มีแถวไหนถูกแตะ
  if (!data?.length) return { ok: false, message: NOT_ALLOWED };

  revalidatePath("/records");
  return { ok: true };
}

export async function deleteUtilityReport(
  kind: EntryKind,
  recordId: string,
): Promise<ActionResult> {
  const factory = await getCurrentFactory();
  if (!factory) return { ok: false, message: "ไม่พบโรงงานที่กำลังใช้งาน" };

  const supabase = await createClient();

  const run = () => {
    switch (kind) {
      case "electricity":
        return supabase.from("electricity_reports").delete();
      case "water":
        return supabase.from("water_reports").delete();
      case "workforce":
        return supabase.from("workforce_reports").delete();
    }
  };

  const { data, error } = await run()
    .eq("id", recordId)
    .eq("factory_id", factory.id)
    .select("id");

  if (error) return { ok: false, message: error.message };
  if (!data?.length) return { ok: false, message: NOT_ALLOWED };

  revalidatePath("/records");
  return { ok: true };
}

export type TransactionInput = {
  type: TransactionType;
  date: string;
  partnerId: string;
  materialId: string;
  weightKg: number;
  amount: number;
};

// buy ต้องเป็นคู่ค้าที่ purchase หรือ both · sell ต้องเป็น sale หรือ both
// FK ธรรมดาบังคับไม่ได้เพราะต้องดู factory_id + partner_id + partner_type พร้อมกัน
const ALLOWED_PARTNER_TYPES: Record<TransactionType, string[]> = {
  buy: ["purchase", "both"],
  sell: ["sale", "both"],
};

export async function saveTransaction(
  input: TransactionInput,
  transactionId?: string,
): Promise<ActionResult> {
  if (
    !Number.isFinite(input.weightKg) ||
    input.weightKg <= 0 ||
    !Number.isFinite(input.amount) ||
    input.amount <= 0 ||
    !input.date
  ) {
    return { ok: false, message: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" };
  }

  const [{ user }, factory] = await Promise.all([
    requireUser(),
    getCurrentFactory(),
  ]);
  if (!factory) return { ok: false, message: "ไม่พบโรงงานที่กำลังใช้งาน" };

  const supabase = await createClient();

  const { data: link } = await supabase
    .from("factory_partners")
    .select("partner_type")
    .eq("factory_id", factory.id)
    .eq("partner_id", input.partnerId)
    .maybeSingle();

  if (!link) {
    return { ok: false, message: "คู่ค้ารายนี้ไม่ได้อยู่ในทะเบียนของโรงงานนี้" };
  }

  if (!ALLOWED_PARTNER_TYPES[input.type].includes(link.partner_type)) {
    return {
      ok: false,
      message:
        input.type === "buy"
          ? "รายการซื้อต้องเลือกคู่ค้าประเภท ผู้ขายให้เรา หรือ ทั้งสองอย่าง"
          : "รายการขายต้องเลือกคู่ค้าประเภท ผู้รับซื้อ หรือ ทั้งสองอย่าง",
    };
  }

  const columns = {
    type: input.type,
    transaction_date: input.date,
    partner_id: input.partnerId,
    material_id: input.materialId,
    weight_kg: input.weightKg,
    amount: input.amount,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = transactionId
    ? await supabase
        .from("transactions")
        .update(columns)
        .eq("id", transactionId)
        .select("id")
    : await supabase
        .from("transactions")
        .insert({ ...columns, factory_id: factory.id, created_by: user.id })
        .select("id");

  if (error) return { ok: false, message: error.message };
  if (!data?.length) return { ok: false, message: NOT_ALLOWED };

  revalidatePath("/records");
  return { ok: true };
}

export async function deleteTransaction(
  transactionId: string,
): Promise<ActionResult> {
  const factory = await getCurrentFactory();
  if (!factory) return { ok: false, message: "ไม่พบโรงงานที่กำลังใช้งาน" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("factory_id", factory.id)
    .select("id");

  if (error) return { ok: false, message: error.message };
  if (!data?.length) return { ok: false, message: NOT_ALLOWED };

  revalidatePath("/records");
  return { ok: true };
}
