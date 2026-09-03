import Image from "next/image";
import clsx from "clsx";
import { formatThaiShortDate } from "@/lib/datetime";
import { UserIcon } from "@/components/ui/icons";
import {
  catMeta,
  PRIORITY_BADGE,
  PRIORITY_CONFIG,
  type NewsItem,
} from "../data";

const CARD =
  "group cursor-pointer rounded-xl border border-neutral-300 bg-white shadow-xs transition hover:shadow-md";

function CategoryChip({ category }: { category: string }) {
  const meta = catMeta(category);
  const Icon = meta.icon;

  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-body-3 font-medium whitespace-nowrap",
        meta.chip,
      )}
    >
      <Icon size={12} />
      {category}
    </span>
  );
}

export default function NewsCard({
  item,
  featured = false,
}: {
  item: NewsItem;
  featured?: boolean;
}) {
  const priority = PRIORITY_CONFIG[item.priority];
  const meta = catMeta(item.category);
  const CategoryIcon = meta.icon;

  if (featured) {
    return (
      <article
        className={clsx(CARD, "flex flex-col overflow-hidden hover:-translate-y-0.5")}
      >
        <div className="relative h-40 shrink-0 overflow-hidden">
          {item.img ? (
            <Image
              src={item.img}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 300px"
              className="object-cover transition-transform duration-400 group-hover:scale-105"
            />
          ) : (
            <div className={clsx("grid h-full place-items-center", meta.panel)}>
              <CategoryIcon size={50} className="opacity-55" />
            </div>
          )}
          <span
            className={clsx(
              "absolute top-2 left-2",
              PRIORITY_BADGE,
              priority.badge,
            )}
          >
            {priority.label}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-3.5">
          <div className="flex items-center justify-between gap-2">
            <CategoryChip category={item.category} />
            <span className="shrink-0 text-body-3 whitespace-nowrap text-neutral-500">
              {formatThaiShortDate(item.date)}
            </span>
          </div>

          <h3 className="text-body-2 leading-snug font-semibold text-neutral-900">
            {item.title}
          </h3>
          <p className="line-clamp-3 flex-1 text-body-3 text-neutral-600">
            {item.summary}
          </p>

          <div className="flex items-center gap-1 border-t border-neutral-100 pt-2 text-body-3 text-neutral-500">
            <UserIcon size={12} className="shrink-0" />
            <span className="truncate">{item.author}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={clsx(CARD, "flex items-stretch gap-3 p-3 hover:-translate-y-px")}
    >
      {item.img ? (
        <div className="relative w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={item.img}
            alt=""
            fill
            sizes="76px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={clsx(
            "grid w-20 shrink-0 place-items-center rounded-[9px]",
            meta.chip,
          )}
        >
          <CategoryIcon size={24} className="opacity-75" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-body-1 leading-snug font-semibold text-neutral-900">
            {item.title}
          </h3>
          <span
            className={clsx(
              "shrink-0 whitespace-nowrap",
              PRIORITY_BADGE,
              priority.badge,
            )}
          >
            {priority.label}
          </span>
        </div>

        <p className="line-clamp-1 text-body-3 leading-normal text-neutral-600">
          {item.summary}
        </p>

        <div className="flex items-center gap-2 text-body-3 text-neutral-500">
          <CategoryChip category={item.category} />
          <span className="truncate">{item.author}</span>
          <span className="text-neutral-300">·</span>
          <span className="shrink-0">{formatThaiShortDate(item.date)}</span>
        </div>
      </div>
    </article>
  );
}
