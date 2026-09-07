import type { ComponentType } from "react";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  RepeatIcon,
  type IconProps,
} from "@/components/ui/icons";

export type PartnerType = "buy" | "sell" | "both";

export type Partner = {
  id: number;
  name: string;
  type: PartnerType;
  taxId: string;
};

export const PARTNERS: Partner[] = [
  {
    id: 1,
    name: "บริษัท รีไซเคิล ไทย จำกัด",
    type: "buy",
    taxId: "0105536012346",
  },
  {
    id: 2,
    name: "บริษัท กรีน เมทัล จำกัด",
    type: "sell",
    taxId: "0105545067891",
  },
  {
    id: 3,
    name: "บริษัท ไทย พลาสติก รีไซเคิล จำกัด",
    type: "both",
    taxId: "0105562018470",
  },
  {
    id: 4,
    name: "บริษัท ซันไรส์ เทรดดิ้ง จำกัด",
    type: "buy",
    taxId: "0105577039125",
  },
  {
    id: 5,
    name: "บริษัท ยูไนเต็ด สแครป จำกัด",
    type: "sell",
    taxId: "0105581042569",
  },
  {
    id: 6,
    name: "บริษัท โกลด์ เมทัล จำกัด",
    type: "sell",
    taxId: "0105594087311",
  },
  {
    id: 7,
    name: "บริษัท อีสเทิร์น รีซอร์ส จำกัด",
    type: "both",
    taxId: "0105602156941",
  },
  {
    id: 8,
    name: "ห้างหุ้นส่วนจำกัด สมชายค้าของเก่า",
    type: "buy",
    taxId: "0105619073253",
  },
];

export const PARTNER_TYPES: Record<
  PartnerType,
  { th: string; en: string; icon: ComponentType<IconProps>; chip: string }
> = {
  buy: {
    th: "ผู้ขายให้เรา",
    en: "Supplier",
    icon: ArrowDownLeftIcon,
    chip: "bg-danger-light text-danger-dark border-danger/30",
  },
  sell: {
    th: "ผู้รับซื้อ",
    en: "Buyer",
    icon: ArrowUpRightIcon,
    chip: "bg-green-50 text-green-700 border-green-200",
  },
  both: {
    th: "ทั้งซื้อและขาย",
    en: "Both",
    icon: RepeatIcon,
    chip: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export function formatTaxId(taxId: string) {
  const digits = taxId.replace(/\D/g, "");
  if (digits.length !== 13) return taxId;

  return [
    digits.slice(0, 1),
    digits.slice(1, 5),
    digits.slice(5, 10),
    digits.slice(10, 12),
    digits.slice(12),
  ].join("-");
}
