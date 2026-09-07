"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChartIcon,
  BellIcon,
  NewspaperIcon,
  ShieldAlertIcon,
} from "@/components/ui/icons";

const NOTIFICATIONS = [
  {
    icon: NewspaperIcon,
    tile: "bg-green-50 text-green-500",
    text: "ข่าวใหม่: วันหยุดพิเศษเดือนพฤษภาคม",
    time: "9:41 น.",
  },
  {
    icon: ShieldAlertIcon,
    tile: "bg-danger-light text-danger",
    text: "แจ้งเตือน: ซ้อมอพยพ 5 พ.ค. 10:00 น.",
    time: "9:15 น.",
  },
  {
    icon: BarChartIcon,
    tile: "bg-blue-50 text-blue-500",
    text: "รายงาน Q1/2568 พร้อมรับชมแล้ว",
    time: "8:30 น.",
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="การแจ้งเตือน"
        className="relative grid size-9 cursor-pointer place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-600 transition-colors hover:bg-neutral-50"
      >
        <BellIcon size={15} />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full border-[1.5px] border-white bg-danger-dark" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="การแจ้งเตือน"
          className="absolute top-10 right-0 z-50 w-90 animate-[nexus-fade-slide_0.15s_ease] overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.10)]"
        >
          <div className="border-b border-neutral-100 px-4 py-3 text-body-1 font-medium text-neutral-900">
            🔔 การแจ้งเตือน
          </div>

          {NOTIFICATIONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.text}
                type="button"
                role="menuitem"
                className="flex w-full cursor-pointer items-start gap-2 border-b border-neutral-50 px-4 py-2 text-left transition-colors hover:bg-neutral-50"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg ${item.tile}`}
                >
                  <Icon size={16} />
                </span>
                <span className="flex-1">
                  <span className="block text-body-2 leading-tight text-neutral-900">
                    {item.text}
                  </span>
                  <span className="block text-body-3 text-neutral-600">
                    {item.time}
                  </span>
                </span>
              </button>
            );
          })}

          <div className="px-4 py-3 text-center">
            <span className="cursor-pointer text-body-2 text-green-600">
              ดูทั้งหมด / View all
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
