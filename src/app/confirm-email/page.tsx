"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { MailIcon } from "@/components/ui/icons";
import AuthLayout from "@/features/auth/components/AuthLayout";
import Button from "@/components/ui/Button";
import useResendConfirmation from "@/features/auth/hooks/useResendConfirmation";

function ConfirmEmailCard() {
  const raw = useSearchParams().get("email")?.trim() ?? "";
  const email = z.email().safeParse(raw).success ? raw : null;
  const name = email ? email.split("@")[0] : null;

  const { resend, isSending, serverError, remaining, canResend } =
    useResendConfirmation(email);

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,42,26,0.18)]">
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-6 pb-5 pt-5">
        <h2 className="text-b1 font-semibold text-neutral-900">
          ยืนยันอีเมลเพื่อเปิดใช้งานบัญชี Nexus
        </h2>
      </div>

      <div
        className="flex flex-col items-center gap-3 px-6 py-8 text-center text-white"
        style={{
          background:
            "linear-gradient(135deg, #12c66e 0%, #0f9d58 55%, #0c7a44 100%)",
        }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
          <MailIcon className="h-7 w-7 text-white" />
        </div>
        <div className="text-h4 font-semibold">ยืนยันอีเมลของคุณ</div>
        <div className="text-b3 tracking-[0.18em] text-white/80">
          NEXUS · ENTERPRISE MANAGEMENT PLATFORM
        </div>
      </div>

      <div className="flex flex-col gap-4 px-10 py-6">
        <div className="text-b1 font-semibold text-neutral-900">
          {name ? `สวัสดีคุณ ${name} 👋` : "สวัสดี 👋"}
        </div>
        <p className="text-b2 leading-relaxed text-neutral-600">
          ขอบคุณที่สมัครใช้งาน Nexus — เหลืออีกเพียงขั้นตอนเดียว
          เปิดกล่องจดหมายแล้วกดลิงก์ยืนยันที่เราส่งไป เพื่อเปิดใช้งานบัญชีของคุณ
        </p>

        {email && (
          <p className="text-b2 text-neutral-600">
            เราส่งลิงก์ยืนยันไปที่{" "}
            <span className="font-medium break-all text-neutral-900">
              {email}
            </span>
          </p>
        )}

        {email && (
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="xs"
              block
              loading={isSending}
              disabled={!canResend}
              onClick={resend}
            >
              {remaining > 0
                ? `ส่งอีเมลอีกครั้งใน ${remaining} วินาที`
                : "ส่งอีเมลอีกครั้ง"}
            </Button>

            {serverError && (
              <p
                role="alert"
                aria-live="polite"
                className="text-center text-b3 text-danger"
              >
                {serverError}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4 text-center text-b3 text-neutral-500">
        © 2026 Nexus
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <AuthLayout
      badge={<span>เปิดรับสมาชิกใหม่</span>}
      eyebrow=""
      headline=""
      description=""
    >
      <div className="w-full h-full flex items-center justify-center bg-neutral-100">
        <Suspense
          fallback={
            <div className="h-[540px] w-full max-w-3xl animate-pulse rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,42,26,0.18)]" />
          }
        >
          <ConfirmEmailCard />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
