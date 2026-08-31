"use client";

import { MailIcon, LockIcon, EyeIcon } from "../components/icons";
import Button from "../components/Button";
import FieldError from "../components/FieldError";
import { inputBox } from "../components/formStyles";
import { useLoginForm } from "../hooks/useLoginForm";
import usePasswordVisibility from "../hooks/usePasswordVisibility";

export default function LoginForm() {
  const { register, errors, onSubmit, isSubmitting, serverError } =
    useLoginForm();
  const passwordVisibility = usePasswordVisibility();

  return (
    <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="flex items-baseline justify-between">
          <span className="text-b2 font-medium text-neutral-600">อีเมล</span>
          <span className="text-b2 text-neutral-500">Email</span>
        </label>
        <div className={inputBox(errors.email)}>
          <MailIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@nexus.co.th"
            aria-invalid={!!errors.email}
            className="grow outline-none placeholder:text-neutral-400"
            {...register("email")}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="flex items-baseline justify-between"
        >
          <span className="text-b2 font-medium text-neutral-600">รหัสผ่าน</span>
          <span className="text-b2 text-neutral-500">Password</span>
        </label>
        <div className={inputBox(errors.password)}>
          <LockIcon className="pointer-events-none h-6 w-6 text-neutral-500" />
          <input
            id="password"
            type={passwordVisibility.inputType}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className="grow outline-none placeholder:text-neutral-400"
            {...register("password")}
          />
          <button
            type="button"
            onClick={passwordVisibility.toggleVisibility}
            aria-label={
              passwordVisibility.isVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"
            }
            className="cursor-pointer h-6 w-6 text-neutral-500 hover:text-neutral-700"
          >
            <EyeIcon off={passwordVisibility.isVisible} className="h-6 w-6" />
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <a href="#" className="text-b2 text-blue-500 hover:text-blue-600">
          ลืมรหัสผ่าน?
        </a>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger-light px-4 py-3 text-b2 text-danger-dark"
        >
          {serverError}
        </div>
      )}

      <Button
        variant="primary"
        size="large"
        type="submit"
        block
        loading={isSubmitting}
      >
        เข้าสู่ระบบ / Sign In
      </Button>

      <p className="text-center text-body-3 tracking-[0.02em] text-neutral-500">
        Need access? Contact your team lead or{" "}
        <a href="#" className="text-blue-500 hover:text-blue-600">
          IT support →
        </a>
      </p>
    </form>
  );
}
