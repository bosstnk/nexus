import Link from "next/link";
import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";
import { greetingFor, hourInBangkok, TZ } from "@/lib/datetime";

// The greeting depends on "now" — without this Next freezes it at build time.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const now = new Date();
  const formatDateTime = (options: Intl.DateTimeFormatOptions) =>
    now.toLocaleDateString("en-US", {
      ...options,
      timeZone: TZ,
    });

  const formattedDate = `${formatDateTime({ weekday: "short" })} · ${formatDateTime({ day: "numeric", month: "short" })}`;

  // Pinning the timezone is what removes the hydration mismatch the old
  // client-side effect was working around.
  const greeting = greetingFor(hourInBangkok(now));

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

          <LoginForm />
        </div>

        <p className="text-start text-b3 tracking-wider text-neutral-500">
          © 2026 Nexus · v1.0
        </p>
      </div>
    </AuthLayout>
  );
}
