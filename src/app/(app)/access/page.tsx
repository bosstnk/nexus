import TopBar from "@/components/layout/TopBar";
import { VIEW_META } from "@/components/layout/viewMeta";
import MyAccessView from "@/features/access/components/MyAccessView";
import { getAllFactories, getMyJoinRequests } from "@/features/access/queries";
import type { AccessRole } from "@/features/access/types";
import { getMyFactories } from "@/features/factory/queries";

export default async function AccessPage() {
  const [factories, myFactories, requests] = await Promise.all([
    getAllFactories(),
    getMyFactories(),
    getMyJoinRequests(),
  ]);

  // สิทธิ์ที่มีอยู่แล้ว — key คือ factory id
  // Factory.role ยังพิมพ์เป็น string แต่ค่าจริงมาจาก enum factory_role
  const memberships = Object.fromEntries(
    myFactories.map((factory) => [factory.id, factory.role as AccessRole]),
  );

  return (
    <>
      <TopBar titleTh={VIEW_META.access.titleTh} />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <MyAccessView
          factories={factories}
          memberships={memberships}
          requests={requests}
        />
      </div>
    </>
  );
}
