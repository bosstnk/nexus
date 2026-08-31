import { z } from "zod";

/* ── shared helpers — login / reset-password schemas will reuse these ────── */

const requiredString = (message: string) =>
  z.string({ error: message }).trim().min(1, { error: message });

/* ── password rules ─────────────────────────────────────────────────────────
   One source of truth for both the zod chain below and the requirement chips
   on the signup page, so the two can never drift apart.                     */

export const MIN_PASSWORD_LENGTH = 8;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_DIGIT = /[0-9]/;
const HAS_SYMBOL = /[^A-Za-z0-9]/;

export const PASSWORD_RULES = [
  {
    label: "8 ตัวอักษรขึ้นไป",
    test: (v: string) => v.length >= MIN_PASSWORD_LENGTH,
  },
  { label: "มีตัวพิมพ์ใหญ่", test: (v: string) => HAS_UPPERCASE.test(v) },
  { label: "มีตัวเลข", test: (v: string) => HAS_DIGIT.test(v) },
  { label: "มีอักขระพิเศษ", test: (v: string) => HAS_SYMBOL.test(v) },
] as const;

/* ── signup ─────────────────────────────────────────────────────────────── */

export const signupSchema = z
  .object({
    firstName: requiredString("กรุณากรอกชื่อ"),
    lastName: requiredString("กรุณากรอกนามสกุล"),

    email: z
      .string({ error: "กรุณากรอกอีเมล" })
      .trim()
      .toLowerCase()
      .min(1, { error: "กรุณากรอกอีเมล" })
      .pipe(z.email({ error: "รูปแบบอีเมลไม่ถูกต้อง" })),

    // plain 10 digits — the input is not auto-formatted, so no dashes here
    phone: requiredString("กรุณากรอกเบอร์โทรศัพท์").regex(/^[0-9]{10}$/, {
      error: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก",
    }),

    birthDate: z.date({ error: "กรุณาเลือกวันเกิด" }),

    password: z
      .string({ error: "กรุณากรอกรหัสผ่าน" })
      .min(MIN_PASSWORD_LENGTH, {
        error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
      })
      .regex(HAS_UPPERCASE, { error: "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว" })
      .regex(HAS_DIGIT, { error: "ต้องมีตัวเลขอย่างน้อย 1 ตัว" })
      .regex(HAS_SYMBOL, { error: "ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว" }),

    confirmPassword: z
      .string({ error: "กรุณายืนยันรหัสผ่าน" })
      .min(1, { error: "กรุณายืนยันรหัสผ่าน" }),

    agree: z.literal(true, {
      error: "กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    error: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

/* No field changes the *type* of its value (only trim/lowercase), so zod's
   input and output types are identical — one type is enough. */
export type SignupForm = z.infer<typeof signupSchema>;

/* ── login ─────────────────────────────────────────────────────────────── */
export const loginSchema = z.object({
  email: z
    .string({ error: "กรุณากรอกอีเมล" })
    .trim()
    .toLowerCase()
    .min(1, { error: "กรุณากรอกอีเมล" })
    .pipe(z.email({ error: "รูปแบบอีเมลไม่ถูกต้อง" })),
  /* Plain .min(1), not requiredString(): that helper trims, and
     signupSchema.password does not. Trimming here would lock out anyone whose
     password has a leading/trailing space. */
  password: z
    .string({ error: "กรุณากรอกรหัสผ่าน" })
    .min(1, { error: "กรุณากรอกรหัสผ่าน" }),
});

export type LoginForm = z.infer<typeof loginSchema>;