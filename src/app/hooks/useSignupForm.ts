"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../supabase.client";
import { PASSWORD_RULES, signupSchema, type SignupForm } from "../schema";

/* Score 0–4 → label + tone. The page maps `tone` to colours; the hook never
   returns class names. */
const STRENGTH = [
  { label: "", tone: "none" },
  { label: "อ่อนมาก", tone: "danger" },
  { label: "อ่อน", tone: "warning" },
  { label: "ปานกลาง", tone: "info" },
  { label: "แข็งแกร่ง", tone: "success" },
] as const;

export type StrengthTone = (typeof STRENGTH)[number]["tone"];
export type ConfirmMatch = "idle" | "match" | "mismatch";

/** "YYYY-MM-DD" from the LOCAL calendar — toISOString() shifts the day in ICT. */
const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

/* ── Supabase errors → Thai ─────────────────────────────────────────────── */

const ERROR_TH: Record<string, string> = {
  // Server-side fallback
  email_address_invalid: "รูปแบบอีเมลไม่ถูกต้อง",
  weak_password: "รหัสผ่านไม่ปลอดภัยพอ กรุณาตั้งรหัสผ่านที่คาดเดายากขึ้น",

  email_exists: "อีเมลนี้ถูกใช้งานแล้ว",
  user_already_exists: "มีบัญชีผู้ใช้นี้อยู่แล้ว",
  email_provider_disabled: "ขณะนี้ระบบปิดรับสมัครด้วยอีเมลชั่วคราว",
  signup_disabled: "ขณะนี้ระบบปิดรับสมัครสมาชิกชั่วคราว",
  over_email_send_rate_limit: "ระบบส่งอีเมลถึงขีดจำกัดแล้ว กรุณาลองใหม่ภายหลัง",
  over_request_rate_limit: "มีคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่",
};

function toThai(error: { code?: string; message: string }): string {
  if (error.code && ERROR_TH[error.code]) return ERROR_TH[error.code];
  return "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
}

/* ── the hook ───────────────────────────────────────────────────────────── */

export function useSignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched", // don't shout while they type the first time…
    reValidateMode: "onChange", // …but correct live once a field has errored
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: undefined, // z.date() has no empty value
      password: "",
      confirmPassword: "",
      agree: undefined, // NOT false — z.literal(true) narrows the type to `true`
    },
  });

  // Live values for the strength meter / match note
  const [password = "", confirmPassword = ""] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  });

  const passwordStrength = useMemo(() => {
    const rules = PASSWORD_RULES.map((r) => ({
      label: r.label,
      met: password.length > 0 && r.test(password),
    }));
    const score = rules.filter((r) => r.met).length;
    return { score, rules, ...STRENGTH[score] };
  }, [password]);
  
  const confirmMatch: ConfirmMatch =
    !touchedFields.confirmPassword || confirmPassword.length === 0
      ? "idle"
      : confirmPassword === password
        ? "match"
        : "mismatch";

  /* handleSubmit validates first — this runs only when everything passes. */
  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          birth_date: toISODate(values.birthDate),
        },
      },
    });

    if (error) {
      console.error("Supabase signup failed:", error.toJSON());
      const message = toThai(error);
      setServerError(message);
      if (message === "อีเมลนี้ถูกใช้งานแล้ว")
        setError("email", { type: "server", message });
      return;
    }

    // Email-enumeration protection: a duplicate address returns NO error, just
    // a decoy user with an empty identities array.
    if (data.user && data.user.identities?.length === 0) {
      setServerError("อีเมลนี้ถูกใช้งานแล้ว");
      setError("email", { type: "server", message: "อีเมลนี้ถูกใช้งานแล้ว" });
      return;
    }

    // Keeps the button disabled through the navigation. Deliberately not
    // formState.isSubmitSuccessful — that also goes true on the error paths
    // above and would disable the button permanently.
    setRedirecting(true);
    router.push(`/confirm-email?email=${encodeURIComponent(values.email)}`);
  });

  return {
    register,
    control,
    errors,
    onSubmit,
    isSubmitting: isSubmitting || redirecting,
    serverError,
    passwordStrength,
    confirmMatch,
  };
}
