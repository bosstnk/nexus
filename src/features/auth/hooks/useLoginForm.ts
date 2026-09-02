"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginForm } from "../schema";
import { LOGIN_FAILED, toThai } from "../authErrors";

export function useLoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      console.error("Supabase login failed:", error.toJSON());
      // No setError("email", ...) — highlighting the email field on a failed
      // login is an enumeration hint. Banner only.
      setServerError(toThai(error, LOGIN_FAILED));
      return;
    }

    setRedirecting(true);
    router.push("/home");
    // The Router Cache may still hold the logged-out RSC payload for /home.
    // refresh() re-renders it on the server with the cookies just written.
    router.refresh();
  });

  return {
    register,
    errors,
    onSubmit,
    isSubmitting: isSubmitting || redirecting,
    serverError,
  };
}
