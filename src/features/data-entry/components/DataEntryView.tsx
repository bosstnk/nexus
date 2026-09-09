"use client";

import { useState, type ComponentType } from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import { PlusIcon, type IconProps } from "@/components/ui/icons";
import { formatThaiMonthYear, formatThaiShortDate } from "@/lib/datetime";
import type { Factory } from "@/features/factory/types";
import EntryDeleteModal from "./EntryDeleteModal";
import EntryFormModal from "./EntryFormModal";
import EntryTable from "./EntryTable";
import SalesFormModal from "./SalesFormModal";
import SalesTable from "./SalesTable";
import { ENTRY_RECORDS, type EntryKind, type EntryRecord } from "../data";
import {
  ENTRY_KINDS,
  ENTRY_SCHEMAS,
  type EntryFormValues,
} from "../schemas";
import {
  SALES_META,
  SALE_RECORDS,
  SALE_TYPES,
  type SaleRecord,
  type SalesFormValues,
} from "../sales";

type TabId = EntryKind | "sales";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; record: EntryRecord }
  | { mode: "edit-sale"; record: SaleRecord }
  | { mode: "delete"; detail: string; onConfirm: () => void }
  | null;

const TABS: {
  id: TabId;
  label: string;
  icon: ComponentType<IconProps>;
  accent: string;
}[] = [
  ...ENTRY_KINDS.map((id) => ({
    id: id as TabId,
    label: ENTRY_SCHEMAS[id].tabLabel,
    icon: ENTRY_SCHEMAS[id].icon,
    accent: ENTRY_SCHEMAS[id].accent,
  })),
  {
    id: "sales",
    label: SALES_META.tabLabel,
    icon: SALES_META.icon,
    accent: SALES_META.accent,
  },
];

const byMonthDesc = (a: EntryRecord, b: EntryRecord) =>
  b.year - a.year || b.month - a.month;

const byDateDesc = (a: SaleRecord, b: SaleRecord) =>
  b.date.localeCompare(a.date);

export default function DataEntryView({ factory }: { factory: Factory }) {
  // TODO: ชั่วคราว — ข้อมูลตัวอย่างยังใช้ "tst"/"btk" เป็น factoryId แต่ของจริง
  // เป็น uuid จาก DB ทิ้งบรรทัดนี้ได้เมื่อย้าย records ขึ้น Supabase แล้ว
  const factoryKey = factory.code.toLowerCase();

  const [tab, setTab] = useState<TabId>("electricity");
  const [records, setRecords] = useState<EntryRecord[]>(ENTRY_RECORDS);
  const [sales, setSales] = useState<SaleRecord[]>(SALE_RECORDS);
  const [modal, setModal] = useState<ModalState>(null);

  const isSales = tab === "sales";
  const schema = isSales ? null : ENTRY_SCHEMAS[tab as EntryKind];
  const meta = isSales
    ? { titleTh: SALES_META.titleTh, icon: SALES_META.icon, tile: SALES_META.tile }
    : { titleTh: schema!.titleTh, icon: schema!.icon, tile: schema!.tile };
  const MetaIcon = meta.icon;

  const visibleRecords = records
    .filter((record) => record.kind === tab && record.factoryId === factoryKey)
    .sort(byMonthDesc);

  const visibleSales = sales
    .filter((record) => record.factoryId === factoryKey)
    .sort(byDateDesc);

  const rowCount = isSales ? visibleSales.length : visibleRecords.length;

  const hasMonth = (year: number, month: number) =>
    records.some(
      (record) =>
        record.kind === tab &&
        record.factoryId === factoryKey &&
        record.year === year &&
        record.month === month,
    );

  const handleSaveEntry = (form: EntryFormValues) => {
    if (!schema) return;

    const year = Number(form.year);
    const month = Number(form.month);
    const values = Object.fromEntries(
      schema.metrics.map((metric) => [
        metric.key,
        Number(form.values[metric.key]),
      ]),
    );
    const submittedAt = new Date().toISOString().slice(0, 10);

    setRecords((current) => {
      if (modal?.mode === "edit") {
        return current.map((record) =>
          record.id === modal.record.id
            ? { ...record, year, month, values, submittedAt }
            : record,
        );
      }

      const withoutSameMonth = current.filter(
        (record) =>
          !(
            record.kind === tab &&
            record.factoryId === factoryKey &&
            record.year === year &&
            record.month === month
          ),
      );

      return [
        {
          id: Date.now(),
          kind: tab as EntryKind,
          factoryId: factoryKey,
          year,
          month,
          values,
          submittedBy: "สมชาย",
          submittedAt,
        },
        ...withoutSameMonth,
      ];
    });

    setModal(null);
  };

  const handleSaveSale = (form: SalesFormValues) => {
    const values = {
      type: form.type,
      date: form.date,
      partner: form.partner,
      materials: form.materials,
      weight: Number(form.weight),
      amount: Number(form.amount),
    };

    setSales((current) =>
      modal?.mode === "edit-sale"
        ? current.map((record) =>
            record.id === modal.record.id ? { ...record, ...values } : record,
          )
        : [
            {
              id: Date.now(),
              factoryId: factoryKey,
              submittedBy: "สมชาย",
              ...values,
            },
            ...current,
          ],
    );

    setModal(null);
  };

  const askDeleteEntry = (record: EntryRecord) =>
    setModal({
      mode: "delete",
      detail: `${ENTRY_SCHEMAS[record.kind].titleTh} · ${formatThaiMonthYear(record.year, record.month)}`,
      onConfirm: () =>
        setRecords((current) =>
          current.filter((item) => item.id !== record.id),
        ),
    });

  const askDeleteSale = (record: SaleRecord) =>
    setModal({
      mode: "delete",
      detail: `${SALE_TYPES[record.type].th} · ${record.partner} · ${formatThaiShortDate(record.date)}`,
      onConfirm: () =>
        setSales((current) => current.filter((item) => item.id !== record.id)),
    });

  return (
    <>
      <div className="flex shrink-0 gap-1 self-start rounded-lg bg-neutral-100 p-1">
        {TABS.map((item) => {
          const TabIcon = item.icon;
          const isActive = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={isActive}
              className={clsx(
                "inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-body-3 transition-colors",
                isActive
                  ? "bg-white font-semibold text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              <TabIcon
                size={16}
                className={isActive ? item.accent : "text-neutral-500"}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-3 rounded-xl border border-neutral-300 bg-white px-5 py-4">
        <span
          className={clsx(
            "grid size-12 shrink-0 place-items-center rounded-lg",
            meta.tile,
          )}
        >
          <MetaIcon size={24} />
        </span>
        <div className="min-w-0">
          <h2 className="text-body-1 font-medium text-neutral-900">
            {meta.titleTh} · {factory.name}
          </h2>
          <p className="text-body-3 text-neutral-600">
            {rowCount} รายการ ·{" "}
            {isSales
              ? "บันทึกได้หลายรายการต่อเดือน"
              : "หนึ่งเดือนบันทึกได้หนึ่งครั้ง"}{" "}
            เปลี่ยนโรงงานได้จากแถบด้านบน
          </p>
        </div>
        <Button
          size="small"
          className="ml-auto"
          onClick={() => setModal({ mode: "create" })}
        >
          <PlusIcon size={14} />
          เพิ่มข้อมูล
        </Button>
      </div>

      {rowCount > 0 ? (
        isSales ? (
          <SalesTable
            records={visibleSales}
            onEdit={(record) => setModal({ mode: "edit-sale", record })}
            onDelete={askDeleteSale}
          />
        ) : (
          <EntryTable
            schema={schema!}
            records={visibleRecords}
            onEdit={(record) => setModal({ mode: "edit", record })}
            onDelete={askDeleteEntry}
          />
        )
      ) : (
        <div className="grid place-items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
          <MetaIcon size={32} className="text-neutral-400" />
          <div>
            <p className="text-body-2 text-neutral-600">
              ยังไม่มีข้อมูล{meta.titleTh}ของ{factory.name}
            </p>
            <p className="text-body-3 text-neutral-500">
              กด “เพิ่มข้อมูล” เพื่อบันทึกรายการแรก
            </p>
          </div>
        </div>
      )}

      {!isSales && (modal?.mode === "create" || modal?.mode === "edit") && (
        <EntryFormModal
          schema={schema!}
          factory={factory}
          initial={modal.mode === "edit" ? modal.record : undefined}
          duplicateOf={hasMonth}
          onSave={handleSaveEntry}
          onClose={() => setModal(null)}
        />
      )}

      {isSales && (modal?.mode === "create" || modal?.mode === "edit-sale") && (
        <SalesFormModal
          factory={factory}
          initial={modal.mode === "edit-sale" ? modal.record : undefined}
          onSave={handleSaveSale}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.mode === "delete" && (
        <EntryDeleteModal
          detail={modal.detail}
          onConfirm={() => {
            modal.onConfirm();
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
