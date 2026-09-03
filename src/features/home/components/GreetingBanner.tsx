import { formatThaiDate, greetingFor, hourInBangkok } from "@/lib/datetime";

const STATS = [
  {
    value: "5",
    label: "ข่าวใหม่",
    tile: "bg-green-50",
    number: "text-green-700",
    caption: "text-green-600",
  },
  {
    value: "2",
    label: "งานรอดำเนินการ",
    tile: "bg-blue-50",
    number: "text-blue-800",
    caption: "text-blue-600",
  },
];

export default function GreetingBanner({ name = "User" }: { name?: string }) {
  const now = new Date();
  const greeting = greetingFor(hourInBangkok(now));

  return (
    <div className="flex shrink-0 flex-row items-center justify-between gap-4 rounded-xl border-[0.5px] border-neutral-300 bg-white px-5 py-4">
      <div className="min-w-0">
        <p className="text-headline-5 leading-tight font-semibold text-neutral-900">
          {greeting.th}, {name} 👋
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-body-3 text-neutral-600">
          <span>
            {greeting.en} · {formatThaiDate(now)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-row gap-2">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-[10px] px-4 py-2 text-center ${stat.tile}`}
          >
            <div
              className={`font-eng text-[18px] leading-none font-semibold tabular-nums ${stat.number}`}
            >
              {stat.value}
            </div>
            <div className={`mt-1.5 text-[10px] leading-none ${stat.caption}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
