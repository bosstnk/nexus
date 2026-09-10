import type { Database } from "@/lib/supabase/database.types";

export type EntryKind = "electricity" | "water" | "workforce";

export type TransactionType = Database["public"]["Enums"]["transaction_type"];

// DB เก็บ report_month เป็น date (วันแรกของเดือน) แต่ฟอร์มใช้ปี+เดือนแยกกัน
// และ month ที่นี่เป็น 0-11 ให้ตรงกับ Date.getMonth() กับ formatThaiMonthYear()
// การแปลงไป-กลับอยู่ที่ queries.ts / actions.ts เท่านั้น
export type EntryRecord = {
  id: string;
  kind: EntryKind;
  year: number;
  month: number;
  values: Record<string, number>;
  createdBy: string;
  createdAt: string;
  canEdit: boolean;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  date: string;
  partnerId: string;
  partnerName: string;
  materialId: string;
  materialName: string;
  weightKg: number;
  amount: number;
  createdBy: string;
  createdAt: string;
  canEdit: boolean;
};

export type Material = {
  id: string;
  name: string;
};

export const UTILITY_TABLES = {
  electricity: "electricity_reports",
  water: "water_reports",
  workforce: "workforce_reports",
} as const satisfies Record<EntryKind, string>;

// วันแรกของเดือนในรูปแบบ YYYY-MM-DD ตามกติกาของคอลัมน์ report_month
export const toReportMonth = (year: number, month: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-01`;

export const fromReportMonth = (value: string) => {
  const [year, month] = value.split("-");
  return { year: Number(year), month: Number(month) - 1 };
};
