"use client";
import Image from "next/image";
import { useState } from "react";
import picShow from "../../../public/images/Picture_13.png";
import logo from "../../../public/images/Logo.png";
import Link from "next/link";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  CheckIcon,
  UserIcon,
  PhoneIcon,
} from "../components/icons";
import DatePicker from "../components/DatePicker";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [dob, setDob] = useState<Date | null>(null);

  // password requirement chips — static (visual only, shown as "met")
  const passwordRules = [
    "8 ตัวอักษรขึ้นไป",
    "มีตัวพิมพ์ใหญ่",
    "มีตัวเลข",
    "มีอักขระพิเศษ",
  ];

  const baseInput =
    "w-full flex flex-row items-center gap-2 bg-white p-3 pl-4 text-b1 text-neutral-900 outline-none border border-neutral-300 rounded-lg placeholder:text-neutral-400 transition-colors focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20";

  return (
    <div className="flex min-h-screen">
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
            <span className="text-b3 text-white">เปิดรับสมาชิกใหม่</span>
          </div>
        </div>

        {/* Middle: greeting / headline */}
        <div className="relative">
          <div className="flex items-center gap-3 text-b2 font-medium tracking-[0.08em] text-green-200">
            <span className="h-px w-8 bg-green-300" />
            ยินดีต้อนรับ · Welcome
          </div>
          <h1 className="text-h1 mt-4 text-white">
            ร่วมสร้างสิ่งที่ยั่งยืนไปด้วยกัน — ตั้งแต่วันนี้
          </h1>
          <p className="mt-3 max-w-[450px] text-b2 text-white/85">
            Be Part of the Change Join us in building a more sustainable future.
          </p>
        </div>

        {/* Bottom tagline */}
        <div className="relative flex items-center gap-3 text-body-3 tracking-wider text-white/75">
          <span className="h-px w-7 bg-white/50" />
          Circular Economy · Thailand · since 2022
        </div>
      </aside>
      <main className="flex flex-1 flex-col justify-center px-[90px] py-[64px]">
        {/* New-here link */}
        <div className="flex justify-end gap-1.5 text-body-2 text-neutral-600">
          <span>มีบัญชีอยู่แล้ว? / Already a member?</span>
          <Link
            href="/login"
            className="font-medium text-green-600 hover:text-green-700"
          >
            เข้าสู่ระบบ →
          </Link>
        </div>

        {/* Form block */}
        <div className="mx-auto w-full max-w-3xl px-6">
          <h2 className="text-h2 leading-tight text-neutral-900">
            สมัครสมาชิก
          </h2>
          <p className="mt-1 text-b2 text-neutral-600">
            Create your TB account
          </p>

          <form
            className="mt-8 flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* First and Last Name */}
            <div className="flex flex-row gap-6">
              <div className="w-full min-w-0 flex flex-col gap-1">
                <label
                  htmlFor="firstname"
                  className="flex items-baseline justify-between"
                >
                  <span className="text-b2 font-medium text-neutral-600">
                    ชื่อ
                  </span>
                  <span className="text-b3 text-neutral-500">First name</span>
                </label>
                <div className={baseInput}>
                  <UserIcon className="pointer-events-none h-[18px] w-[18px] text-neutral-500" />
                  <input
                    id="firstname"
                    type="text"
                    placeholder="First name"
                    className="w-full min-w-0 grow outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>
              <div className="w-full min-w-0 flex flex-col gap-1">
                <label
                  htmlFor="lastname"
                  className="flex items-baseline justify-between"
                >
                  <span className="text-b2 font-medium text-neutral-600">
                    นามสกุล
                  </span>
                  <span className="text-b3 text-neutral-500">Last name</span>
                </label>
                <div className={baseInput}>
                  <UserIcon className="pointer-events-none h-[18px] w-[18px] text-neutral-500" />
                  <input
                    id="lastname"
                    type="text"
                    placeholder="Last name"
                    className="w-full min-w-0 grow outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>
            </div>
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  อีเมล
                </span>
                <span className="text-b3 text-neutral-500">Email address</span>
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
            {/* Phone and Date of birth */}
            <div className="flex flex-row gap-6">
              <div className="w-full flex flex-col gap-1">
                <label
                  htmlFor="phone"
                  className="flex items-baseline justify-between"
                >
                  <span className="text-b2 font-medium text-neutral-600">
                    เบอร์โทรศัพท์
                  </span>
                  <span className="text-b3 text-neutral-500">Phone</span>
                </label>
                <div className={baseInput}>
                  <PhoneIcon className="pointer-events-none h-[18px] w-[18px] text-neutral-500" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="xxx-xxx-xxxx"
                    className="w-full min-w-0 grow outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <label
                  htmlFor="birthdate"
                  className="flex items-baseline justify-between"
                >
                  <span className="text-b2 font-medium text-neutral-600">
                    วันเกิด
                  </span>
                  <span className="text-b3 text-neutral-500">
                    Date of birth
                  </span>
                </label>
                <DatePicker
                  id="birthdate"
                  value={dob}
                  onChange={setDob}
                  maxDate={new Date()}
                  className={baseInput}
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
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="grow outline-none placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="h-[18px] w-[18px] text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  <EyeIcon off={showPassword} className="h-[18px] w-[18px]" />
                </button>
              </div>

              {/* Strength meter — static, segmented (4 ขีด) + label ตาม design */}
              <div className="mt-2 flex items-center gap-10">
                <div className="flex grow items-center gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 grow rounded-full bg-green-500"
                    />
                  ))}
                </div>
                <span className="shrink-0 text-b3 font-medium text-green-600">
                  แข็งแกร่ง
                </span>
              </div>

              {/* Requirement chips — static (met) ตาม design: ดอตเขียว + เช็คขาว + ข้อความ */}
              <div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-2">
                {passwordRules.map((rule) => (
                  <span
                    key={rule}
                    className="flex items-center gap-1 text-b3 text-green-700"
                  >
                    <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-green-400">
                      <CheckIcon className="h-2 w-2 text-white" />
                    </span>
                    {rule}
                  </span>
                ))}
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirm-password"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  ยืนยันรหัสผ่าน
                </span>
                <span className="text-b3 text-neutral-500">
                  Confirm password
                </span>
              </label>
              <div className={baseInput}>
                <LockIcon className="pointer-events-none h-[18px] w-[18px] text-neutral-500" />
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="grow outline-none placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="h-[18px] w-[18px] text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  <EyeIcon off={showConfirm} className="h-[18px] w-[18px]" />
                </button>
              </div>
              {/* Match note — static */}
              <span className="mt-1 flex items-center gap-1 text-b3 text-green-600">
                <CheckIcon className="h-3 w-3" />
                รหัสผ่านตรงกัน
              </span>
            </div>

            {/* PDPA consent */}
            <button
              type="button"
              onClick={() => setAgree((v) => !v)}
              className="flex items-start gap-2 text-left text-b2 text-neutral-600 cursor-pointer"
            >
              <span
                className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors ${
                  agree
                    ? "border-green-400 bg-green-400 text-white"
                    : "border-neutral-400 bg-white text-transparent"
                }`}
              >
                <CheckIcon className="h-3 w-3" />
              </span>
              <span>
                ฉันยอมรับ{" "}
                <a href="#" className="text-green-600 hover:text-green-700">
                  เงื่อนไขการใช้งาน
                </a>{" "}
                และ{" "}
                <a href="#" className="text-green-600 hover:text-green-700">
                  นโยบายความเป็นส่วนตัว
                </a>{" "}
                (PDPA) · I agree to the Terms &amp; Privacy Policy
              </span>
            </button>

            {/* Submit */}
            <button
              type="submit"
              className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-green-400 text-base font-medium text-white transition-colors hover:bg-green-500 active:bg-green-600"
            >
              สมัครสมาชิก / Create account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
