"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { TrashIcon } from "@/components/ui/icons";
import type { Partner } from "../types";

export default function PartnerDeleteModal({
  partner,
  error,
  pending,
  onConfirm,
  onClose,
}: {
  partner: Partner;
  error?: string | null;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
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
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="partner-delete-title"
        onClick={(event) => event.stopPropagation()}
        className="w-105 max-w-full animate-[nexus-fade-slide_0.18s_ease] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      >
        <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-5 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-danger-light text-danger-dark">
            <TrashIcon size={24} />
          </span>
          <h2
            id="partner-delete-title"
            className="text-body-1 font-medium text-neutral-900"
          >
            ลบคู่ค้ารายนี้?
          </h2>
          <p className="text-body-3 text-neutral-600">
            บริษัทจะถูกเอาออกจากทะเบียนของโรงงานนี้เท่านั้น
            ข้อมูลบริษัทยังอยู่ในระบบ
          </p>
          <p className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 text-left text-body-2 font-medium text-neutral-900">
            {partner.name}
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mx-6 mb-4 rounded-lg border border-danger/30 bg-danger-light px-3 py-2 text-body-3 text-danger-dark"
          >
            {error}
          </p>
        )}

        <div className="flex gap-2 border-t border-neutral-300 bg-neutral-50 px-6 py-4">
          <Button
            variant="outline"
            size="small"
            block
            onClick={onClose}
            autoFocus
          >
            ยกเลิก
          </Button>
          <Button
            variant="danger"
            size="small"
            block
            loading={pending}
            onClick={onConfirm}
          >
            <TrashIcon size={14} />
            ลบคู่ค้า
          </Button>
        </div>
      </div>
    </div>
  );
}
