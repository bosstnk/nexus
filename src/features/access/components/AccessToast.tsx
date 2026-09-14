"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@/components/ui/icons";

// โปรเจกต์ยังไม่มี toast กลาง ตัวนี้อยู่ในฟีเจอร์นี้ก่อน
// ถ้าที่อื่นเริ่มต้องใช้ค่อยย้ายขึ้นไป components/ui/
export default function AccessToast({
  message,
  tone = "success",
  onClose,
}: {
  message: string;
  tone?: "success" | "danger";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const ok = tone === "success";
  const Icon = ok ? CheckCircleIcon : XCircleIcon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "fixed right-6 bottom-6 z-100 flex min-w-70 animate-[nexus-fade-slide_0.18s_ease] items-center gap-2.5 rounded-xl border px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.10)]",
        ok
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-danger/30 bg-danger-light text-danger-dark",
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1 text-body-2">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="ปิด"
        className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
}
