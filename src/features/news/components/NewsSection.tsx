"use client";

import { useState } from "react";
import clsx from "clsx";
import { InboxIcon } from "@/components/ui/icons";
import NewsCard from "./NewsCard";
import type { NewsItem, Priority } from "../types";

const FILTERS: { id: "all" | Priority; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "urgent", label: "เร่งด่วน" },
  { id: "high", label: "สำคัญ" },
  { id: "normal", label: "ปกติ" },
  { id: "info", label: "ข้อมูล" },
];

export default function NewsSection({ news }: { news: NewsItem[] }) {
  const [filter, setFilter] = useState<"all" | Priority>("all");

  const countOf = (id: "all" | Priority) =>
    id === "all"
      ? news.length
      : news.filter((item) => item.priority === id).length;

  // DB เรียง published_at ใหม่ -> เก่ามาแล้ว และ filter ไม่เปลี่ยนลำดับ
  const sorted =
    filter === "all" ? news : news.filter((item) => item.priority === filter);

  const featured = sorted.slice(0, 3);
  const list = sorted.slice(3);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h5 font-medium text-neutral-900">
            ข่าวสารและประกาศ
          </h2>
        </div>

        <div className="flex shrink-0 gap-1">
          {FILTERS.map((option) => {
            const isActive = option.id === filter;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={isActive}
                className={clsx(
                  "inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-body-3 transition-colors",
                  isActive
                    ? "border-green-400 bg-green-50 font-semibold text-green-700"
                    : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
                )}
              >
                {option.label}
                <span
                  className={clsx(
                    "text-body-3",
                    isActive ? "text-green-600" : "text-neutral-500",
                  )}
                >
                  {countOf(option.id)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {featured.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3">
          {featured.map((item) => (
            <NewsCard key={item.id} item={item} featured />
          ))}
        </div>
      )}

      {list.length > 0 && (
        <div className="flex flex-col gap-2">
          {list.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <div className="grid place-items-center gap-2.5 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-9 text-center">
          <InboxIcon size={26} className="text-neutral-400" />
          <p className="text-[13px] text-neutral-600">ไม่มีข่าวในหมวดนี้</p>
        </div>
      )}
    </section>
  );
}
