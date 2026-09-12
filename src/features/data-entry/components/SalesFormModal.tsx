"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import FieldError from "@/components/ui/FieldError";
import Select from "@/components/ui/Select";
import { inputBox } from "@/components/ui/formStyles";
import { CheckIcon, XIcon } from "@/components/ui/icons";
import { toISODate } from "@/lib/datetime";
import type { Factory } from "@/features/factory/types";
import type { Partner } from "@/features/partners/types";
import {
  MIXED_MATERIAL,
  PARTNER_TYPES_FOR,
  SALES_META,
  SALE_TYPES,
  salesFormSchema,
  type SalesFormValues,
} from "../sales";
import type { Material, Transaction, TransactionType } from "../types";

const LABEL = "text-body-3 font-medium text-neutral-700";

const TYPE_ORDER: TransactionType[] = ["sell", "buy"];

export default function SalesFormModal({
  factory,
  partners,
  materials,
  initial,
  error,
  onSave,
  onClose,
}: {
  factory: Factory;
  partners: Partner[];
  materials: Material[];
  initial?: Transaction;
  error?: string | null;
  onSave: (values: SalesFormValues) => Promise<void>;
  onClose: () => void;
}) {
  const SchemaIcon = SALES_META.icon;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SalesFormValues>({
    resolver: zodResolver(salesFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      type: initial?.type ?? "sell",
      date: initial?.date ?? "",
      partnerId: initial?.partnerId ?? "",
      materialId: initial?.materialId ?? "",
      weight: initial ? String(initial.weightKg) : "",
      amount: initial ? String(initial.amount) : "",
    },
  });

  const selectedType = useWatch({ control, name: "type" });
  const selectedPartnerId = useWatch({ control, name: "partnerId" });

  // ซื้อต้องเป็นคู่ค้าที่ purchase/both · ขายต้องเป็น sale/both
  const partnerOptions = partners
    .filter((partner) => PARTNER_TYPES_FOR[selectedType].includes(partner.type))
    .map((partner) => ({ value: partner.id, label: partner.name }));

  // สลับซื้อ<->ขายแล้วคู่ค้าที่เลือกไว้อาจใช้ไม่ได้อีก ต้องล้างทิ้ง
  useEffect(() => {
    if (
      selectedPartnerId &&
      !partnerOptions.some((option) => option.value === selectedPartnerId)
    ) {
      setValue("partnerId", "", { shouldValidate: true });
    }
  }, [selectedPartnerId, partnerOptions, setValue]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 grid place-items-center bg-neutral-900/45 p-6 backdrop-blur-[2px]"
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="sales-form-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit(onSave)}
        className="flex max-h-[90vh] w-120 max-w-full animate-[nexus-fade-slide_0.18s_ease] flex-col rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-neutral-300 px-5 py-4">
          <span
            className={clsx(
              "grid size-10 shrink-0 place-items-center rounded-lg",
              SALES_META.tile,
            )}
          >
            <SchemaIcon size={20} />
          </span>
          <h2
            id="sales-form-title"
            className="flex-1 text-body-1 font-medium text-neutral-900"
          >
            {initial ? "แก้ไข" : "เพิ่ม"}
            {SALES_META.titleTh}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>โรงงาน</span>
            <div
              className={clsx(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                factory.chip,
              )}
            >
              <span
                className={clsx(
                  "grid size-7 shrink-0 place-items-center rounded-md font-eng text-body-3 font-bold text-white",
                  factory.solid,
                )}
              >
                {factory.code}
              </span>
              <span className="flex-1 text-body-3 font-semibold">
                {factory.name}
              </span>
              <span className="text-[10px] text-neutral-500">
                กำหนดจากตัวสลับโรงงานด้านบน
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>ประเภทรายการ</span>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {TYPE_ORDER.map((id) => {
                    const type = SALE_TYPES[id];
                    const TypeIcon = type.icon;
                    const isSelected = field.value === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => field.onChange(id)}
                        className={clsx(
                          "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-3 text-body-2 font-semibold transition-colors",
                          isSelected
                            ? type.chip
                            : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
                        )}
                      >
                        <TypeIcon size={16} />
                        {type.th}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span id="sales-date-label" className={LABEL}>
              วันที่
            </span>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  id="sales-date"
                  value={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(toISODate(date))}
                  className={inputBox(errors.date)}
                />
              )}
            />
            <FieldError message={errors.date?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span id="sales-partner-label" className={LABEL}>
              บริษัทคู่ค้า
            </span>
            <Controller
              control={control}
              name="partnerId"
              render={({ field }) => (
                <Select
                  id="sales-partner"
                  aria-labelledby="sales-partner-label"
                  value={field.value}
                  onChange={field.onChange}
                  options={partnerOptions}
                  placeholder={
                    partnerOptions.length
                      ? "-- เลือกบริษัทคู่ค้า --"
                      : "ไม่มีคู่ค้าประเภทนี้ในทะเบียน"
                  }
                  invalid={!!errors.partnerId}
                />
              )}
            />
            <FieldError message={errors.partnerId?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>ประเภทวัสดุ</span>
            <Controller
              control={control}
              name="materialId"
              render={({ field }) => (
                <div role="radiogroup" aria-label="ประเภทวัสดุ" className="flex flex-wrap gap-1.5">
                  {materials.map((material) => {
                    const isSelected = field.value === material.id;
                    const isMixed = material.name === MIXED_MATERIAL;
                    return (
                      <button
                        key={material.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => field.onChange(material.id)}
                        className={clsx(
                          "inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-body-3 transition-colors",
                          isSelected
                            ? isMixed
                              ? "border-warning bg-warning-light font-semibold text-warning-dark"
                              : "border-green-200 bg-green-50 font-semibold text-green-700"
                            : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
                        )}
                      >
                        {isSelected && <CheckIcon size={10} strokeWidth={3} />}
                        {material.name}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <FieldError message={errors.materialId?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sales-weight" className={LABEL}>
                น้ำหนักรวม
              </label>
              <div className="relative">
                <input
                  id="sales-weight"
                  inputMode="decimal"
                  placeholder="เช่น 12.5"
                  className={clsx(
                    inputBox(errors.weight),
                    "font-eng pr-14 tabular-nums",
                  )}
                  {...register("weight")}
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-body-3 text-neutral-500">
                  kg
                </span>
              </div>
              <FieldError message={errors.weight?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="sales-amount" className={LABEL}>
                จำนวนเงิน
              </label>
              <div className="relative">
                <input
                  id="sales-amount"
                  inputMode="numeric"
                  placeholder="เช่น 187500"
                  className={clsx(
                    inputBox(errors.amount),
                    "font-eng pr-14 tabular-nums",
                  )}
                  {...register("amount")}
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-body-3 text-neutral-500">
                  ฿
                </span>
              </div>
              <FieldError message={errors.amount?.message} />
            </div>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mx-5 mb-4 rounded-lg border border-danger/30 bg-danger-light px-3 py-2 text-body-3 text-danger-dark"
          >
            {error}
          </p>
        )}

        <div className="flex shrink-0 justify-end gap-2 border-t border-neutral-300 px-5 py-4">
          <Button type="button" variant="outline" size="small" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit" size="small" loading={isSubmitting}>
            {initial ? "บันทึกการแก้ไข" : "บันทึก"}
          </Button>
        </div>
      </form>
    </div>
  );
}
