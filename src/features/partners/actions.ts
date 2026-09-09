"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFactory } from "@/features/factory/currentFactory";
import { partnerSchema, type PartnerForm } from "./schema";

export type ActionResult = { ok: true } | { ok: false; message: string };

const UNIQUE_VIOLATION = "23505";

const TAX_ID_TAKEN =
  "เลขผู้เสียภาษีนี้ถูกใช้กับบริษัทอื่นแล้ว กรุณาตรวจสอบอีกครั้ง";

// หา partner จากเลขภาษี ใช้ตอนที่โรงงานอื่นเพิ่มบริษัทนี้ไว้ก่อนแล้ว
// (tax_id เป็น UNIQUE จึง insert ซ้ำไม่ได้ ต้องผูกเข้ากับแถวเดิมแทน)
async function findPartnerIdByTaxId(taxId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partners")
    .select("id")
    .eq("tax_id", taxId)
    .maybeSingle();

  return data?.id ?? null;
}

export async function savePartner(
  input: PartnerForm,
  partnerId?: string,
): Promise<ActionResult> {
  // ฟอร์ม validate ฝั่ง client แล้ว แต่ client แก้ได้ จึงตรวจซ้ำที่นี่เสมอ
  const parsed = partnerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" };
  }
  const values = parsed.data;

  const factory = await getCurrentFactory();
  if (!factory) return { ok: false, message: "ไม่พบโรงงานที่กำลังใช้งาน" };

  const supabase = await createClient();
  let id = partnerId;

  if (id) {
    // ชื่อกับเลขภาษีอยู่บนแถวกลาง แก้แล้วโรงงานอื่นที่ค้ากับบริษัทนี้เห็นด้วย
    const { error } = await supabase
      .from("partners")
      .update({ company_name: values.name, tax_id: values.taxId })
      .eq("id", id);

    if (error) {
      return {
        ok: false,
        message: error.code === UNIQUE_VIOLATION ? TAX_ID_TAKEN : error.message,
      };
    }
  } else {
    const { data, error } = await supabase
      .from("partners")
      .insert({ company_name: values.name, tax_id: values.taxId })
      .select("id")
      .single();

    if (error) {
      if (error.code !== UNIQUE_VIOLATION) {
        return { ok: false, message: error.message };
      }

      // มีบริษัทนี้ในระบบแล้ว ผูกเข้ากับแถวเดิมโดยไม่แตะชื่อของเขา
      const existing = await findPartnerIdByTaxId(values.taxId);
      if (!existing) return { ok: false, message: TAX_ID_TAKEN };
      id = existing;
    } else {
      id = data.id;
    }
  }

  // upsert เผื่อบริษัทนี้ผูกกับโรงงานอยู่แล้ว — ถือเป็นการเปลี่ยนประเภทแทน
  const { error: linkError } = await supabase
    .from("factory_partners")
    .upsert(
      {
        factory_id: factory.id,
        partner_id: id,
        partner_type: values.type,
      },
      { onConflict: "factory_id,partner_id" },
    );

  if (linkError) return { ok: false, message: linkError.message };

  revalidatePath("/partners");
  return { ok: true };
}

// "ลบ" คือเอาออกจากโรงงานนี้ ไม่ได้ลบบริษัทออกจากระบบ
// เพราะโรงงานอื่นอาจยังค้าขายกับบริษัทเดียวกันอยู่
export async function unlinkPartner(partnerId: string): Promise<ActionResult> {
  const factory = await getCurrentFactory();
  if (!factory) return { ok: false, message: "ไม่พบโรงงานที่กำลังใช้งาน" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("factory_partners")
    .delete()
    .eq("factory_id", factory.id)
    .eq("partner_id", partnerId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/partners");
  return { ok: true };
}
