import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Partner } from "./types";

// รับ factoryId เข้ามาเสมอ ไม่ไปเรียก getCurrentFactory() เอง —
// page เป็นคนตัดสินใจบริบทครั้งเดียวแล้วส่งต่อลงมา
export const getPartners = cache(async (factoryId: string): Promise<Partner[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("factory_partners")
    .select("partner_type, partners(id, company_name, tax_id)")
    .eq("factory_id", factoryId);

  if (error) {
    throw new Error(`โหลดรายชื่อคู่ค้าไม่สำเร็จ: ${error.message}`);
  }

  return (data ?? [])
    .flatMap((row) =>
      row.partners
        ? [
            {
              id: row.partners.id,
              name: row.partners.company_name,
              type: row.partner_type,
              taxId: row.partners.tax_id,
            },
          ]
        : [],
    )
    .sort((a, b) => a.name.localeCompare(b.name, "th"));
});
