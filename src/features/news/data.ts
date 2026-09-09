import type { ComponentType } from "react";
import {
  FactoryIcon,
  LeafIcon,
  MegaphoneIcon,
  NewspaperIcon,
  ShieldAlertIcon,
  type IconProps,
} from "@/components/ui/icons";
import type { Priority } from "./types";

export const PRIORITY_BADGE =
  "rounded-full px-2 py-1 text-body-3 font-semibold text-white";

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; labelEn: string; badge: string }
> = {
  urgent: {
    label: "เร่งด่วน",
    labelEn: "Urgent",
    badge: "bg-warning-dark",
  },
  high: {
    label: "สำคัญ",
    labelEn: "High",
    badge: "bg-danger-dark",
  },
  normal: {
    label: "ปกติ",
    labelEn: "Normal",
    badge: "bg-green-600",
  },
  info: {
    label: "ข้อมูล",
    labelEn: "Info",
    badge: "bg-blue-500",
  },
};

type CategoryMeta = {
  icon: ComponentType<IconProps>;
  solid: string;
  chip: string;
  panel: string;
};

// category ใน DB เป็น varchar อิสระ ไม่ใช่ enum จึงต้องมี fallback เสมอ
const CATEGORY_META: Record<string, CategoryMeta> = {
  ประกาศ: {
    icon: MegaphoneIcon,
    solid: "bg-green-600",
    chip: "bg-green-600/10 text-green-600",
    panel: "bg-linear-to-br from-green-600/15 to-green-600/5 text-green-600",
  },
  ความปลอดภัย: {
    icon: ShieldAlertIcon,
    solid: "bg-danger-dark",
    chip: "bg-danger-dark/10 text-danger-dark",
    panel:
      "bg-linear-to-br from-danger-dark/15 to-danger-dark/5 text-danger-dark",
  },
  การดำเนินงาน: {
    icon: FactoryIcon,
    solid: "bg-blue-500",
    chip: "bg-blue-500/10 text-blue-500",
    panel: "bg-linear-to-br from-blue-500/15 to-blue-500/5 text-blue-500",
  },
  สิ่งแวดล้อม: {
    icon: LeafIcon,
    solid: "bg-green-500",
    chip: "bg-green-500/10 text-green-500",
    panel: "bg-linear-to-br from-green-500/15 to-green-500/5 text-green-500",
  },
};

const FALLBACK_CATEGORY: CategoryMeta = {
  icon: NewspaperIcon,
  solid: "bg-green-500",
  chip: "bg-green-500/10 text-green-500",
  panel: "bg-linear-to-br from-green-500/15 to-green-500/5 text-green-500",
};

export const catMeta = (category: string): CategoryMeta =>
  CATEGORY_META[category] ?? FALLBACK_CATEGORY;
