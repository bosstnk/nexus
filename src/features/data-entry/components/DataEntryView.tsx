"use client";

import { useState, useTransition, type ComponentType } from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import { PlusIcon, type IconProps } from "@/components/ui/icons";
import { formatThaiMonthYear, formatThaiShortDate } from "@/lib/datetime";
import type { Factory } from "@/features/factory/types";
import type { Partner } from "@/features/partners/types";
import EntryDeleteModal from "./EntryDeleteModal";
import EntryFormModal from "./EntryFormModal";
import EntryTable from "./EntryTable";
import SalesFormModal from "./SalesFormModal";
import SalesTable from "./SalesTable";
import {
  deleteTransaction,
  deleteUtilityReport,
  saveTransaction,
  saveUtilityReport,
} from "../actions";
import { ENTRY_KINDS, ENTRY_SCHEMAS, type EntryFormValues } from "../schemas";
import { SALES_META, SALE_TYPES, type SalesFormValues } from "../sales";
import type {
  EntryKind,
  EntryRecord,
  Material,
  Transaction,
} from "../types";

type TabId = EntryKind | "sales";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; record: EntryRecord }
  | { mode: "edit-sale"; record: Transaction }
  | { mode: "delete"; detail: string; run: () => Promise<void> }
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

export default function DataEntryView({
  factory,
  records,
  transactions,
  partners,
  materials,
}: {
  factory: Factory;
  records: EntryRecord[];
  transactions: Transaction[];
  partners: Partner[];
  materials: Material[];
}) {
  const [tab, setTab] = useState<TabId>("electricity");
  const [modal, setModal] = useState<ModalState>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, startDeleting] = useTransition();

  const closeModal = () => {
    setModal(null);
    setError(null);
  };

  const isSales = tab === "sales";
  const schema = isSales ? null : ENTRY_SCHEMAS[tab as EntryKind];
  const meta = isSales
    ? { titleTh: SALES_META.titleTh, icon: SALES_META.icon, tile: SALES_META.tile }
    : { titleTh: schema!.titleTh, icon: schema!.icon, tile: schema!.tile };
  const MetaIcon = meta.icon;

  // query กรอง factory_id มาแล้ว เหลือแค่แยกตามแท็บที่กำลังดู
  const visibleRecords = records
    .filter((record) => record.kind === tab)
    .sort(byMonthDesc);

  const rowCount = isSales ? transactions.length : visibleRecords.length;

  const hasMonth = (year: number, month: number) =>
    records.some(
      (record) =>
        record.kind === tab && record.year === year && record.month === month,
    );

  const handleSaveEntry = async (form: EntryFormValues) => {
    if (!schema) return;
    setError(null);

    const result = await saveUtilityReport(
      {
        kind: tab as EntryKind,
        year: Number(form.year),
        month: Number(form.month),
        values: Object.fromEntries(
          schema.metrics.map((metric) => [
            metric.key,
            Number(form.values[metric.key]),
          ]),
        ),
      },
      modal?.mode === "edit" ? modal.record.id : undefined,
    );

    if (result.ok) closeModal();
    else setError(result.message);
  };

  const handleSaveSale = async (form: SalesFormValues) => {
    setError(null);

    const result = await saveTransaction(
      {
        type: form.type,
        date: form.date,
        partnerId: form.partnerId,
        materialId: form.materialId,
        weightKg: Number(form.weight),
        amount: Number(form.amount),
      },
      modal?.mode === "edit-sale" ? modal.record.id : undefined,
    );

    if (result.ok) closeModal();
    else setError(result.message);
  };

  const confirmDelete = (detail: string, run: () => Promise<void>) =>
    setModal({ mode: "delete", detail, run });

  const askDeleteEntry = (record: EntryRecord) =>
    confirmDelete(
      `${ENTRY_SCHEMAS[record.kind].titleTh} · ${formatThaiMonthYear(record.year, record.month)}`,
      async () => {
        const result = await deleteUtilityReport(record.kind, record.id);
        if (result.ok) closeModal();
        else setError(result.message);
      },
    );

  const askDeleteSale = (record: Transaction) =>
    confirmDelete(
      `${SALE_TYPES[record.type].th} · ${record.partnerName} · ${formatThaiShortDate(record.date)}`,
      async () => {
        const result = await deleteTransaction(record.id);
        if (result.ok) closeModal();
        else setError(result.message);
      },
    );

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
            records={transactions}
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
          error={error}
          onSave={handleSaveEntry}
          onClose={closeModal}
        />
      )}

      {isSales && (modal?.mode === "create" || modal?.mode === "edit-sale") && (
        <SalesFormModal
          factory={factory}
          partners={partners}
          materials={materials}
          initial={modal.mode === "edit-sale" ? modal.record : undefined}
          error={error}
          onSave={handleSaveSale}
          onClose={closeModal}
        />
      )}

      {modal?.mode === "delete" && (
        <EntryDeleteModal
          detail={modal.detail}
          error={error}
          pending={deleting}
          onConfirm={() => startDeleting(modal.run)}
          onClose={closeModal}
        />
      )}
    </>
  );
}
