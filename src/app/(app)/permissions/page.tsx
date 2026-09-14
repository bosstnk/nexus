import TopBar from "@/components/layout/TopBar";
import { VIEW_META } from "@/components/layout/viewMeta";
import { ShieldCheckIcon } from "@/components/ui/icons";
import AccessManageView from "@/features/access/components/AccessManageView";
import {
  getFactoryJoinRequests,
  getFactoryMembers,
} from "@/features/access/queries";
import { requireUser } from "@/features/auth/currentUser";
import { getCurrentFactory } from "@/features/factory/currentFactory";

// ดึงข้อมูลเฉพาะตอนเป็นแอดมินจริง — คนอื่นไม่ต้องยิง query ที่ RLS จะปฏิเสธอยู่ดี
async function AdminContent({
  factoryId,
  factoryName,
}: {
  factoryId: string;
  factoryName: string;
}) {
  const [requests, members, { user }] = await Promise.all([
    getFactoryJoinRequests(factoryId),
    getFactoryMembers(factoryId),
    requireUser(),
  ]);

  return (
    <AccessManageView
      factory={{ id: factoryId, name: factoryName }}
      requests={requests}
      members={members}
      currentUserId={user.id}
    />
  );
}

export default async function PermissionsPage() {
  // ขอบเขตทั้งหน้าผูกกับโรงงานที่เลือกจาก factory switcher บน TopBar
  const factory = await getCurrentFactory();

  return (
    <>
      <TopBar titleTh={VIEW_META.permissions.titleTh} />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {!factory ? (
          <p className="text-body-2 text-neutral-600">
            บัญชีนี้ยังไม่ได้สังกัดโรงงาน กรุณาติดต่อผู้ดูแลระบบ
          </p>
        ) : factory.role !== "admin" ? (
          // ไม่ใช่ 404 — ผู้ใช้อาจเป็นแอดมินของโรงงานอื่น แค่ยังไม่ได้สลับไป
          <div className="grid place-items-center gap-2.5 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
            <ShieldCheckIcon size={30} className="text-neutral-400" />
            <div>
              <p className="text-body-2 text-neutral-600">
                คุณไม่ได้เป็นผู้ดูแลของ{factory.name}
              </p>
              <p className="text-body-3 text-neutral-500">
                ถ้าคุณดูแลโรงงานอื่น สลับได้จากแถบด้านบน
              </p>
            </div>
          </div>
        ) : (
          <AdminContent factoryId={factory.id} factoryName={factory.name} />
        )}
      </div>
    </>
  );
}
