"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CheckIcon, ChevronsUpDownIcon, MapPinIcon } from "@/components/ui/icons";
import { useFactory } from "./FactoryProvider";

/** ตัวสลับโรงงาน — ยัง mockup อยู่ เลือกแล้วเก็บใน state ฝั่ง client เท่านั้น */
export default function FactorySwitcher() {
  const { factory, factories, selectFactory } = useFactory();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // ปิดเมนูเมื่อคลิกนอกกล่องหรือกด Esc
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
        className={clsx(
          "flex min-w-50 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors",
          open
            ? `${factory.soft} ${factory.softBorder}`
            : "border-neutral-300 bg-white hover:bg-neutral-50",
        )}
      >
        <span
          className={clsx(
            "grid size-8 shrink-0 place-items-center rounded-lg text-body-2 font-bold text-white",
            factory.solid,
          )}
        >
          {factory.code}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[10px] leading-tight font-semibold tracking-[0.06em] text-neutral-500">
            โรงงานปัจจุบัน
          </span>
          <span className="block truncate text-body-3 leading-[1.2] font-semibold text-neutral-900">
            {factory.nameTh}
          </span>
        </span>
        <ChevronsUpDownIcon size={16} className="text-neutral-500" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="เลือกโรงงาน"
          className="absolute top-13 right-0 z-50 w-75 animate-[nexus-fade-slide_0.15s_ease] overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
        >
          <div className="border-b border-neutral-100 px-4 py-3">
            <div className="text-body-2 font-semibold text-neutral-900">
              เลือกโรงงาน
            </div>
            <div className="text-body-3 text-neutral-600">
              เปลี่ยนบริบทการทำงานทั้งระบบ
            </div>
          </div>

          {factories.map((item) => {
            const isActive = item.id === factory.id;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  selectFactory(item.id);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full cursor-pointer items-center gap-3 border-l-[3px] px-4 py-3 text-left transition-colors",
                  isActive
                    ? `${item.soft} ${item.rail}`
                    : "border-l-transparent bg-white hover:bg-neutral-50",
                )}
              >
                <span
                  className={clsx(
                    "grid size-8 shrink-0 place-items-center rounded-lg text-body-2 font-bold text-white",
                    item.solid,
                  )}
                >
                  {item.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body-3 leading-tight font-semibold text-neutral-900">
                    {item.nameTh}
                  </span>
                  <span className="flex items-center gap-1 truncate text-[10px] text-neutral-500">
                    <MapPinIcon size={9} className="shrink-0" />
                    {item.location}
                  </span>
                </span>
                {isActive && (
                  <CheckIcon
                    size={16}
                    strokeWidth={3}
                    className={clsx("shrink-0", item.accent)}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
