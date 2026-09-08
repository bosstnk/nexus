import SideBar from "@/components/layout/SideBar";
import { requireUser } from "@/features/auth/currentUser";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fullName } = await requireUser();

  return (
    <main className="flex h-screen overflow-hidden">
      <SideBar name={fullName} />

      <section className="flex min-w-0 flex-1 flex-col bg-neutral-50">
        {children}
      </section>
    </main>
  );
}
