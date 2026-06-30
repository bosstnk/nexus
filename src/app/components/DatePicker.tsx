"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "./icons";

type DatePickerProps = {
  value: Date | null;
  onChange: (d: Date) => void;
  maxDate?: Date;
  minDate?: Date;
  id?: string;
  className?: string; // applied to the trigger (page passes `baseInput`)
  placeholder?: string;
};

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const THAI_DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const formatThai = (d: Date) =>
  `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543}`;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default function DatePicker({
  value,
  onChange,
  maxDate,
  minDate,
  id,
  className,
  placeholder = "วว/ดด/ปปปป",
}: DatePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"days" | "months" | "years">("days");
  const [viewYear, setViewYear] = useState(
    (value ?? maxDate ?? today).getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    (value ?? maxDate ?? today).getMonth()
  );
  // first year shown in the year-grid page
  const [yearPageStart, setYearPageStart] = useState(viewYear - (viewYear % 12));

  const rootRef = useRef<HTMLDivElement>(null);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openPicker = () => {
    const base = value ?? maxDate ?? today;
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setYearPageStart(base.getFullYear() - (base.getFullYear() % 12));
    setPanel("days");
    setOpen(true);
  };

  const isDisabled = (d: Date) => {
    if (maxDate && startOfDay(d) > startOfDay(maxDate)) return true;
    if (minDate && startOfDay(d) < startOfDay(minDate)) return true;
    return false;
  };

  const selectDay = (day: number) => {
    const picked = new Date(viewYear, viewMonth, day);
    if (isDisabled(picked)) return;
    onChange(picked);
    setOpen(false);
  };

  const gotoMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  // build day grid (leading blanks + days)
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        id={id}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={clsx(className, "cursor-pointer text-left")}
      >
        <CalendarIcon className="pointer-events-none h-[18px] w-[18px] shrink-0 text-neutral-500" />
        <span
          className={clsx("grow", value ? "text-neutral-900" : "text-neutral-400")}
        >
          {value ? formatThai(value) : placeholder}
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute left-0 z-20 mt-1 w-[300px] rounded-lg border border-neutral-200 bg-white p-3 shadow-lg">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="เดือนก่อนหน้า"
              onClick={() => gotoMonth(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setPanel(panel === "days" ? "years" : "days")}
              className="rounded-md px-2 py-1 text-b2 font-medium text-neutral-900 hover:bg-neutral-100"
            >
              {THAI_MONTHS[viewMonth]} {viewYear + 543}
            </button>
            <button
              type="button"
              aria-label="เดือนถัดไป"
              onClick={() => gotoMonth(1)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
            >
              ›
            </button>
          </div>

          {/* Day view */}
          {panel === "days" && (
            <>
              <div className="grid grid-cols-7 text-center">
                {THAI_DOW.map((d, i) => (
                  <span
                    key={d}
                    className={clsx(
                      "py-1 text-b3 font-medium",
                      i === 0 ? "text-danger" : "text-neutral-500"
                    )}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                  if (day === null)
                    return <span key={`b${i}`} className="h-9" />;
                  const date = new Date(viewYear, viewMonth, day);
                  const disabled = isDisabled(date);
                  const selected = value ? isSameDay(date, value) : false;
                  const isToday = isSameDay(date, today);
                  const sunday = date.getDay() === 0;
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={disabled}
                      onClick={() => selectDay(day)}
                      className={clsx(
                        "relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-b2 transition-colors",
                        selected && "bg-green-400 font-medium text-white",
                        !selected && disabled && "text-neutral-300",
                        !selected &&
                          !disabled &&
                          (sunday ? "text-danger" : "text-neutral-800"),
                        !selected && !disabled && "hover:bg-green-50",
                        disabled && "cursor-not-allowed"
                      )}
                    >
                      {day}
                      {isToday && !selected && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Month quick-jump */}
          {panel === "months" && (
            <div className="grid grid-cols-3 gap-2">
              {THAI_MONTHS_SHORT.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setViewMonth(i);
                    setPanel("days");
                  }}
                  className={clsx(
                    "rounded-md py-2 text-b2 transition-colors hover:bg-green-50",
                    i === viewMonth
                      ? "bg-green-400 font-medium text-white hover:bg-green-400"
                      : "text-neutral-800"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Year quick-jump */}
          {panel === "years" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="ปีก่อนหน้า"
                  onClick={() => setYearPageStart((y) => y - 12)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
                >
                  ‹
                </button>
                <span className="text-b2 font-medium text-neutral-900">
                  {yearPageStart + 543} – {yearPageStart + 11 + 543}
                </span>
                <button
                  type="button"
                  aria-label="ปีถัดไป"
                  onClick={() => setYearPageStart((y) => y + 12)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }, (_, i) => yearPageStart + i).map(
                  (y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setViewYear(y);
                        setPanel("months");
                      }}
                      className={clsx(
                        "rounded-md py-2 text-b2 transition-colors hover:bg-green-50",
                        y === viewYear
                          ? "bg-green-400 font-medium text-white hover:bg-green-400"
                          : "text-neutral-800"
                      )}
                    >
                      {y + 543}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
