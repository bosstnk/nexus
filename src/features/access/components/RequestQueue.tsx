"use client";

import Button from "@/components/ui/Button";
import { CheckIcon, InboxIcon, XIcon } from "@/components/ui/icons";
import { RoleTag } from "./StateTag";
import type { JoinRequestForReview } from "../types";

export default function RequestQueue({
  requests,
  onDecide,
}: {
  requests: JoinRequestForReview[];
  onDecide: (request: JoinRequestForReview, mode: "approve" | "reject") => void;
}) {
  if (requests.length === 0) {
    return (
      <div className="grid place-items-center gap-2.5 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
        <InboxIcon size={30} className="text-neutral-400" />
        <div>
          <p className="text-body-2 text-neutral-600">ไม่มีคำขอรออนุมัติ</p>
          <p className="text-body-3 text-neutral-500">All caught up</p>
        </div>
      </div>
    );
  }

  // คิวผูกกับโรงงานที่เลือกอยู่แล้ว จึงไม่ต้องบอกซ้ำว่าขอเข้าโรงงานไหน
  return (
    <div className="flex flex-col gap-2.5">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-start gap-3.5 rounded-xl border border-l-4 border-neutral-300 border-l-warning bg-white px-4.5 py-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body-1 font-semibold text-neutral-900">
                {request.userName}
              </span>
              <span className="font-eng text-body-3 text-neutral-500">
                {request.userEmail || "—"}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-body-3 text-neutral-600">ขอสิทธิ์</span>
              <RoleTag role={request.role} />
            </div>

            {/* เหตุผลไม่บังคับ — ใบที่ไม่กรอกต้องไม่มีกล่องเปล่า */}
            {request.reason && (
              <p className="mt-2.5 rounded-lg bg-neutral-50 px-3 py-2 text-body-3 leading-relaxed text-neutral-700">
                “{request.reason}”
              </p>
            )}

            <p className="mt-2 text-body-3 text-neutral-500">
              ส่งคำขอ {request.requestedAt}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              size="small"
              variant="danger"
              onClick={() => onDecide(request, "reject")}
            >
              <XIcon size={12} />
              ปฏิเสธ
            </Button>
            <Button size="small" onClick={() => onDecide(request, "approve")}>
              <CheckIcon size={12} />
              อนุมัติ
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
