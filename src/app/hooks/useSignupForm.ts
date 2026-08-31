"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "../lib/supabase/client";
import { PASSWORD_RULES, signupSchema, type SignupForm } from "../schema";
import { EMAIL_TAKEN, confirmRedirectTo, toThai } from "../lib/authErrors";

const STRENGTH = [
  { label: "", tone: "none" },
  { label: "อ่อนมาก", tone: "danger" },
  { label: "อ่อน", tone: "warning" },
  { label: "ปานกลาง", tone: "info" },
  { label: "แข็งแกร่ง", tone: "success" },
] as const;

export type StrengthTone = (typeof STRENGTH)[number]["tone"];
export type ConfirmMatch = "idle" | "match" | "mismatch";

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

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
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: undefined,
      password: "",
      confirmPassword: "",
      agree: undefined,
    }
  });

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

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: confirmRedirectTo(),
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
      const message = toThai(
        error,
        "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
      setServerError(message);
      if (message === EMAIL_TAKEN)
        setError("email", { type: "server", message });
      return;
    }

    if (data.user && data.user.identities?.length === 0) {
      setServerError(EMAIL_TAKEN);
      setError("email", { type: "server", message: EMAIL_TAKEN });
      return;
    }

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
