import TopBar from "@/components/layout/TopBar";
import { VIEW_META } from "@/components/layout/viewMeta";
import PartnersView from "@/features/partners/components/PartnersView";

export default function PartnersPage() {
  return (
    <>
      <TopBar titleTh={VIEW_META.partners.titleTh} />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <PartnersView />
      </div>
    </>
  );
}
