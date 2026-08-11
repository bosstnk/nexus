"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { MailIcon, ClockIcon } from "../components/icons";
import AuthLayout from "../components/AuthLayout";

function ConfirmEmailCard() {
  // Validate before displaying so a junk ?email= can never be echoed as a name
  const raw = useSearchParams().get("email")?.trim() ?? "";
  const email = z.email().safeParse(raw).success ? raw : null;
  const name = email ? email.split("@")[0] : null;

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,42,26,0.18)]">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-b3 text-neutral-500">Inbox · 10:24</span>
      </div>

      {/* Subject + sender */}
      <div className="flex flex-col gap-3 px-6 pb-5 pt-5">
        <h2 className="text-b1 font-semibold text-neutral-900">
          ยืนยันอีเมลเพื่อเปิดใช้งานบัญชี Nexus
        </h2>
      </div>

      {/* Green hero banner */}
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
          TST &amp; BTK - RECYCLING MANAGEMENT
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 px-10 py-6">
        <div className="text-b1 font-semibold text-neutral-900">
          {name ? `สวัสดีคุณ ${name} 👋` : "สวัสดี 👋"}
        </div>
        <p className="text-b2 leading-relaxed text-neutral-600">
          ขอบคุณที่สมัครใช้งานระบบจัดการข้อมูลโรงงาน Nexus —
          เหลืออีกเพียงขั้นตอนเดียว
          กดปุ่มด้านล่างเพื่อยืนยันอีเมลและเปิดใช้งานบัญชีได้ทันที
        </p>

        {email ? (
          <p className="text-b2 text-neutral-600">
            เราส่งลิงก์ยืนยันไปที่{" "}
            <span className="font-medium break-all text-neutral-900">
              {email}
            </span>
          </p>
        ) : (
          <div className="rounded-lg border border-warning/40 bg-warning-light px-4 py-3 text-b2 text-warning-dark">
            ไม่พบอีเมลที่ใช้สมัคร —{" "}
            <Link href="/signup" className="font-medium underline">
              กลับไปหน้าสมัครสมาชิก
            </Link>
          </div>
        )}

        {/* Expiry notice */}
        <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-b2 text-neutral-600">
          <ClockIcon className="h-[18px] w-[18px] shrink-0 text-blue-500" />
          <span>
            ลิงก์ยืนยันจะหมดอายุใน{" "}
            <span className="font-medium text-neutral-900">15 นาที</span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4 text-center text-b3 text-neutral-500">
        © 2026 TON SHENG TAI CO., LTD. & BAANTONKAEW CO., LTD.
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
        {/* useSearchParams bails out of prerendering — without this boundary
            `next build` fails with missing-suspense-with-csr-bailout. */}
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
