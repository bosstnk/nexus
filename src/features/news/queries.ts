import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { NewsItem } from "./types";

// การ์ดข่าวแสดงผู้เขียนเป็น "ชื่อเต็ม / ชื่อย่อ" เช่น "ฝ่ายบุคคล / HR"
const departmentLabel = (
  department: { name: string; code: string } | null,
): string => (department ? `${department.name} / ${department.code}` : "");

// ข่าวเป็นของทั้งบริษัท ตาราง news ไม่มี factory_id จึงไม่รับ factoryId
// ต่างจาก query ของตารางที่ผูกโรงงาน ซึ่งต้องรับเข้ามาเสมอ
export const getNews = cache(async (): Promise<NewsItem[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, summary, image, priority, category, pinned, published_at, departments(name, code)",
    )
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`โหลดข่าวไม่สำเร็จ: ${error.message}`);
  }

  // flatMap แทน filter+map เพื่อให้ TS แคบ published_at ลงเหลือ string ได้เอง
  return (data ?? []).flatMap((row) =>
    row.published_at
      ? [
          {
            id: row.id,
            date: row.published_at,
            title: row.title,
            summary: row.summary ?? "",
            priority: row.priority,
            category: row.category ?? "",
            author: departmentLabel(row.departments),
            img: row.image,
            pinned: row.pinned,
          },
        ]
      : [],
  );
});
