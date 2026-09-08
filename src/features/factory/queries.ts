import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/currentUser";
import { themeFor } from "./theme";
import type { Factory } from "./types";

// รายชื่อโรงงานที่ "ผู้ใช้คนนี้" สังกัด ไม่ใช่โรงงานทั้งหมดในระบบ
// เป็นทั้งตัวเลือกใน dropdown และเป็นด่านตรวจว่า cookie ชี้ไปโรงงานที่มีสิทธิ์จริง
export const getMyFactories = cache(async (): Promise<Factory[]> => {
  const { user } = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("factory_members")
    .select("role, joined_at, factories(id, name, short_name, location)")
    .eq("user_id", user.id)
    .order("joined_at");

  // RLS ที่ปฏิเสธจะคืน array ว่าง ไม่ใช่ error — ที่หลุดมาถึงตรงนี้คือปัญหาจริง
  // (ตารางหาย, คอลัมน์ผิด, ต่อ DB ไม่ได้) ปล่อยให้ error.tsx จับดีกว่ากลืนไว้
  if (error) {
    throw new Error(`โหลดรายชื่อโรงงานไม่สำเร็จ: ${error.message}`);
  }

  return (data ?? [])
    .flatMap((row) => (row.factories ? [{ role: row.role, factory: row.factories }] : []))
    .map(({ role, factory }, index) => ({
      id: factory.id,
      code: factory.short_name ?? factory.name.slice(0, 3).toUpperCase(),
      name: factory.name,
      location: factory.location,
      role,
      ...themeFor(factory.short_name, index),
    }));
});
