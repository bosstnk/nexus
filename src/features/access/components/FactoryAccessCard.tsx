"use client";

import clsx from "clsx";
import { CheckIcon, MapPinIcon } from "@/components/ui/icons";
import { ACCESS_ROLES, REQUEST_STATES } from "../data";
import { StateTag } from "./StateTag";
import type { FactoryAccessRow } from "../types";

// บรรทัดอธิบายใต้ชื่อโรงงาน — ซ่อนเมื่อยังไม่เคยมีอะไรเกิดขึ้นกับโรงงานนี้
function statusLine({ state }: FactoryAccessRow) {
  switch (state.key) {
    case "granted":
      return `คุณเป็นสมาชิกแล้ว — ${ACCESS_ROLES[state.role].desc}`;
    case "pending":
      return `ส่งคำขอ ${ACCESS_ROLES[state.request.role].th} เมื่อ ${state.request.requestedAt}`;
    case "rejected":
      return state.request.note
        ? `ไม่ผ่าน: ${state.request.note}`
        : "คำขอก่อนหน้าไม่ผ่าน — ขอใหม่ได้";
    case "none":
      return null;
  }
}

export default function FactoryAccessCard({
  row,
  selected,
  onToggle,
}: {
  row: FactoryAccessRow;
  selected: boolean;
  onToggle: () => void;
}) {
  const { factory, state } = row;

  // ขอได้เฉพาะโรงงานที่ยังไม่มีสิทธิ์ หรือเคยถูกปฏิเสธมาก่อน
  const canRequest = state.key === "none" || state.key === "rejected";
  const line = statusLine(row);

  return (
    <div
      onClick={canRequest ? onToggle : undefined}
      className={clsx(
        "flex items-center gap-3.5 rounded-xl border border-l-4 bg-white px-4.5 py-4 transition-colors",
        // มีสิทธิ์แล้วใช้สีประจำโรงงาน สถานะอื่นใช้สีของสถานะ
        state.key === "granted" ? factory.rail : REQUEST_STATES[state.key].rail,
        selected
          ? "border-green-400 shadow-[0_2px_10px_rgba(18,198,110,0.14)]"
          : "border-neutral-200 shadow-xs",
        canRequest && "cursor-pointer",
        canRequest && !selected && "hover:border-neutral-400",
      )}
    >
      {canRequest && (
        <span
          className={clsx(
            "grid size-5 shrink-0 place-items-center rounded-md border-[1.5px] transition-colors",
            selected
              ? "border-green-400 bg-green-400 text-white"
              : "border-neutral-400",
          )}
        >
          {selected && <CheckIcon size={12} />}
        </span>
      )}

      <span
        className={clsx(
          "grid size-11 shrink-0 place-items-center rounded-xl font-eng text-body-1 font-bold",
          state.key === "granted"
            ? `${factory.solid} text-white`
            : "bg-neutral-200 text-neutral-500",
        )}
      >
        {factory.code}
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-body-1 font-semibold text-neutral-900">
          {factory.name}
        </div>
        {factory.location && (
          <div className="mt-0.5 flex items-center gap-1 text-body-3 text-neutral-500">
            <MapPinIcon size={11} className="shrink-0" />
            {factory.location}
          </div>
        )}
        {line && (
          <p
            className={clsx(
              "mt-1.5 text-body-3",
              state.key === "granted" ? "text-neutral-600" : "text-neutral-700",
            )}
          >
            {line}
          </p>
        )}
      </div>

      <StateTag state={state} />
    </div>
  );
}
