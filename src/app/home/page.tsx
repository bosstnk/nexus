import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import SideBar from "../components/SideBar";

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

  // undefined เมื่อยังไม่มี profile เพื่อให้ default ของ SideBar ทำงาน
  // แทนที่จะได้ชื่อว่างกับ avatar เปล่า
  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    undefined;

  return (
    <main className="flex flex-row">
      <SideBar name={fullName} active="home" />
    </main>
  );
}
