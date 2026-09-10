import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getMyFactories } from "@/features/factory/queries";
import { canEditRecord } from "./permissions";
import {
  fromReportMonth,
  type EntryRecord,
  type Material,
  type Transaction,
} from "./types";

type ProfileRef = { first_name: string; last_name: string } | null;

type CommonRow = {
  id: string;
  created_by: string;
  created_at: string;
  profiles: ProfileRef;
};

const displayName = (profile: ProfileRef) =>
  profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";

// role ของผู้ใช้ในโรงงานนี้ — ใช้ตัดสินว่าปุ่มแก้/ลบจะโผล่ไหม
// getMyFactories() ถูก cache() ไว้แล้ว เรียกซ้ำกี่ query ก็ไม่เปลือง
const viewerRole = cache(async (factoryId: string) => {
  const factories = await getMyFactories();
  return factories.find((factory) => factory.id === factoryId)?.role ?? "member";
});

export const getUtilityReports = cache(
  async (factoryId: string): Promise<EntryRecord[]> => {
    const supabase = await createClient();
    const role = await viewerRole(factoryId);

    const PROFILE = "created_by, created_at, profiles(first_name, last_name)";

    const [electricity, water, workforce] = await Promise.all([
      supabase
        .from("electricity_reports")
        .select(`id, report_month, consumption_kwh, cost, ${PROFILE}`)
        .eq("factory_id", factoryId),
      supabase
        .from("water_reports")
        .select(`id, report_month, consumption_m3, cost, ${PROFILE}`)
        .eq("factory_id", factoryId),
      supabase
        .from("workforce_reports")
        .select(`id, report_month, headcount, ${PROFILE}`)
        .eq("factory_id", factoryId),
    ]);

    const failed = [electricity, water, workforce].find((result) => result.error);
    if (failed?.error) {
      throw new Error(`โหลดข้อมูลสาธารณูปโภคไม่สำเร็จ: ${failed.error.message}`);
    }

    const common = (row: CommonRow & { report_month: string }) => ({
      ...fromReportMonth(row.report_month),
      createdBy: displayName(row.profiles),
      createdAt: row.created_at,
      canEdit: canEditRecord({ createdAt: row.created_at, role }),
    });

    // key ของ values ตรงกับชื่อคอลัมน์ใน DB และตรงกับ metric.key ใน ENTRY_SCHEMAS
    return [
      ...(electricity.data ?? []).map((row) => ({
        id: row.id,
        kind: "electricity" as const,
        values: { consumption_kwh: row.consumption_kwh, cost: row.cost },
        ...common(row),
      })),
      ...(water.data ?? []).map((row) => ({
        id: row.id,
        kind: "water" as const,
        values: { consumption_m3: row.consumption_m3, cost: row.cost },
        ...common(row),
      })),
      ...(workforce.data ?? []).map((row) => ({
        id: row.id,
        kind: "workforce" as const,
        values: { headcount: row.headcount },
        ...common(row),
      })),
    ];
  },
);

export const getTransactions = cache(
  async (factoryId: string): Promise<Transaction[]> => {
    const supabase = await createClient();
    const role = await viewerRole(factoryId);

    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, type, transaction_date, weight_kg, amount, partner_id, material_id, created_by, created_at, partners(company_name), materials(name), profiles(first_name, last_name)",
      )
      .eq("factory_id", factoryId)
      .order("transaction_date", { ascending: false });

    if (error) {
      throw new Error(`โหลดรายการซื้อขายไม่สำเร็จ: ${error.message}`);
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      type: row.type,
      date: row.transaction_date,
      partnerId: row.partner_id,
      partnerName: row.partners?.company_name ?? "",
      materialId: row.material_id,
      materialName: row.materials?.name ?? "",
      weightKg: row.weight_kg,
      amount: row.amount,
      createdBy: displayName(row.profiles),
      createdAt: row.created_at,
      canEdit: canEditRecord({ createdAt: row.created_at, role }),
    }));
  },
);

// วัสดุเป็นข้อมูลกลาง ใช้ชุดเดียวกันทุกโรงงาน
// เรียงตาม created_at เพื่อคงลำดับที่ seed ไว้ ("คละ/ยังไม่คัดแยก" มาก่อน)
export const getMaterials = cache(async (): Promise<Material[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("materials")
    .select("id, name")
    .order("created_at");

  if (error) {
    throw new Error(`โหลดประเภทวัสดุไม่สำเร็จ: ${error.message}`);
  }

  return data ?? [];
});
