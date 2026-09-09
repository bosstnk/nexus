"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import FieldError from "@/components/ui/FieldError";
import Select from "@/components/ui/Select";
import { inputBox } from "@/components/ui/formStyles";
import { AlertTriangleIcon, XIcon } from "@/components/ui/icons";
import { thaiMonthNames } from "@/lib/datetime";
import type { Factory } from "@/features/factory/types";
import { YEARS, type EntryRecord } from "../data";
import {
  buildEntryFormSchema,
  type EntryFormValues,
  type EntrySchema,
} from "../schemas";

const MONTH_OPTIONS = thaiMonthNames().map((label, index) => ({
  value: String(index),
  label,
}));

const YEAR_OPTIONS = YEARS.map((year) => ({
  value: String(year),
  label: String(year + 543),
}));

const LABEL = "text-body-3 font-medium text-neutral-700";

export default function EntryFormModal({
  schema,
  factory,
  initial,
  duplicateOf,
  onSave,
  onClose,
}: {
  schema: EntrySchema;
  factory: Factory;
  initial?: EntryRecord;
  duplicateOf: (year: number, month: number) => boolean;
  onSave: (values: EntryFormValues) => void;
  onClose: () => void;
}) {
  const SchemaIcon = schema.icon;
  const formSchema = useMemo(() => buildEntryFormSchema(schema), [schema]);
  const now = new Date();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      year: String(initial?.year ?? now.getFullYear()),
      month: String(initial?.month ?? now.getMonth()),
      values: Object.fromEntries(
        schema.metrics.map((metric) => [
          metric.key,
          initial ? String(initial.values[metric.key] ?? "") : "",
        ]),
      ),
    },
  });

  const watched = useWatch({ control });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const willOverwrite =
    !initial &&
    duplicateOf(Number(watched.year ?? 0), Number(watched.month ?? 0));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 grid place-items-center bg-neutral-900/45 p-6 backdrop-blur-[2px]"
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-form-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit(onSave)}
        className="flex max-h-[90vh] w-120 max-w-full animate-[nexus-fade-slide_0.18s_ease] flex-col rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-neutral-300 px-5 py-4">
          <span
            className={clsx(
              "grid size-10 shrink-0 place-items-center rounded-lg",
              schema.tile,
            )}
          >
            <SchemaIcon size={20} />
          </span>
          <h2
            id="entry-form-title"
            className="flex-1 text-body-1 font-medium text-neutral-900"
          >
            {initial ? "แก้ไข" : "เพิ่ม"}
            {schema.titleTh}
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

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span id="entry-year-label" className={LABEL}>
                ปี
              </span>
              <Controller
                control={control}
                name="year"
                render={({ field }) => (
                  <Select
                    id="entry-year"
                    aria-labelledby="entry-year-label"
                    value={field.value}
                    onChange={field.onChange}
                    options={YEAR_OPTIONS}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span id="entry-month-label" className={LABEL}>
                เดือน
              </span>
              <Controller
                control={control}
                name="month"
                render={({ field }) => (
                  <Select
                    id="entry-month"
                    aria-labelledby="entry-month-label"
                    value={field.value}
                    onChange={field.onChange}
                    options={MONTH_OPTIONS}
                  />
                )}
              />
            </div>
          </div>

          {schema.metrics.map((metric) => {
            const error = errors.values?.[metric.key]?.message;
            return (
              <div key={metric.key} className="flex flex-col gap-1.5">
                <label htmlFor={`entry-${metric.key}`} className={LABEL}>
                  {metric.labelTh}
                </label>
                <div className="relative">
                  <input
                    id={`entry-${metric.key}`}
                    inputMode="decimal"
                    placeholder={metric.placeholder}
                    className={clsx(
                      inputBox(error),
                      "font-eng tabular-nums",
                      (metric.prefix || metric.suffix) && "pr-14",
                    )}
                    {...register(`values.${metric.key}`)}
                  />
                  {(metric.prefix || metric.suffix) && (
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-body-3 text-neutral-500">
                      {metric.suffix ?? metric.prefix}
                    </span>
                  )}
                </div>
                <FieldError message={error} />
              </div>
            );
          })}

          {willOverwrite && (
            <div className="flex items-start gap-2 rounded-lg border border-warning bg-warning-light px-3 py-2.5 text-body-3 text-warning-dark">
              <AlertTriangleIcon size={14} className="mt-0.5 shrink-0" />
              <span>
                มีข้อมูลของเดือนนี้อยู่แล้ว — บันทึกแล้วจะเขียนทับรายการเดิม
              </span>
            </div>
          )}
        </div>

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
