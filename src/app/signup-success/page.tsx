import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import { createClient } from "../lib/supabase/server";

const ctaClass =
  "mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-green-400 text-base font-medium text-white transition-colors hover:bg-green-500 active:bg-green-600";

const cardClass =
  "w-full max-w-[440px] rounded-2xl bg-white px-8 py-10 text-center shadow-[0_24px_60px_rgba(15,42,26,0.18)]";

export default async function SignupSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // /auth/callback exchanges the code and sets the cookie before redirecting
  // here, so the session is already readable server-side. On a dead link it
  // forwards ?error= instead.
  const { error: linkError } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email;

  return (
    <AuthLayout
      badge={<span>เปิดรับสมาชิกใหม่</span>}
      eyebrow=""
      headline=""
      description=""
    >
      <div className="flex h-full w-full items-center justify-center bg-neutral-100 px-8 py-12">
        {!email ? (
          <div className={cardClass}>
            <h2 className="text-h2 leading-tight text-neutral-900">
              {linkError ? "ลิงก์หมดอายุแล้ว" : "ยังไม่ได้ยืนยันอีเมล"}
            </h2>
            <p className="mt-2 text-b2 leading-relaxed text-neutral-600">
              {linkError
                ? "ลิงก์ยืนยันนี้ใช้ไม่ได้หรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง"
                : "กรุณาเปิดลิงก์ยืนยันจากอีเมลของคุณอีกครั้ง"}
            </p>
            <Link href="/signup" className={ctaClass}>
              กลับไปสมัครสมาชิก
            </Link>
          </div>
        ) : (
          <div className={cardClass}>
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full bg-green-100"
                style={{ animation: "nexus-pulse 2.4s ease-in-out infinite" }}
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
                {email}
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
