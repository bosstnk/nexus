import type { ComponentType } from "react";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  RepeatIcon,
  type IconProps,
} from "@/components/ui/icons";
import type { PartnerType } from "./types";

export const PARTNER_TYPES: Record<
  PartnerType,
  { th: string; en: string; icon: ComponentType<IconProps>; chip: string }
> = {
  purchase: {
    th: "ผู้ขายให้เรา",
    en: "Supplier",
    icon: ArrowDownLeftIcon,
    chip: "bg-danger-light text-danger-dark border-danger/30",
  },
  sale: {
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
