"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import AccessToast from "./AccessToast";
import DecisionModal from "./DecisionModal";
import RequestQueue from "./RequestQueue";
import RevokeModal from "./RevokeModal";
import UserAccessTable from "./UserAccessTable";
import {
  approveJoinRequest,
  rejectJoinRequest,
  removeMember,
  updateMemberRoles,
} from "../actions";
import { ACCESS_ROLES } from "../data";
import type {
  AccessRole,
  FactoryMember,
  JoinRequestForReview,
} from "../types";

type TabId = "requests" | "users";

type Toast = { message: string; tone: "success" | "danger" };

export default function AccessManageView({
  factory,
  requests,
  members,
  currentUserId,
}: {
  factory: { id: string; name: string };
  requests: JoinRequestForReview[];
  members: FactoryMember[];
  currentUserId: string;
}) {
  const [tab, setTab] = useState<TabId>("requests");
  const [decision, setDecision] = useState<{
    request: JoinRequestForReview;
    mode: "approve" | "reject";
  } | null>(null);
  const [revoking, setRevoking] = useState<FactoryMember | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [pending, startTransition] = useTransition();

  const closeModals = () => {
    setDecision(null);
    setRevoking(null);
    setModalError(null);
  };

  // ข้อมูลในหน้าไม่ได้แก้ใน state — action สำเร็จแล้ว revalidatePath จะส่งชุดใหม่ลงมาเอง
  const decide = (note: string) => {
    if (!decision) return;
    const { request, mode } = decision;
    setModalError(null);

    startTransition(async () => {
      // อนุมัติไม่ส่ง role — server ใช้ระดับที่ผู้ใช้ขอไว้ใน DB เท่านั้น
      const result =
        mode === "approve"
          ? await approveJoinRequest({
              requestId: request.id,
              factoryId: factory.id,
              note,
            })
          : await rejectJoinRequest({
              requestId: request.id,
              factoryId: factory.id,
              note,
            });

      if (!result.ok) {
        setModalError(result.message);
        return;
      }

      setToast(
        mode === "approve"
          ? {
              message: `อนุมัติ ${request.userName} — สิทธิ์${ACCESS_ROLES[request.role].th}`,
              tone: "success",
            }
          : { message: `ปฏิเสธคำขอของ ${request.userName}`, tone: "danger" },
      );
      closeModals();
    });
  };

  const revoke = () => {
    if (!revoking) return;
    const member = revoking;
    setModalError(null);

    startTransition(async () => {
      const result = await removeMember({
        factoryId: factory.id,
        userId: member.userId,
      });

      if (!result.ok) {
        setModalError(result.message);
        return;
      }

      setToast({
        message: `ถอนสิทธิ์ ${member.name} ออกจาก${factory.name}แล้ว`,
        tone: "danger",
      });
      closeModals();
    });
  };

  const saveRoles = async (changes: Record<string, AccessRole>) => {
    const result = await updateMemberRoles({ factoryId: factory.id, changes });

    setToast(
      result.ok
        ? { message: `บันทึกสิทธิ์ ${result.count} รายการแล้ว`, tone: "success" }
        : { message: result.message, tone: "danger" },
    );
    return result.ok;
  };

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "requests", label: "คำขอสิทธิ์", count: requests.length },
    { id: "users", label: "ผู้ใช้ทั้งหมด", count: members.length },
  ];

  return (
    <>
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
              {item.label}
              {item.count > 0 && (
                <span
                  className={clsx(
                    "rounded-full px-1.5 font-eng text-[10px] font-semibold",
                    item.id === "requests"
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

      {tab === "requests" && (
        <RequestQueue
          requests={requests}
          onDecide={(request, mode) => setDecision({ request, mode })}
        />
      )}

      {tab === "users" && (
        <UserAccessTable
          // remount เมื่อสลับโรงงาน เพื่อทิ้งการแก้ที่ยังไม่บันทึกของโรงงานเดิม
          key={factory.id}
          members={members}
          factoryName={factory.name}
          currentUserId={currentUserId}
          onSave={saveRoles}
          onRevoke={setRevoking}
        />
      )}

      {decision && (
        <DecisionModal
          request={decision.request}
          mode={decision.mode}
          factoryName={factory.name}
          pending={pending}
          error={modalError}
          onConfirm={decide}
          onClose={closeModals}
        />
      )}

      {revoking && (
        <RevokeModal
          member={revoking}
          factoryName={factory.name}
          pending={pending}
          error={modalError}
          onConfirm={revoke}
          onClose={closeModals}
        />
      )}

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
