"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { confirmRedirectTo, toThai } from "../authErrors";

const COOLDOWN_SECONDS = 60;

export default function useResendConfirmation(email: string | null) {
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);

  const deadlineRef = useRef(0);

  const isCoolingDown = remaining > 0;
  const canResend = Boolean(email) && !isSending && !isCoolingDown;

  useEffect(() => {
    if (!isCoolingDown) return;

    const id = setInterval(() => {
      const left = Math.ceil((deadlineRef.current - Date.now()) / 1000);
      setRemaining(left > 0 ? left : 0);
    }, 1000);

    return () => clearInterval(id);
  }, [isCoolingDown]);

  const startCooldown = useCallback(() => {
    deadlineRef.current = Date.now() + COOLDOWN_SECONDS * 1000;
    setRemaining(COOLDOWN_SECONDS);
  }, []);

  const resend = useCallback(async () => {
    if (!email || !canResend) return;

    setIsSending(true);
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: confirmRedirectTo() },
    });

    setIsSending(false);

    if (error) {
      console.error("Supabase resend failed:", error.toJSON());
      setServerError(toThai(error, "ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"));

      const rateLimited =
        error.code === "over_email_send_rate_limit" ||
        error.code === "over_request_rate_limit";
      if (rateLimited) startCooldown();
      return;
    }

    startCooldown();
  }, [email, canResend, startCooldown]);

  return { resend, isSending, serverError, remaining, canResend };
}
