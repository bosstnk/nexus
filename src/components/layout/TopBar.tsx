import { formatThaiDate } from "@/lib/datetime";
import FactorySwitcher from "@/features/factory/components/FactorySwitcher";
import { getCurrentFactory } from "@/features/factory/currentFactory";
import { getMyFactories } from "@/features/factory/queries";
// ปิด feature แจ้งเตือนไว้ก่อน — ไฟล์ component ยังอยู่ที่
// src/features/notifications/components/NotificationBell.tsx เปิดกลับได้ทันที

type TopBarProps = {
  titleTh: string;
};

export default async function TopBar({ titleTh }: TopBarProps) {
  const dateStr = formatThaiDate(new Date());

  // ทั้งสองตัวถูก cache() ไว้ ถึง layout จะเรียกไปแล้วก็ไม่ query ซ้ำใน request นี้
  const [factories, factory] = await Promise.all([
    getMyFactories(),
    getCurrentFactory(),
  ]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b-[0.5px] border-neutral-300 bg-white px-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-h4 text-neutral-900">
          {titleTh}
        </h1>
      </div>

      <span className="shrink-0 text-body-3 text-neutral-700">
        {dateStr}
      </span>

      <div className="h-8 w-px shrink-0 bg-neutral-200" />

      {factory ? (
        <FactorySwitcher factory={factory} factories={factories} />
      ) : (
        <span className="shrink-0 rounded-lg border border-neutral-300 px-3 py-2 text-body-3 text-neutral-500">
          ยังไม่ได้สังกัดโรงงาน
        </span>
      )}
    </header>
  );
}
