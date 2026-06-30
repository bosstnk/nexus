"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import picShow from "../../../public/images/Picture_01.png";
import logo from "../../../public/images/Logo.png";
import { MailIcon, LockIcon, EyeIcon, CheckIcon } from "../components/icons";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  // Compute date/greeting on the client only — avoids SSR/CSR hydration mismatch
  const [formattedDate, setFormattedDate] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const today = new Date();
    setFormattedDate(
      `${today.toLocaleDateString("en-US", {
        weekday: "short",
      })} · ${today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })}`
    );

    const hour = today.getHours();
    if (hour < 12) setGreeting("สวัสดีตอนเช้า Good morning");
    else if (hour < 18) setGreeting("สวัสดีตอนบ่าย Good afternoon");
    else setGreeting("สวัสดีตอนเย็น good evening");
  }, []);

  const baseInput =
    "flex flex-row items-center gap-2 bg-white p-3 pl-4 text-b1 text-neutral-900 outline-none border border-neutral-300 rounded-lg placeholder:text-neutral-400 transition-colors focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20";

  return (
    <div className="flex min-h-screen">
      {/* ── Left hero panel ─────────────────────────────────── */}
      <aside className="relative w-2/5 shrink-0 flex flex-col justify-between overflow-hidden bg-green-600 px-8 pb-9 pt-8 text-white">
        {/* Background photo */}
        <Image
          src={picShow}
          alt="team image"
          fill
          priority
          unoptimized
          sizes="40vw"
          className="inset-0 object-cover"
        />
        {/* Gradient + tint overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,42,26,0.72) 0%, rgba(12,42,26,0.2) 30%, rgba(12,42,26,0.15) 55%, rgba(12,42,26,0.88) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%), linear-gradient(120deg, rgba(18,198,110,0.1) 0%, rgba(0,0,0,0) 50%, rgba(46,107,240,0.12) 100%)",
          }}
        />
        {/* Warm glow blob — upper-right */}
        <div
          className="absolute right-[-40px] top-[-60px] h-[260px] w-[260px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,236,170,0.45), rgba(0,0,0,0) 65%)",
            animation: "tb-pulse 6s ease-in-out infinite",
          }}
        />
        {/* Floating leaves — เรืองแสงลอยขึ้น + หมุนรอบตัว */}
        {[
          {
            left: "12%",
            delay: "0s",
            dur: "14s",
            size: 18,
            rot: -20,
            color: "#92eebe",
          },
          {
            left: "28%",
            delay: "4s",
            dur: "18s",
            size: 14,
            rot: 12,
            color: "#4ddd96",
          },
          {
            left: "46%",
            delay: "8s",
            dur: "16s",
            size: 22,
            rot: -8,
            color: "#c8f5dd",
          },
          {
            left: "62%",
            delay: "2s",
            dur: "20s",
            size: 16,
            rot: 30,
            color: "#92eebe",
          },
          {
            left: "78%",
            delay: "11s",
            dur: "17s",
            size: 20,
            rot: -28,
            color: "#4ddd96",
          },
          {
            left: "88%",
            delay: "6s",
            dur: "22s",
            size: 12,
            rot: 18,
            color: "#c8f5dd",
          },
        ].map((l, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="pointer-events-none absolute"
            style={{
              left: l.left,
              bottom: -30,
              width: l.size,
              height: l.size,
              opacity: 0.85,
              animation: `tb-drift ${l.dur} linear ${l.delay} infinite`,
            }}
            aria-hidden="true"
          >
            <path
              d="M12 2 C 6 6, 4 14, 12 22 C 20 14, 18 6, 12 2 Z M12 5 L12 21"
              fill={l.color}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.6"
              transform={`rotate(${l.rot} 12 12)`}
            />
          </svg>
        ))}

        {/* Top bar: brand + date badge */}
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="relative flex h-15 w-15 items-center justify-center rounded-lg overflow-hidden bg-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
              <Image src={logo} alt="TST & BTK" fill className="object-cover" />
            </div>
            <div>
              <div className="text-h5 tracking-wider text-white">
                TST &amp; BTK
              </div>
              <div className="text-b1 text-white/85">
                ระบบจัดการจัดการข้อมูล
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-[12px] py-[6px] backdrop-blur-sm">
            <span
              className="h-[6px] w-[6px] rounded-full bg-green-300 shadow-[0_0_0_3px_rgba(18,198,110,0.35)]"
              style={{ animation: "tb-pulse 2s ease-in-out infinite" }}
            />
            <span className="text-b3 text-white">วันนี้</span>
            <span className="text-b3 text-white">{formattedDate}</span>
          </div>
        </div>

        {/* Middle: greeting / headline */}
        <div className="relative">
          <div className="flex items-center gap-3 text-b2 font-medium tracking-[0.08em] text-green-200">
            <span className="h-px w-8 bg-green-300" />
            {greeting}
          </div>
          <h1 className="text-h1 mt-4 text-white">One Team, One Goal</h1>
          <h1 className="text-h2 text-white">
            เข้าสู่ระบบเพื่อก้าวไปข้างหน้าด้วยกัน
          </h1>
          <p className="mt-3 max-w-[450px] text-b2 text-white/85">
            Sorting today, sustaining tomorrow. Small actions today create a
            better tomorrow.
          </p>
        </div>

        {/* Bottom tagline */}
        <div className="relative flex items-center gap-3 text-body-3 tracking-wider text-white/75">
          <span className="h-px w-7 bg-white/50" />
          Circular Economy · Thailand · since 2022
        </div>
      </aside>

      {/* ── Right form panel ────────────────────────────────── */}
      <main className="flex flex-1 flex-col justify-between px-[90px] py-[64px]">
        {/* New-here link */}
        <div className="flex justify-end gap-1.5 text-body-2 text-neutral-600">
          <span>ยังไม่มีบัญชี? / New here?</span>
          <Link
            href="/signup"
            className="font-medium text-green-600 hover:text-green-700"
          >
            สมัครสมาชิก →
          </Link>
        </div>

        {/* Form block */}
        <div className="mx-auto w-full max-w-[420px]">
          <h2 className="text-h2 leading-tight text-neutral-900">
            เข้าสู่ระบบ
          </h2>
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
                <span className="text-b3 text-neutral-500">Email</span>
              </label>
              <div className={baseInput}>
                <MailIcon className="pointer-events-none h-[18px] w-[18px] text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@tst-btk.co.th"
                  className="grow outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  รหัสผ่าน
                </span>
                <span className="text-b3 text-neutral-500">Password</span>
              </label>
              <div className={baseInput}>
                <LockIcon className="pointer-events-none h-[18px] w-[18px] text-neutral-500" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="grow outline-none placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="pointer-events-none h-[18px] w-[18px] text-neutral-500 hover:text-neutral-700"
                >
                  <EyeIcon off={showPassword} className="h-[18px] w-[18px]" />
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
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors ${
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
            <button
              type="submit"
              className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-green-400 text-base font-medium text-white transition-colors hover:bg-green-500 active:bg-green-600"
            >
              เข้าสู่ระบบ / Sign In
            </button>

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
      </main>
    </div>
  );
}
