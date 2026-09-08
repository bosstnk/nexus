"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { TrashIcon } from "@/components/ui/icons";

export default function EntryDeleteModal({
  detail,
  onConfirm,
  onClose,
}: {
  detail: string;
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
        aria-labelledby="entry-delete-title"
        onClick={(event) => event.stopPropagation()}
        className="w-105 max-w-full animate-[nexus-fade-slide_0.18s_ease] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      >
        <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-5 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-danger-light text-danger-dark">
            <TrashIcon size={24} />
          </span>
          <h2
            id="entry-delete-title"
            className="text-body-1 font-medium text-neutral-900"
          >
            ลบข้อมูลรายการนี้?
          </h2>
          <p className="text-body-3 text-neutral-600">
            การกระทำนี้ไม่สามารถเรียกคืนได้
          </p>
          <p className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 text-left text-body-2 font-medium text-neutral-900">
            {detail}
          </p>
        </div>

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
          <Button variant="danger" size="small" block onClick={onConfirm}>
            <TrashIcon size={14} />
            ลบข้อมูล
          </Button>
        </div>
      </div>
    </div>
  );
}
