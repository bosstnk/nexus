import { formatThaiDate, greetingFor, hourInBangkok } from "@/lib/datetime";

export default function GreetingBanner({ name = "User" }: { name?: string }) {
  const now = new Date();
  const greeting = greetingFor(hourInBangkok(now));

  return (
    <div className="shrink-0 rounded-xl border-[0.5px] border-neutral-300 bg-white px-5 py-4">
      <p className="text-headline-5 leading-tight font-semibold text-neutral-900">
        {greeting.th}, {name} 👋
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-body-3 text-neutral-600">
        <span>
          {greeting.en} · {formatThaiDate(now)}
        </span>
      </div>
    </div>
  );
}
