import type { ComponentType } from "react";
import { z } from "zod";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ShoppingCartIcon,
  type IconProps,
} from "@/components/ui/icons";

export type SaleType = "buy" | "sell";

export type SaleRecord = {
  id: number;
  factoryId: string;
  type: SaleType;
  date: string;
  partner: string;
  materials: string[];
  weight: number;
  amount: number;
  submittedBy: string;
};

export const SALES_META = {
  titleTh: "รายการซื้อขาย",
  titleEn: "Sales & Purchases",
  tabLabel: "ซื้อขาย",
  icon: ShoppingCartIcon,
  tile: "bg-orange-50 text-orange-600",
  accent: "text-orange-600",
};

export const SALE_TYPES: Record<
  SaleType,
  { th: string; en: string; icon: ComponentType<IconProps>; chip: string }
> = {
  sell: {
    th: "ขาย",
    en: "Sell",
    icon: ArrowUpRightIcon,
    chip: "bg-green-50 text-green-700 border-green-200",
  },
  buy: {
    th: "ซื้อ",
    en: "Buy",
    icon: ArrowDownLeftIcon,
    chip: "bg-danger-light text-danger-dark border-danger/30",
  },
};

export const MIXED_MATERIAL = "คละ/ยังไม่คัดแยก";

export const MATERIAL_OPTIONS = [
  MIXED_MATERIAL,
  "เหล็ก",
  "อลูมิเนียม",
  "ทองแดง",
  "พลาสติก",
  "กระดาษ",
  "แก้ว",
  "ยาง",
  "สิ่งทอ",
  "อื่นๆ",
];

// TODO: ชั่วคราว — data-entry ยังไม่มีตารางใน DB จึงยังใช้รายชื่อสมมติ
// เมื่อทำตาราง sales แล้วให้ดึงจาก getPartners(factoryId) ส่งลงมาเป็น prop แทน
const MOCK_PARTNER_NAMES = [
  "บริษัท รีไซเคิล ไทย จำกัด",
  "บริษัท กรีน เมทัล จำกัด",
  "บริษัท ไทย พลาสติก รีไซเคิล จำกัด",
  "บริษัท ซันไรส์ เทรดดิ้ง จำกัด",
  "บริษัท ยูไนเต็ด สแครป จำกัด",
  "บริษัท โกลด์ เมทัล จำกัด",
  "บริษัท อีสเทิร์น รีซอร์ส จำกัด",
  "ห้างหุ้นส่วนจำกัด สมชายค้าของเก่า",
];

export const PARTNER_OPTIONS = MOCK_PARTNER_NAMES.map((name) => ({
  value: name,
  label: name,
}));

export const SALE_RECORDS: SaleRecord[] = [
  {
    id: 101,
    factoryId: "tst",
    type: "sell",
    date: "2025-01-15",
    partner: "บริษัท กรีน เมทัล จำกัด",
    materials: ["เหล็ก"],
    weight: 12.5,
    amount: 187500,
    submittedBy: "สมชาย",
  },
  {
    id: 102,
    factoryId: "tst",
    type: "buy",
    date: "2025-01-18",
    partner: "บริษัท รีไซเคิล ไทย จำกัด",
    materials: [MIXED_MATERIAL],
    weight: 8.2,
    amount: 41000,
    submittedBy: "สมชาย",
  },
  {
    id: 103,
    factoryId: "btk",
    type: "sell",
    date: "2025-01-20",
    partner: "บริษัท ไทย พลาสติก รีไซเคิล จำกัด",
    materials: ["พลาสติก"],
    weight: 6.8,
    amount: 34000,
    submittedBy: "มานะ",
  },
  {
    id: 104,
    factoryId: "tst",
    type: "sell",
    date: "2025-02-05",
    partner: "บริษัท ยูไนเต็ด สแครป จำกัด",
    materials: ["อลูมิเนียม", "ทองแดง", "เหล็ก"],
    weight: 3.4,
    amount: 102000,
    submittedBy: "วิชัย",
  },
  {
    id: 105,
    factoryId: "btk",
    type: "buy",
    date: "2025-02-10",
    partner: "บริษัท ซันไรส์ เทรดดิ้ง จำกัด",
    materials: ["กระดาษ", "แก้ว"],
    weight: 15,
    amount: 30000,
    submittedBy: "มานะ",
  },
  {
    id: 106,
    factoryId: "tst",
    type: "sell",
    date: "2025-03-12",
    partner: "บริษัท โกลด์ เมทัล จำกัด",
    materials: ["ทองแดง"],
    weight: 2.1,
    amount: 189000,
    submittedBy: "สมชาย",
  },
];

const positiveNumber = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `กรุณากรอก${label}` })
    .refine((raw) => Number.isFinite(Number(raw)) && Number(raw) > 0, {
      error: `${label}ต้องมากกว่า 0`,
    });

export const salesFormSchema = z.object({
  type: z.enum(["buy", "sell"]),
  date: z.string().min(1, { error: "กรุณาเลือกวันที่" }),
  partner: z.string().min(1, { error: "กรุณาเลือกบริษัทคู่ค้า" }),
  materials: z
    .array(z.string())
    .min(1, { error: "เลือกอย่างน้อย 1 ประเภทวัสดุ" }),
  weight: positiveNumber("น้ำหนักรวม"),
  amount: positiveNumber("จำนวนเงิน"),
});

export type SalesFormValues = z.infer<typeof salesFormSchema>;

export function toggleMaterial(current: string[], material: string) {
  if (material === MIXED_MATERIAL) {
    return current.includes(MIXED_MATERIAL) ? [] : [MIXED_MATERIAL];
  }

  const withoutMixed = current.filter((item) => item !== MIXED_MATERIAL);
  return withoutMixed.includes(material)
    ? withoutMixed.filter((item) => item !== material)
    : [...withoutMixed, material];
}
