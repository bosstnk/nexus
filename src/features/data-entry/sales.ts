import type { ComponentType } from "react";
import { z } from "zod";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ShoppingCartIcon,
  type IconProps,
} from "@/components/ui/icons";
import type { TransactionType } from "./types";

export const SALES_META = {
  titleTh: "รายการซื้อขาย",
  titleEn: "Sales & Purchases",
  tabLabel: "ซื้อขาย",
  icon: ShoppingCartIcon,
  tile: "bg-orange-50 text-orange-600",
  accent: "text-orange-600",
};

export const SALE_TYPES: Record<
  TransactionType,
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

// ชื่อวัสดุที่ให้สีต่างจากตัวอื่นในฟอร์ม — ต้องตรงกับแถวใน materials
export const MIXED_MATERIAL = "คละ/ยังไม่คัดแยก";

// buy ต้องคู่กับคู่ค้าที่ purchase/both · sell ต้องคู่กับ sale/both
// ใช้กรอง dropdown ฝั่ง client ส่วนที่บังคับจริงอยู่ใน saveTransaction()
export const PARTNER_TYPES_FOR: Record<TransactionType, string[]> = {
  buy: ["purchase", "both"],
  sell: ["sale", "both"],
};

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
  partnerId: z.string().min(1, { error: "กรุณาเลือกบริษัทคู่ค้า" }),
  materialId: z.string().min(1, { error: "กรุณาเลือกประเภทวัสดุ" }),
  weight: positiveNumber("น้ำหนักรวม"),
  amount: positiveNumber("จำนวนเงิน"),
});

export type SalesFormValues = z.infer<typeof salesFormSchema>;
