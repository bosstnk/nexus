"use client";

import { useState } from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import { HandshakeIcon, PlusIcon, SearchIcon } from "@/components/ui/icons";
import PartnerFormModal from "./PartnerFormModal";
import PartnersTable from "./PartnersTable";
import { PARTNERS, type Partner, type PartnerType } from "../data";
import type { PartnerForm } from "../schema";

const TABS: { id: "all" | PartnerType; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "sell", label: "ผู้รับซื้อ" },
  { id: "buy", label: "ผู้ขายให้เรา" },
  { id: "both", label: "ทั้งสอง" },
];

export default function PartnersView() {
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [typeFilter, setTypeFilter] = useState<"all" | PartnerType>("all");
  const [search, setSearch] = useState("");
  const [isFormOpen, setFormOpen] = useState(false);

  const countOf = (id: "all" | PartnerType) =>
    id === "all"
      ? partners.length
      : partners.filter((partner) => partner.type === id).length;

  const keyword = search.trim().toLowerCase();
  const visiblePartners = partners.filter((partner) => {
    if (typeFilter !== "all" && partner.type !== typeFilter) return false;
    if (keyword && !partner.name.toLowerCase().includes(keyword)) return false;
    return true;
  });

  const handleSave = (values: PartnerForm) => {
    setPartners((current) => [{ id: Date.now(), ...values }, ...current]);
    setFormOpen(false);
  };

  return (
    <>
      <div className="flex shrink-0 items-center gap-3 rounded-xl border border-neutral-300 bg-white px-5 py-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-green-50 text-green-700">
          <HandshakeIcon size={24} />
        </span>
        <div className="min-w-0">
          <h2 className="text-body-1 font-medium text-neutral-900">
            ทะเบียนคู่ค้า
          </h2>
          <p className="text-body-3 text-neutral-600">
            ฟอร์มซื้อขายดึงรายชื่อจากที่นี่
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
          {TABS.map((tab) => {
            const isActive = tab.id === typeFilter;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                aria-pressed={isActive}
                className={clsx(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-1.5 text-body-3 transition-colors",
                  isActive
                    ? "bg-white font-semibold text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900",
                )}
              >
                {tab.label}
                <span
                  className={clsx(
                    "rounded-full px-1.5 font-eng text-[10px] font-semibold",
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-neutral-200 text-neutral-600",
                  )}
                >
                  {countOf(tab.id)}
                </span>
              </button>
            );
          })}
        </div>

        <label className="flex w-55 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 transition-colors focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20">
          <SearchIcon size={14} className="shrink-0 text-neutral-500" />
          <span className="sr-only">ค้นหาคู่ค้า</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ค้นหาชื่อบริษัท"
            className="w-full text-body-3 text-neutral-900 outline-none placeholder:text-neutral-500"
          />
        </label>

        <Button size="small" className="ml-auto" onClick={() => setFormOpen(true)}>
          <PlusIcon size={14} />
          เพิ่มคู่ค้า
        </Button>
      </div>

      <PartnersTable partners={visiblePartners} />

      {isFormOpen && (
        <PartnerFormModal
          onSave={handleSave}
          onClose={() => setFormOpen(false)}
        />
      )}
    </>
  );
}
