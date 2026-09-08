import type { Database } from "@/lib/supabase/database.types";

// ผูกกับ enum ใน DB โดยตรง ถ้ามีการเพิ่ม/ลบระดับความสำคัญ PRIORITY_CONFIG
// กับ FILTERS จะพังตอน compile แทนที่จะเงียบไปจนเจอตอนใช้งาน
export type Priority = Database["public"]["Enums"]["news_priority"];

export type NewsItem = {
  id: string;
  date: string;
  title: string;
  summary: string;
  priority: Priority;
  category: string;
  author: string;
  img: string | null;
  pinned: boolean;
};
