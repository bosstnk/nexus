"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { formatThaiShortDate } from "@/lib/datetime";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { catMeta, PRIORITY_BADGE, PRIORITY_CONFIG } from "../data";
import type { NewsItem } from "../types";

export default function Carousel({ news }: { news: NewsItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // ข่าวเรียงใหม่ -> เก่ามาจาก DB แล้ว filter รักษาลำดับเดิมไว้
  const slides = news.filter((item) => item.pinned && item.img);
  const total = slides.length;

  useEffect(() => {
    if (paused || total < 2) return;

    const timer = setTimeout(() => setIndex((i) => (i + 1) % total), 5000);
    return () => clearTimeout(timer);
  }, [index, paused, total]);

  // hooks ต้องรันครบทุกรอบ จึงเช็คว่างทีหลัง
  if (!total) return null;

  // ถ้าจำนวนสไลด์ลดลงหลัง revalidate index เดิมอาจเกินขอบ
  const slide = slides[index % total];
  const meta = catMeta(slide.category);
  const CategoryIcon = meta.icon;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-75 shrink-0 overflow-hidden rounded-xl border border-neutral-300"
    >
      {slides.map((item, i) => (
        <div
          key={item.id}
          aria-hidden={i !== index}
          className={clsx(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Image
            src={item.img!}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            priority={i === 0}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/78 via-black/20 via-55% to-transparent" />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 px-6 pt-5 pb-6">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-body-3 font-semibold tracking-[0.03em] text-white",
              meta.solid,
            )}
          >
            <CategoryIcon size={12} />
            {slide.category}
          </span>
          {slide.priority === "high" && (
            <span className={clsx(PRIORITY_BADGE, PRIORITY_CONFIG.high.badge)}>
              {PRIORITY_CONFIG.high.label}
            </span>
          )}
        </div>

        <div className="max-w-[75%] text-h5 leading-tight text-white">
          {slide.title}
        </div>
        <div className="mt-1 line-clamp-2 max-w-[70%] text-body-2 leading-normal text-white/78">
          {slide.summary}
        </div>
        <div className="mt-2 text-body-3 text-white/55">
          {slide.author} · {formatThaiShortDate(slide.date)}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIndex((i) => (i - 1 + total) % total)}
        aria-label="สไลด์ก่อนหน้า"
        className="absolute top-1/2 left-3 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-colors hover:bg-white/35"
      >
        <ChevronLeftIcon size={16} />
      </button>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % total)}
        aria-label="สไลด์ถัดไป"
        className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-colors hover:bg-white/35"
      >
        <ChevronRightIcon size={16} />
      </button>

      <div className="absolute right-6 bottom-5 flex items-center gap-1">
        {slides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`ไปสไลด์ที่ ${i + 1}`}
            aria-current={i === index}
            className={clsx(
              "h-2 cursor-pointer rounded-full transition-all duration-250",
              i === index ? "w-5 bg-green-400" : "w-2 bg-white/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
