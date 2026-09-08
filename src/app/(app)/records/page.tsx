import TopBar from "@/components/layout/TopBar";
import { VIEW_META } from "@/components/layout/viewMeta";
import DataEntryView from "@/features/data-entry/components/DataEntryView";
import { getCurrentFactory } from "@/features/factory/currentFactory";

export default async function RecordsPage() {
  const factory = await getCurrentFactory();

  return (
    <>
      <TopBar titleTh={VIEW_META.records.titleTh} />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {factory ? (
          <DataEntryView factory={factory} />
        ) : (
          <p className="text-body-2 text-neutral-600">
            บัญชีนี้ยังไม่ได้สังกัดโรงงาน กรุณาติดต่อผู้ดูแลระบบ
          </p>
        )}
      </div>
    </>
  );
}
