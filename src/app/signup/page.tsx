"use client";
import clsx from "clsx";
import Link from "next/link";
import { Controller } from "react-hook-form";
import AuthLayout from "@/features/auth/components/AuthLayout";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  CheckIcon,
  UserIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button";
import { useSignupForm, StrengthTone } from "@/features/auth/hooks/useSignupForm";
import usePasswordVisibility from "@/features/auth/hooks/usePasswordVisibility";
import FieldError from "@/components/ui/FieldError";
import { inputBox } from "@/components/ui/formStyles";

const TONE_CLASSES: Record<StrengthTone, { bar: string; text: string }> = {
  none: { bar: "bg-neutral-200", text: "text-neutral-400" },
  danger: { bar: "bg-danger", text: "text-danger" },
  warning: { bar: "bg-warning", text: "text-warning-dark" },
  info: { bar: "bg-blue-400", text: "text-blue-600" },
  success: { bar: "bg-green-500", text: "text-green-600" },
};

export default function SignupPage() {
  const {
    register,
    control,
    errors,
    onSubmit,
    isSubmitting,
    serverError,
    passwordStrength,
    confirmMatch,
  } = useSignupForm();

  const passwordVisibility = usePasswordVisibility();
  const confirmVisibility = usePasswordVisibility();

  const toneClass = TONE_CLASSES[passwordStrength.tone];

  return (
    <AuthLayout
      badge={<span>เปิดรับสมาชิกใหม่</span>}
      eyebrow={
        <>
          ยินดีต้อนรับ
          <span className="opacity-50">· Welcome</span>
        </>
      }
      headline="ร่วมสร้างสิ่งที่ยั่งยืนไปด้วยกัน — ตั้งแต่วันนี้"
      description="Be Part of the Change Join us in building a more sustainable future."
    >
      <div className="flex min-h-screen flex-col gap-10 p-20">
        {/* Cross-link to login */}
        <div className="flex justify-end gap-2 text-body-2 text-neutral-600">
          <span>มีบัญชีอยู่แล้ว? / Already a member?</span>
          <Link
            href="/login"
            className="font-medium text-green-600 hover:text-green-700"
          >
            เข้าสู่ระบบ
          </Link>
        </div>

        <div className="w-full">
          <h2 className="text-h2 leading-tight text-neutral-900">
            สมัครสมาชิก
          </h2>
          <p className="mt-1 text-b2 text-neutral-600">
            Create your Nexus account
          </p>

          <form
            className="mt-8 grid grid-cols-2 gap-y-7 gap-x-6"
            onSubmit={onSubmit}
            noValidate
          >
            {/* First Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="firstname"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  ชื่อ
                </span>
                <span className="text-b2 text-neutral-500">First name</span>
              </label>
              <div className={inputBox(errors.firstName)}>
                <UserIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
                <input
                  id="firstname"
                  type="text"
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  className="w-full min-w-0 grow outline-none"
                  {...register("firstName")}
                />
              </div>
              <FieldError message={errors.firstName?.message} />
            </div>
            {/* Last Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="lastname"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  นามสกุล
                </span>
                <span className="text-b2 text-neutral-500">Last name</span>
              </label>
              <div className={inputBox(errors.lastName)}>
                <UserIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
                <input
                  id="lastname"
                  type="text"
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  className="w-full min-w-0 grow outline-none"
                  {...register("lastName")}
                />
              </div>
              <FieldError message={errors.lastName?.message} />
            </div>
            {/* Email */}
            <div className="flex flex-col gap-1 col-span-2">
              <label
                htmlFor="email"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  อีเมล
                </span>
                <span className="text-b2 text-neutral-500">Email address</span>
              </label>
              <div className={inputBox(errors.email)}>
                <MailIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className="grow outline-none"
                  {...register("email")}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>
            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  เบอร์โทรศัพท์
                </span>
                <span className="text-b2 text-neutral-500">Phone</span>
              </label>
              <div className={inputBox(errors.phone)}>
                <PhoneIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  className="w-full min-w-0 grow outline-none"
                  {...register("phone")}
                />
              </div>
              <FieldError message={errors.phone?.message} />
            </div>
            {/* Date of birth */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="birthdate"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  วันเกิด
                </span>
                <span className="text-b2 text-neutral-500">Date of birth</span>
              </label>
              <Controller
                control={control}
                name="birthDate"
                render={({ field, fieldState }) => (
                  <DatePicker
                    id="birthdate"
                    value={field.value ?? null}
                    onChange={(d) => {
                      field.onChange(d);
                      field.onBlur();
                    }}
                    maxDate={new Date()}
                    className={inputBox(fieldState.error)}
                  />
                )}
              />
              <FieldError message={errors.birthDate?.message} />
            </div>
            {/* Password */}
            <div className="flex flex-col gap-1 col-span-2">
              <label
                htmlFor="password"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  รหัสผ่าน
                </span>
                <span className="text-b2 text-neutral-500">Password</span>
              </label>
              <div className={inputBox(errors.password)}>
                <LockIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
                <input
                  id="password"
                  type={passwordVisibility.inputType}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  className="grow outline-none"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={passwordVisibility.toggleVisibility}
                  aria-label={
                    passwordVisibility.isVisible
                      ? "ซ่อนรหัสผ่าน"
                      : "แสดงรหัสผ่าน"
                  }
                  className="cursor-pointer h-6 w-6 text-neutral-500 hover:text-neutral-700"
                >
                  <EyeIcon
                    off={passwordVisibility.isVisible}
                    className="h-6 w-6"
                  />
                </button>
              </div>
              {/* Strength meter — 4 ขีด, filled by how many rules pass */}
              <div className="mt-2 flex items-center gap-10">
                <div className="flex grow items-center gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={clsx(
                        "h-1 grow rounded-full transition-colors",
                        i < passwordStrength.score
                          ? toneClass.bar
                          : "bg-neutral-200",
                      )}
                    />
                  ))}
                </div>
                <span
                  className={clsx(
                    "min-w-16 shrink-0 text-right text-b3 font-medium transition-colors",
                    toneClass.text,
                  )}
                >
                  {passwordStrength.label || " "}
                </span>
              </div>

              {/* Requirement chips — ดอต + เช็ค + ข้อความ, ติ๊กทีละข้อตามที่พิมพ์ */}
              <div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-2">
                {passwordStrength.rules.map((rule) => (
                  <span
                    key={rule.label}
                    className={clsx(
                      "flex items-center gap-1 text-b3 transition-colors",
                      rule.met ? "text-green-700" : "text-neutral-500",
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-3 w-3 shrink-0 items-center justify-center rounded-full transition-colors",
                        rule.met ? "bg-green-400" : "bg-neutral-300",
                      )}
                    >
                      {/* always rendered so the dot never resizes */}
                      <CheckIcon
                        className={clsx(
                          "h-2 w-2",
                          rule.met ? "text-white" : "text-transparent",
                        )}
                      />
                    </span>
                    {rule.label}
                  </span>
                ))}
              </div>
            </div>
            {/* Confirm password */}
            <div className="flex flex-col gap-1 col-span-2">
              <label
                htmlFor="confirm-password"
                className="flex items-baseline justify-between"
              >
                <span className="text-b2 font-medium text-neutral-600">
                  ยืนยันรหัสผ่าน
                </span>
                <span className="text-b2 text-neutral-500">
                  Confirm password
                </span>
              </label>
              <div
                className={inputBox(
                  errors.confirmPassword || confirmMatch === "mismatch",
                )}
              >
                <LockIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
                <input
                  id="confirm-password"
                  type={confirmVisibility.inputType}
                  autoComplete="new-password"
                  aria-invalid={confirmMatch === "mismatch"}
                  className="grow outline-none"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={confirmVisibility.toggleVisibility}
                  aria-label={
                    confirmVisibility.isVisible
                      ? "ซ่อนรหัสผ่าน"
                      : "แสดงรหัสผ่าน"
                  }
                  className="cursor-pointer h-6 w-6 text-neutral-500 hover:text-neutral-700"
                >
                  <EyeIcon
                    off={confirmVisibility.isVisible}
                    className="h-6 w-6"
                  />
                </button>
              </div>

              {/* Match note — the derived state wins while the field has content,
                  because zod's object-level .refine is skipped whenever another
                  field is still invalid. */}
              {confirmMatch === "idle" ? (
                errors.confirmPassword ? (
                  <FieldError message={errors.confirmPassword.message} />
                ) : (
                  <span className="invisible text-b3">&nbsp;</span>
                )
              ) : (
                <span
                  className={clsx(
                    "mt-1 flex items-center gap-1 text-b3",
                    confirmMatch === "match" ? "text-green-600" : "text-danger",
                  )}
                >
                  {confirmMatch === "match" && (
                    <CheckIcon className="h-3 w-3" />
                  )}
                  {confirmMatch === "match"
                    ? "รหัสผ่านตรงกัน"
                    : "รหัสผ่านไม่ตรงกัน"}
                </span>
              )}
            </div>
            {/* PDPA consent */}
            <div className="col-span-2 flex flex-col gap-1">
              <Controller
                control={control}
                name="agree"
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(field.value !== true);
                      field.onBlur();
                    }}
                    aria-pressed={field.value === true}
                    className="flex items-start gap-2 text-left text-b2 text-neutral-600 cursor-pointer"
                  >
                    <span
                      className={clsx(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                        field.value === true
                          ? "border-green-400 bg-green-400 text-white"
                          : errors.agree
                            ? "border-danger bg-white text-transparent"
                            : "border-neutral-400 bg-white text-transparent",
                      )}
                    >
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span>
                      ฉันยอมรับ{" "}
                      <a
                        href="#"
                        className="text-green-600 hover:text-green-700"
                      >
                        เงื่อนไขการใช้งาน
                      </a>{" "}
                      และ{" "}
                      <a
                        href="#"
                        className="text-green-600 hover:text-green-700"
                      >
                        นโยบายความเป็นส่วนตัว
                      </a>{" "}
                      (PDPA) · I agree to the Terms &amp; Privacy Policy
                    </span>
                  </button>
                )}
              />
              <FieldError message={errors.agree?.message} />
            </div>

            {/* Server error */}
            {serverError && (
              <div
                role="alert"
                className="col-span-2 rounded-lg border border-danger/30 bg-danger-light px-4 py-3 text-b2 text-danger-dark"
              >
                {serverError}
              </div>
            )}

            {/* Submit */}
            <Button
              variant="primary"
              size="large"
              type="submit"
              block
              loading={isSubmitting}
              className="col-span-2"
            >
              สมัครสมาชิก / Create account
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
