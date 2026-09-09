"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import FieldError from "@/components/ui/FieldError";
import { inputBox } from "@/components/ui/formStyles";
import { HandshakeIcon, XIcon } from "@/components/ui/icons";
import { PARTNER_TYPES } from "../data";
import type { Partner, PartnerType } from "../types";
import { partnerSchema, TAX_ID_LENGTH, type PartnerForm } from "../schema";

const TYPE_ORDER: PartnerType[] = ["sale", "purchase", "both"];

export default function PartnerFormModal({
  initial,
  error,
  onSave,
  onClose,
}: {
  initial?: Partner;
  error?: string | null;
  onSave: (values: PartnerForm) => Promise<void>;
  onClose: () => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PartnerForm>({
    resolver: zodResolver(partnerSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: initial?.name ?? "",
      type: initial?.type ?? "sale",
      taxId: initial?.taxId ?? "",
    },
  });

  const selectedType = useWatch({ control, name: "type" });

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
        aria-labelledby="partner-form-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit(onSave)}
        className="flex w-125 max-w-full animate-[nexus-fade-slide_0.18s_ease] flex-col rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-neutral-300 px-5 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-green-50 text-green-700">
            <HandshakeIcon size={20} />
          </span>
          <h2
            id="partner-form-title"
            className="flex-1 text-body-1 font-medium text-neutral-900"
          >
            {initial ? "แก้ไขข้อมูลคู่ค้า" : "เพิ่มคู่ค้าใหม่"}
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

        <div className="flex flex-col gap-4 px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="partner-name" className="text-body-3 font-medium text-neutral-700">
              ชื่อบริษัท
            </label>
            <input
              id="partner-name"
              autoFocus
              placeholder="เช่น บริษัท รีไซเคิล ไทย จำกัด"
              className={inputBox(errors.name)}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-3 font-medium text-neutral-700">
              ประเภทคู่ค้า
            </span>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_ORDER.map((id) => {
                const type = PARTNER_TYPES[id];
                const TypeIcon = type.icon;
                const isSelected = selectedType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      setValue("type", id, { shouldValidate: true })
                    }
                    className={clsx(
                      "flex cursor-pointer flex-col items-center gap-1 rounded-lg border px-2 py-3 transition-colors",
                      isSelected
                        ? type.chip
                        : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
                    )}
                  >
                    <TypeIcon size={18} />
                    <span className="text-body-3 font-semibold">{type.th}</span>
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.type?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="partner-tax-id" className="text-body-3 font-medium text-neutral-700">
              เลขผู้เสียภาษี
            </label>
            <input
              id="partner-tax-id"
              inputMode="numeric"
              maxLength={TAX_ID_LENGTH}
              placeholder={`ตัวเลข ${TAX_ID_LENGTH} หลัก`}
              className={clsx(inputBox(errors.taxId), "font-eng tabular-nums")}
              {...register("taxId", {
                onChange: (event) => {
                  event.target.value = event.target.value.replace(/\D/g, "");
                },
              })}
            />
            <FieldError message={errors.taxId?.message} />
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
