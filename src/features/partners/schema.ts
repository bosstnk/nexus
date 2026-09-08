import { z } from "zod";

export const TAX_ID_LENGTH = 13;

export const partnerSchema = z.object({
  name: z
    .string({ error: "กรุณากรอกชื่อบริษัท" })
    .trim()
    .min(1, { error: "กรุณากรอกชื่อบริษัท" }),
  type: z.enum(["buy", "sell", "both"], { error: "กรุณาเลือกประเภทคู่ค้า" }),
  taxId: z
    .string({ error: "กรุณากรอกเลขผู้เสียภาษี" })
    .trim()
    .regex(/^\d{13}$/, { error: `เลขผู้เสียภาษีต้องเป็นตัวเลข ${TAX_ID_LENGTH} หลัก` }),
});

export type PartnerForm = z.infer<typeof partnerSchema>;
