"use client";

import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import {
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  InboxIcon,
  SendIcon,
  XIcon,
} from "@/components/ui/icons";
import AccessToast from "./AccessToast";
import FactoryAccessCard from "./FactoryAccessCard";
import { RoleTag } from "./StateTag";
import { cancelFactoryAccessRequest, requestFactoryAccess } from "../actions";
import { ACCESS_ROLES, ACCESS_ROLE_ORDER, REQUEST_STATES } from "../data";
import type {
  AccessFactory,
  AccessRequest,
  AccessRole,
  FactoryAccessRow,
  FactoryAccessState,
} from "../types";

type TabId = "factories" | "history";

// สถานะของโรงงานหนึ่งแห่ง: มีสิทธิ์ > รออนุมัติ > เคยถูกปฏิเสธ > ยังไม่มีอะไรเลย
function resolveState(
  factoryId: string,
  memberships: Record<string, AccessRole>,
  requests: AccessRequest[],
): FactoryAccessState {
  const role = memberships[factoryId];
  if (role) return { key: "granted", role };

  const mine = requests.filter((request) => request.factoryId === factoryId);

  const pending = mine.find((request) => request.status === "pending");
  if (pending) return { key: "pending", request: pending };

  // requests เรียงใหม่ -> เก่ามาจาก DB ตัวแรกที่เจอจึงเป็นครั้งล่าสุด
  const rejected = mine.find((request) => request.status === "rejected");
  if (rejected) return { key: "rejected", request: rejected };

  return { key: "none" };
}

export default function MyAccessView({
  factories,
  memberships,
  requests,
}: {
  factories: AccessFactory[];
  memberships: Record<string, AccessRole>;
  requests: AccessRequest[];
}) {
  const [tab, setTab] = useState<TabId>("factories");
  const [picked, setPicked] = useState<string[]>([]);
  const [role, setRole] = useState<AccessRole>("member");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [submitting, startSubmit] = useTransition();
  const [, startCancel] = useTransition();
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "danger";
  } | null>(null);

  const rows: FactoryAccessRow[] = useMemo(
    () =>
      factories.map((factory) => ({
        factory,
        state: resolveState(factory.id, memberships, requests),
      })),
    [factories, memberships, requests],
  );

  const requestable = rows.filter(
    (row) => row.state.key === "none" || row.state.key === "rejected",
  );
  const grantedCount = rows.filter((row) => row.state.key === "granted").length;
  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  );

  const factoryName = (factoryId: string) =>
    factories.find((factory) => factory.id === factoryId)?.name ?? "โรงงาน";

  const toggle = (factoryId: string) => {
    setError(null);
    setPicked((current) =>
      current.includes(factoryId)
        ? current.filter((id) => id !== factoryId)
        : [...current, factoryId],
    );
  };

  const submit = () => {
    if (!picked.length) {
      setError("เลือกอย่างน้อย 1 โรงงานจากรายการด้านซ้าย");
      return;
    }

    setError(null);
    startSubmit(async () => {
      const result = await requestFactoryAccess({
        factoryIds: picked,
        role,
        reason,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      // revalidatePath ส่ง requests ชุดใหม่ลงมาเอง — การ์ดจะเปลี่ยนเป็น "รออนุมัติ" ตามมา
      setToast({
        message:
          result.count === 1
            ? "ส่งคำขอแล้ว — รอผู้ดูแลอนุมัติ"
            : `ส่งคำขอ ${result.count} โรงงานแล้ว — รอผู้ดูแลอนุมัติ`,
        tone: "success",
      });
      setPicked([]);
      setReason("");
    });
  };

  const cancelRequest = (request: AccessRequest) => {
    setCancellingId(request.id);
    startCancel(async () => {
      const result = await cancelFactoryAccessRequest(request.id);
      setCancellingId(null);

      setToast(
        result.ok
          ? {
              message: `ยกเลิกคำขอของ ${factoryName(request.factoryId)} แล้ว`,
              tone: "danger",
            }
          : { message: result.message, tone: "danger" },
      );
    });
  };

  const tabs: { id: TabId; th: string; count: number }[] = [
    { id: "factories", th: "โรงงานของฉัน", count: grantedCount },
    { id: "history", th: "คำขอของฉัน", count: pendingRequests.length },
  ];

  const summary = [
    {
      th: "เข้าถึงได้",
      value: grantedCount,
      total: factories.length,
      icon: CheckCircleIcon,
      tile: "bg-green-50 text-green-700",
    },
    {
      th: "รออนุมัติ",
      value: pendingRequests.length,
      icon: ClockIcon,
      tile: "bg-warning-light text-warning-dark",
    },
  ];

  return (
    <>
      <div className="grid shrink-0 grid-cols-2 gap-3">
        {summary.map((item) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={item.th}
              className="flex items-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3.5"
            >
              <span
                className={clsx(
                  "grid size-9 shrink-0 place-items-center rounded-lg",
                  item.tile,
                )}
              >
                <ItemIcon size={16} />
              </span>
              <div>
                <div className="font-eng text-headline-5 leading-tight font-medium tabular-nums text-neutral-900">
                  {item.value}
                  {item.total !== undefined && (
                    <span className="text-body-2 text-neutral-500">
                      {" "}
                      / {item.total}
                    </span>
                  )}
                </div>
                <div className="text-body-3 text-neutral-600">{item.th}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 gap-1 self-start rounded-lg bg-neutral-100 p-1">
        {tabs.map((item) => {
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
              {item.th}
              {item.count > 0 && (
                <span
                  className={clsx(
                    "rounded-full px-1.5 font-eng text-[10px] font-semibold",
                    item.id === "history"
                      ? "bg-warning-light text-warning-dark"
                      : "bg-neutral-200 text-neutral-600",
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "factories" && (
        <div className="flex items-start gap-5">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-body-2 font-semibold text-neutral-900">
                โรงงานในระบบ
              </h2>
              <p className="flex-1 text-body-3 text-neutral-500">
                {rows.length} โรงงาน · เลือกโรงงานที่ต้องการเป็นสมาชิก
              </p>
              {requestable.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setPicked(
                      picked.length === requestable.length
                        ? []
                        : requestable.map((row) => row.factory.id),
                    )
                  }
                  className="cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 py-1 text-body-3 whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  {picked.length === requestable.length
                    ? "ล้างที่เลือก"
                    : "เลือกทั้งหมดที่ขอได้"}
                </button>
              )}
            </div>

            {rows.length === 0 ? (
              <div className="grid place-items-center gap-2.5 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
                <InboxIcon size={30} className="text-neutral-400" />
                <p className="text-body-2 text-neutral-600">
                  ยังไม่มีโรงงานในระบบ
                </p>
              </div>
            ) : (
              rows.map((row) => (
                <FactoryAccessCard
                  key={row.factory.id}
                  row={row}
                  selected={picked.includes(row.factory.id)}
                  onToggle={() => toggle(row.factory.id)}
                />
              ))
            )}
          </div>

          <aside className="sticky top-0 w-80 shrink-0 rounded-xl border border-neutral-300 bg-white p-4.5">
            <div className="mb-4">
              <h2 className="text-body-1 font-medium text-neutral-900">
                ขอสิทธิ์เพิ่ม
              </h2>
              <p className="text-body-3 text-neutral-500">
                Request more access
              </p>
            </div>

            {requestable.length === 0 ? (
              <p className="flex gap-2 rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 text-body-3 text-green-700">
                <CheckCircleIcon size={14} className="mt-0.5 shrink-0" />
                คุณมีสิทธิ์หรือมีคำขอค้างอยู่ครบทุกโรงงานแล้ว
              </p>
            ) : (
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-body-3 font-medium text-neutral-700">
                    โรงงานที่เลือก{picked.length > 0 && ` (${picked.length})`}
                  </span>
                  {picked.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2.5 text-body-3 text-neutral-500">
                      ยังไม่เลือก — ติ๊กโรงงานจากรายการด้านซ้าย
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {picked.map((factoryId) => {
                        const factory = factories.find(
                          (item) => item.id === factoryId,
                        );
                        if (!factory) return null;
                        return (
                          <span
                            key={factoryId}
                            className={clsx(
                              "inline-flex items-center gap-1 rounded-full border py-0.5 pr-1.5 pl-2.5 text-body-3 font-medium",
                              factory.chip,
                            )}
                          >
                            {factory.code}
                            <button
                              type="button"
                              onClick={() => toggle(factoryId)}
                              aria-label={`เอา ${factory.name} ออก`}
                              className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
                            >
                              <XIcon size={11} />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <span
                    id="access-role-label"
                    className="text-body-3 font-medium text-neutral-700"
                  >
                    ระดับสิทธิ์ที่ขอ
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby="access-role-label"
                    className="flex flex-col gap-1.5"
                  >
                    {ACCESS_ROLE_ORDER.map((id) => {
                      const meta = ACCESS_ROLES[id];
                      const RoleIcon = meta.icon;
                      const isSelected = role === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setRole(id)}
                          className={clsx(
                            "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors",
                            isSelected
                              ? meta.chip
                              : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
                          )}
                        >
                          <RoleIcon size={14} className="shrink-0" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-body-3 font-semibold">
                              {meta.th}
                            </span>
                            <span className="block text-[10px] leading-snug text-neutral-500">
                              {meta.desc}
                            </span>
                          </span>
                          {isSelected && (
                            <CheckIcon size={14} className="shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="access-reason"
                    className="text-body-3 font-medium text-neutral-700"
                  >
                    เหตุผล{" "}
                    <span className="font-normal text-neutral-500">
                      (ไม่บังคับ)
                    </span>
                  </label>
                  <textarea
                    id="access-reason"
                    rows={3}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="เช่น รับผิดชอบบันทึกค่าไฟและค่าน้ำรายเดือน"
                    className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-body-2 leading-relaxed text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  />
                  {picked.length > 1 && (
                    <span className="text-body-3 text-neutral-600">
                      ใช้เหตุผลเดียวกันกับทั้ง {picked.length} โรงงาน
                    </span>
                  )}
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-danger/30 bg-danger-light px-3 py-2 text-body-3 text-danger-dark"
                  >
                    {error}
                  </p>
                )}

                <Button
                  size="small"
                  block
                  loading={submitting}
                  onClick={submit}
                >
                  <SendIcon size={13} />
                  {picked.length > 1
                    ? `ส่งคำขอ ${picked.length} โรงงาน`
                    : "ส่งคำขอ"}
                </Button>
              </div>
            )}
          </aside>
        </div>
      )}

      {tab === "history" &&
        (requests.length === 0 ? (
          <div className="grid place-items-center gap-2.5 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
            <InboxIcon size={30} className="text-neutral-400" />
            <div>
              <p className="text-body-2 text-neutral-600">
                คุณยังไม่เคยส่งคำขอ
              </p>
              <p className="text-body-3 text-neutral-500">No requests yet</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {requests.map((request) => {
              const stateKey =
                request.status === "approved"
                  ? "granted"
                  : request.status === "rejected"
                    ? "rejected"
                    : "pending";
              const meta = REQUEST_STATES[stateKey];
              const MetaIcon = meta.icon;

              // อนุมัติแล้วแอดมินอาจให้ระดับต่างจากที่ขอ — ระดับจริงอยู่ใน membership
              const shownRole =
                request.status === "approved"
                  ? (memberships[request.factoryId] ?? request.role)
                  : request.role;

              return (
                <div
                  key={request.id}
                  className={clsx(
                    "flex items-start gap-3.5 rounded-xl border border-l-4 border-neutral-300 bg-white px-4.5 py-3.5",
                    meta.rail,
                  )}
                >
                  <span
                    className={clsx(
                      "grid size-9 shrink-0 place-items-center rounded-lg",
                      meta.chip,
                    )}
                  >
                    <MetaIcon size={15} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-body-2 font-semibold text-neutral-900">
                        {factoryName(request.factoryId)}
                      </span>
                      <span className="text-body-3 text-neutral-600">
                        ขอสิทธิ์
                      </span>
                      <RoleTag role={shownRole} />
                    </div>

                    {/* เหตุผลไม่บังคับ ใบที่ไม่กรอกต้องไม่มีกล่องเปล่าโผล่ */}
                    {request.reason && (
                      <p className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-body-3 leading-relaxed text-neutral-700">
                        “{request.reason}”
                      </p>
                    )}

                    {request.note && (
                      <p className="mt-1.5 text-body-3 text-neutral-700">
                        ผู้ดูแล: {request.note}
                      </p>
                    )}

                    <p className="mt-1.5 text-body-3 text-neutral-500">
                      ส่งคำขอ {request.requestedAt}
                      {request.reviewedAt && ` · ตอบกลับ ${request.reviewedAt}`}
                    </p>
                  </div>

                  {request.status === "pending" && (
                    <Button
                      size="small"
                      variant="danger"
                      loading={cancellingId === request.id}
                      onClick={() => cancelRequest(request)}
                    >
                      ยกเลิกคำขอ
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ))}

      {toast && (
        <AccessToast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
