import type { ComponentType } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  LockIcon,
  PencilIcon,
  ShieldCheckIcon,
  XCircleIcon,
  type IconProps,
} from "@/components/ui/icons";
import type { AccessRole, FactoryAccessState } from "./types";

type Meta = {
  th: string;
  en: string;
  icon: ComponentType<IconProps>;
  chip: string;
};

// คลาส Tailwind ต้องเขียนเป็น literal เท่านั้น — ประกอบชื่อคลาสจากตัวแปรแล้วจะโดน purge
// (เหตุผลเดียวกับ features/factory/theme.ts)
export const ACCESS_ROLES: Record<AccessRole, Meta & { desc: string }> = {
  viewer: {
    th: "ดูอย่างเดียว",
    en: "Viewer",
    desc: "ดูรายงานและข้อมูลได้ แต่แก้ไขไม่ได้",
    icon: EyeIcon,
    chip: "bg-neutral-100 text-neutral-700 border-neutral-300",
  },
  // ค่าใน DB คือ "member" แต่สิ่งที่ทำได้คือบันทึกข้อมูล ป้ายจึงใช้คำนั้น
  member: {
    th: "บันทึกข้อมูล",
    en: "Member",
    desc: "บันทึก แก้ไข และลบข้อมูลของโรงงานได้",
    icon: PencilIcon,
    chip: "bg-green-50 text-green-700 border-green-200",
  },
  admin: {
    th: "ผู้ดูแล",
    en: "Admin",
    desc: "จัดการข้อมูลและอนุมัติสิทธิ์ผู้ใช้อื่น",
    icon: ShieldCheckIcon,
    chip: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export const ACCESS_ROLE_ORDER: AccessRole[] = ["viewer", "member", "admin"];

// rail = แถบสีด้านซ้ายของการ์ด · ใช้ตอนที่ยังไม่มีสิทธิ์ (ถ้ามีสิทธิ์แล้วใช้สีประจำโรงงาน)
export const REQUEST_STATES: Record<
  FactoryAccessState["key"],
  Meta & { rail: string }
> = {
  granted: {
    th: "มีสิทธิ์แล้ว",
    en: "Granted",
    icon: CheckCircleIcon,
    chip: "bg-green-50 text-green-700 border-green-200",
    rail: "border-l-green-400",
  },
  pending: {
    th: "รออนุมัติ",
    en: "Pending",
    icon: ClockIcon,
    chip: "bg-warning-light text-warning-dark border-warning",
    rail: "border-l-warning",
  },
  rejected: {
    th: "ถูกปฏิเสธ",
    en: "Rejected",
    icon: XCircleIcon,
    chip: "bg-danger-light text-danger-dark border-danger/30",
    rail: "border-l-danger",
  },
  none: {
    th: "ยังไม่มีสิทธิ์",
    en: "No access",
    icon: LockIcon,
    chip: "bg-neutral-100 text-neutral-600 border-neutral-300",
    rail: "border-l-neutral-300",
  },
};
