"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import { CheckCircleIcon, XCircleIcon } from "@/components/ui/icons";
import { RoleTag } from "./StateTag";
import { ACCESS_ROLES } from "../data";
import type { JoinRequestForReview } from "../types";

// อนุมัติ = ให้สิทธิ์ตามที่ผู้ใช้ขอเท่านั้น แอดมินเลือกระดับอื่นไม่ได้
// ถ้าต้องปรับ ให้ไปแก้ในแท็บ "ผู้ใช้ทั้งหมด" หลังอนุมัติ
export default function DecisionModal({
  request,
  mode,
  factoryName,
  pending,
  error,
  onConfirm,
  onClose,
}: {
  request: JoinRequestForReview;
  mode: "approve" | "reject";
  factoryName: string;
  pending: boolean;
  error: string | null;
  onConfirm: (note: string) => void;
  onClose: () => void;
}) {
  const approve = mode === "approve";
  const [note, setNote] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const Icon = approve ? CheckCircleIcon : XCircleIcon;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 grid place-items-center bg-neutral-900/45 p-6 backdrop-blur-[2px]"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="decision-title"
        onClick={(event) => event.stopPropagation()}
        className="w-110 max-w-full animate-[nexus-fade-slide_0.18s_ease] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      >
        <div className="flex flex-col gap-3 px-6 pt-6 pb-5">
          <span
            className={clsx(
              "grid size-14 place-items-center self-center rounded-full",
              approve
                ? "bg-green-50 text-green-700"
                : "bg-danger-light text-danger-dark",
            )}
          >
            <Icon size={24} />
          </span>

          <div className="text-center">
            <h2
              id="decision-title"
              className="text-body-1 font-medium text-neutral-900"
            >
              {approve ? "อนุมัติคำขอนี้?" : "ปฏิเสธคำขอนี้?"}
            </h2>
            <p className="mt-1 text-body-3 text-neutral-600">
              {approve
                ? "ผู้ใช้จะเข้าถึงข้อมูลโรงงานนี้ได้ทันที"
                : "ผู้ใช้จะเห็นว่าคำขอไม่ผ่าน และขอใหม่ได้"}
            </p>
          </div>

          <div className="rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3">
            <div className="text-body-2 font-semibold text-neutral-900">
              {request.userName}
            </div>
            <div className="text-body-3 text-neutral-500">
              {request.userEmail || "—"} · {factoryName}
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-body-3 text-neutral-600">ขอสิทธิ์</span>
              <RoleTag role={request.role} />
            </div>

            {/* ตอนอนุมัติบอกให้ชัดว่ากำลังจะให้ทำอะไรได้บ้าง */}
            {approve && (
              <p className="mt-1.5 text-body-3 text-neutral-600">
                {ACCESS_ROLES[request.role].desc}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="decision-note"
              className="text-body-3 font-medium text-neutral-700"
            >
              หมายเหตุถึงผู้ใช้{" "}
              <span className="font-normal text-neutral-500">(ไม่บังคับ)</span>
            </label>
            <textarea
              id="decision-note"
              rows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                approve
                  ? "เช่น อนุมัติตามที่หัวหน้าฝ่ายยืนยัน"
                  : "เช่น กรุณาขอผ่านหัวหน้าฝ่ายก่อน"
              }
              className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-body-2 text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-danger/30 bg-danger-light px-3 py-2 text-body-3 text-danger-dark"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-2 border-t border-neutral-300 bg-neutral-50 px-6 py-4">
          <Button variant="outline" size="small" block onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            variant={approve ? "primary" : "danger"}
            size="small"
            block
            loading={pending}
            onClick={() => onConfirm(note)}
          >
            {approve ? "อนุมัติ" : "ปฏิเสธ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
