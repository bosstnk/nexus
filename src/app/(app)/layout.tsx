import SideBar from "@/components/layout/SideBar";
import { requireUser } from "@/features/auth/currentUser";
import { getCurrentFactory } from "@/features/factory/currentFactory";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // getCurrentFactory() ถูก cache() ไว้ TopBar เรียกซ้ำในหน้าเดียวกันก็ไม่ query เพิ่ม
  const [{ fullName }, factory] = await Promise.all([
    requireUser(),
    getCurrentFactory(),
  ]);

  return (
    <main className="flex h-screen overflow-hidden">
      <SideBar name={fullName} canManageAccess={factory?.role === "admin"} />

      <section className="flex min-w-0 flex-1 flex-col bg-neutral-50">
        {children}
      </section>
    </main>
  );
}
