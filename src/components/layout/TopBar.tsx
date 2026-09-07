import { formatThaiDate } from "@/lib/datetime";
import FactorySwitcher from "@/features/factory/components/FactorySwitcher";
import NotificationBell from "@/features/notifications/components/NotificationBell";

type TopBarProps = {
  titleTh: string;
};

export default function TopBar({ titleTh }: TopBarProps) {
  const dateStr = formatThaiDate(new Date());

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

      <NotificationBell />
      <div className="h-8 w-px shrink-0 bg-neutral-200" />
      <FactorySwitcher />
    </header>
  );
}
