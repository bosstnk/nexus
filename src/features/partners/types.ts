import type { Database } from "@/lib/supabase/database.types";

// purchase = เราซื้อจากเขา (ผู้ขายให้เรา) · sale = เราขายให้เขา (ผู้รับซื้อ)
export type PartnerType = Database["public"]["Enums"]["partner_type"];

// ชื่อกับเลขภาษีอยู่บนแถว partners ที่ใช้ร่วมกันทุกโรงงาน
// ส่วน type มาจาก factory_partners จึงเป็นของโรงงานที่กำลังดูอยู่เท่านั้น
export type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  taxId: string;
};
