"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Button from "../components/Button";
import { supabase } from "../supabase.client";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Supabase signOut failed:", error.toJSON());
    router.replace("/login");
  };

  const firstName = user?.user_metadata?.first_name as string | undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-8 py-12">
      <div className="w-full max-w-[520px] rounded-2xl bg-white px-8 py-10 text-center shadow-[0_24px_60px_rgba(15,42,26,0.18)]">
        {loading ? (
          <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
        ) : (
          <>
            <h1 className="text-h2 leading-tight text-neutral-900">
              {firstName
                ? `สวัสดีคุณ ${firstName} 👋`
                : "ยินดีต้อนรับสู่ Nexus 👋"}
            </h1>

            <p className="mt-2 text-b2 leading-relaxed text-neutral-600">
              {user?.email ? (
                <>
                  คุณเข้าสู่ระบบด้วย{" "}
                  <span className="font-medium break-all text-neutral-900">
                    {user.email}
                  </span>
                </>
              ) : (
                "ยังไม่ได้เข้าสู่ระบบ"
              )}
            </p>

            <Button
              variant="outline"
              size="large"
              block
              className="mt-8"
              loading={signingOut}
              onClick={handleSignOut}
            >
              ออกจากระบบ
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
