import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SideBar from "@/components/layout/SideBar";
import TopBar from "@/components/layout/TopBar";
import { FactoryProvider } from "@/features/factory/components/FactoryProvider";
import GreetingBanner from "@/features/home/components/GreetingBanner";
import Carousel from "@/features/news/components/Carousel";
import NewsSection from "@/features/news/components/NewsSection";

export default async function HomePage() {
  const supabase = await createClient();

  // getUser(), not getSession(): getSession only decodes the cookie without
  // verifying the signature, and cookies are client-controlled.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    undefined;

  return (
    // เหมือนต้นแบบ: เปลือกสูงเท่าจอ ให้เฉพาะเนื้อหาเลื่อน ส่วน TopBar อยู่กับที่
    <main className="flex h-screen overflow-hidden">
      <SideBar name={fullName} active="home" />

      {/* โรงงานที่เลือกใช้ร่วมกันระหว่าง TopBar กับ GreetingBanner */}
      <FactoryProvider>
        <section className="flex min-w-0 flex-1 flex-col bg-neutral-50">
          <TopBar titleTh="หน้าหลัก" />

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
            <GreetingBanner name={fullName} />
            <Carousel />
            <NewsSection />

            {/* page content */}
          </div>
        </section>
      </FactoryProvider>
    </main>
  );
}
