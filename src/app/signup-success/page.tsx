"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import { supabase } from "../supabase.client";

type State =
  | { status: "loading" }
  | { status: "ready"; email: string }
  | { status: "no-session"; expired: boolean };

const ctaClass =
  "mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-green-400 text-base font-medium text-white transition-colors hover:bg-green-500 active:bg-green-600";

export default function SignupSuccessPage() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const expired = window.location.hash.includes("error");

    let cancelled = false;

    supabase.auth.getSession().then(({ data, error }) => {
      if (cancelled) return;

      const email = data.session?.user.email;
      if (error || !email) {
        setState({ status: "no-session", expired });
        return;
      }
      setState({ status: "ready", email });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthLayout
      badge={<span>เปิดรับสมาชิกใหม่</span>}
      eyebrow=""
      headline=""
      description=""
    >
      <div className="flex h-full w-full items-center justify-center bg-neutral-100 px-8 py-12">
        {state.status === "loading" ? (
          <div className="h-[420px] w-full max-w-[440px] animate-pulse rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,42,26,0.18)]" />
        ) : state.status === "no-session" ? (
          <div className="w-full max-w-[440px] rounded-2xl bg-white px-8 py-10 text-center shadow-[0_24px_60px_rgba(15,42,26,0.18)]">
            <h2 className="text-h2 leading-tight text-neutral-900">
              {state.expired ? "ลิงก์หมดอายุแล้ว" : "ยังไม่ได้ยืนยันอีเมล"}
            </h2>
            <p className="mt-2 text-b2 leading-relaxed text-neutral-600">
              {state.expired
                ? "ลิงก์ยืนยันนี้ใช้ไม่ได้หรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง"
                : "กรุณาเปิดลิงก์ยืนยันจากอีเมลของคุณอีกครั้ง"}
            </p>
            <Link href="/signup" className={ctaClass}>
              กลับไปสมัครสมาชิก
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-[440px] rounded-2xl bg-white px-8 py-10 text-center shadow-[0_24px_60px_rgba(15,42,26,0.18)]">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full bg-green-100"
                style={{ animation: "tb-pulse 2.4s ease-in-out infinite" }}
              />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_10px_24px_rgba(18,198,110,0.45)]">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12l5 5L20 6" />
                </svg>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1">
              <span className="h-[6px] w-[6px] rounded-full bg-green-400 shadow-[0_0_0_3px_rgba(18,198,110,0.25)]" />
              <span className="text-b3 font-medium tracking-wide text-green-700">
                Email verified
              </span>
            </div>

            <h2 className="mt-4 text-h2 leading-tight text-neutral-900">
              ยืนยันอีเมลสำเร็จ! 🎉
            </h2>

            <p className="mt-2 text-b2 leading-relaxed text-neutral-600">
              อีเมล{" "}
              <span className="font-medium break-all text-neutral-900">
                {state.email}
              </span>
              <br />
              <span>ได้รับการยืนยันเรียบร้อยแล้ว</span>
            </p>

            <Link href="/home" className={ctaClass}>
              เริ่มต้นใช้งาน
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
