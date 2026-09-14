import type { Database } from "@/lib/supabase/database.types";
import type { FactoryTheme } from "@/features/factory/types";

type Enums = Database["public"]["Enums"];

// ผูกกับ enum ใน DB โดยตรง — ถ้า enum เปลี่ยน ACCESS_ROLES จะพังตอน compile
export type AccessRole = Enums["factory_role"];

export type RequestStatus = Enums["join_request_status"];

// โรงงานทุกแห่งในระบบ — ไม่ใช่แค่ที่ตัวเองสังกัด จึงไม่มี role ติดมาเหมือน Factory
export type AccessFactory = FactoryTheme & {
  id: string;
  code: string;
  name: string;
  location: string | null;
};

export type AccessRequest = {
  id: string;
  factoryId: string;
  role: AccessRole;
  status: RequestStatus;
  // จัดรูปแบบไว้แล้วสำหรับแสดงผล เช่น "10 ก.ย. 2569 09:12"
  requestedAt: string;
  reviewedAt?: string;
  // เหตุผลที่คนขอกรอกเอง — ไม่บังคับ จึงเว้นว่างได้
  reason?: string;
  // หมายเหตุจากผู้ดูแลตอนอนุมัติ/ปฏิเสธ
  note?: string;
};

// สถานะของโรงงานหนึ่งแห่งเมื่อมองจากผู้ใช้คนนี้
export type FactoryAccessState =
  | { key: "granted"; role: AccessRole }
  | { key: "pending"; request: AccessRequest }
  | { key: "rejected"; request: AccessRequest }
  | { key: "none" };

export type FactoryAccessRow = {
  factory: AccessFactory;
  state: FactoryAccessState;
};

// ── ฝั่งแอดมิน ────────────────────────────────────────────────

// คำขอที่แอดมินเห็น — ต้องรู้ว่าใครขอ ต่างจาก AccessRequest ที่เป็นของตัวเอง
export type JoinRequestForReview = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: AccessRole;
  reason?: string;
  requestedAt: string;
};

export type FactoryMember = {
  userId: string;
  name: string;
  email: string;
  role: AccessRole;
};
