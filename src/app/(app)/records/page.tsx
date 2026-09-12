import TopBar from "@/components/layout/TopBar";
import { VIEW_META } from "@/components/layout/viewMeta";
import DataEntryView from "@/features/data-entry/components/DataEntryView";
import {
  getMaterials,
  getTransactions,
  getUtilityReports,
} from "@/features/data-entry/queries";
import { getCurrentFactory } from "@/features/factory/currentFactory";
import { getPartners } from "@/features/partners/queries";

export default async function RecordsPage() {
  const factory = await getCurrentFactory();

  const [records, transactions, partners, materials] = factory
    ? await Promise.all([
        getUtilityReports(factory.id),
        getTransactions(factory.id),
        getPartners(factory.id),
        getMaterials(),
      ])
    : [[], [], [], []];

  return (
    <>
      <TopBar titleTh={VIEW_META.records.titleTh} />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {factory ? (
          <DataEntryView
            factory={factory}
            records={records}
            transactions={transactions}
            partners={partners}
            materials={materials}
          />
        ) : (
          <p className="text-body-2 text-neutral-600">
            บัญชีนี้ยังไม่ได้สังกัดโรงงาน กรุณาติดต่อผู้ดูแลระบบ
          </p>
        )}
      </div>
    </>
  );
}
