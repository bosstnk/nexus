import TopBar from "@/components/layout/TopBar";
import { VIEW_META } from "@/components/layout/viewMeta";
import { getCurrentFactory } from "@/features/factory/currentFactory";
import PartnersView from "@/features/partners/components/PartnersView";
import { getPartners } from "@/features/partners/queries";

export default async function PartnersPage() {
  const factory = await getCurrentFactory();
  const partners = factory ? await getPartners(factory.id) : [];

  return (
    <>
      <TopBar titleTh={VIEW_META.partners.titleTh} />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {factory ? (
          <PartnersView partners={partners} />
        ) : (
          <p className="text-body-2 text-neutral-600">
            บัญชีนี้ยังไม่ได้สังกัดโรงงาน กรุณาติดต่อผู้ดูแลระบบ
          </p>
        )}
      </div>
    </>
  );
}
