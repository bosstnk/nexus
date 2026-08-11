"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import { MailIcon, LockIcon, EyeIcon, CheckIcon } from "../components/icons";
import Button from "../components/Button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  // Compute date/greeting on the client only — avoids SSR/CSR hydration mismatch
  const [formattedDate, setFormattedDate] = useState("");
  const [greeting, setGreeting] = useState({ th: "", en: "" });

  useEffect(() => {
    const today = new Date();
    setFormattedDate(
      `${today.toLocaleDateString("en-US", {
        weekday: "short",
      })} · ${today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })}`,
    );

    const hour = today.getHours();
    if (hour < 12) setGreeting({ th: "สวัสดีตอนเช้า", en: "Good morning" });
    else if (hour < 18)
      setGreeting({ th: "สวัสดีตอนบ่าย", en: "Good afternoon" });
    else setGreeting({ th: "สวัสดีตอนเย็น", en: "Good evening" });
  }, []);

  const baseInput =
    "flex flex-row items-center gap-2 bg-white p-3 pl-4 text-b1 text-neutral-900 outline-none border border-neutral-300 rounded-lg placeholder:text-neutral-400 transition-colors focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20";

  return (
    <AuthLayout
      badge={
        <>
          <span>วันนี้</span>
          <span>{formattedDate}</span>
        </>
      }
      eyebrow={
        <>
          {greeting.th}
          <span className="opacity-50">· {greeting.en}</span>
        </>
      }
      headline={
        <>
          One Team, One Goal
          <span className="block text-[25px]">
            เข้าสู่ระบบเพื่อก้าวไปข้างหน้าด้วยกัน
          </span>
        </>
      }
      description="Sorting today, sustaining tomorrow. Small actions today create a better tomorrow."
    >
      <div className="flex min-h-screen flex-col justify-between p-20">
        {/* Cross-link to sign-up */}
        <div className="flex justify-end gap-2 text-body-2 text-neutral-600">
          <span>ยังไม่มีบัญชี? / New here?</span>
          <Link
            href="/signup"
            className="font-medium text-green-600 hover:text-green-700"
          >
            สมัครสมาชิก
          </Link>
        </div>

        <div className="mx-auto w-full max-w-110">
          <h2 className="text-h2 text-neutral-900">เข้าสู่ระบบ</h2>
          <p className="mt-1 text-b2 text-neutral-600">
            Sign in to your operations dashboard
          </p>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  อีเมล
                </span>
                <span className="text-b2 text-neutral-500">Email</span>
              </label>
              <div className={baseInput}>
                <MailIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@nexus.co.th"
                  className="grow outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="flex items-baseline justify-between">
                <span className="text-b2 font-medium text-neutral-600">
                  รหัสผ่าน
                </span>
                <span className="text-b2 text-neutral-500">Password</span>
              </label>
              <div className={baseInput}>
                <LockIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="grow outline-none placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="cursor-pointer h-6 w-6 text-neutral-500 hover:text-neutral-700"
                >
                  <EyeIcon off={showPassword} className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Remember / forgot */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className="flex items-center gap-2 text-b2 text-neutral-600 cursor-pointer"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    remember
                      ? "border-green-400 bg-green-400 text-white"
                      : "border-neutral-400 bg-white text-transparent"
                  }`}
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
                จดจำฉันไว้ / Remember me
              </button>
              <a href="#" className="text-b2 text-blue-500 hover:text-blue-600">
                ลืมรหัสผ่าน?
              </a>
            </div>

            {/* Submit */}
            <Button variant="primary" size="large" type="submit">
              เข้าสู่ระบบ / Sign In
            </Button>

            {/* Help text */}
            <p className="text-center text-body-3 tracking-[0.02em] text-neutral-500">
              Need access? Contact your team lead or{" "}
              <a href="#" className="text-blue-500 hover:text-blue-600">
                IT support →
              </a>
            </p>
          </form>
        </div>

        {/* Copyright */}
        <p className="text-start text-b3 tracking-wider text-neutral-500">
          © 2026 TON SHENG TAI CO., LTD. & BAANTONKAEW CO., LTD. · v1.0
        </p>
      </div>
    </AuthLayout>
  );
}
