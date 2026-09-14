"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { SearchIcon, TrashIcon, UsersIcon } from "@/components/ui/icons";
import { RoleTag } from "./StateTag";
import { ACCESS_ROLES, ACCESS_ROLE_ORDER } from "../data";
import type { AccessRole, FactoryMember } from "../types";

const HEAD =
  "px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.04em] whitespace-nowrap text-neutral-600 uppercase";

const CELL = "px-4 py-3 text-body-2 text-neutral-900";

const ROLE_OPTIONS = ACCESS_ROLE_ORDER.map((id) => ({
  value: id,
  label: ACCESS_ROLES[id].th,
}));

export default function UserAccessTable({
  members,
  factoryName,
  currentUserId,
  onSave,
  onRevoke,
}: {
  members: FactoryMember[];
  factoryName: string;
  currentUserId: string;
  // คืน true เมื่อบันทึกสำเร็จ — ถึงจะล้างสิ่งที่แก้ค้างไว้
  onSave: (changes: Record<string, AccessRole>) => Promise<boolean>;
  onRevoke: (member: FactoryMember) => void;
}) {
  const [search, setSearch] = useState("");
  // เก็บการแก้ไว้ก่อน กดบันทึกทีเดียวถึงจะมีผล — key คือ user id
  const [draft, setDraft] = useState<Record<string, AccessRole>>({});
  const [saving, startSaving] = useTransition();

  const keyword = search.trim().toLowerCase();
  const visible = members.filter(
    (member) =>
      !keyword ||
      member.name.toLowerCase().includes(keyword) ||
      member.email.toLowerCase().includes(keyword),
  );

  const changedCount = Object.keys(draft).length;

  const setRole = (member: FactoryMember, role: AccessRole) => {
    setDraft((current) => {
      const next = { ...current };
      // เลือกกลับมาเป็นค่าเดิม = ไม่ถือว่าแก้
      if (role === member.role) delete next[member.userId];
      else next[member.userId] = role;
      return next;
    });
  };

  const save = () => {
    startSaving(async () => {
      // บันทึกไม่ผ่านให้เก็บที่แก้ไว้ จะได้ลองใหม่โดยไม่ต้องเลือกซ้ำ
      if (await onSave(draft)) setDraft({});
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="flex w-64 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 transition-colors focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20">
        <SearchIcon size={14} className="shrink-0 text-neutral-500" />
        <span className="sr-only">ค้นหาผู้ใช้</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อหรืออีเมล"
          className="w-full text-body-3 text-neutral-900 outline-none placeholder:text-neutral-500"
        />
      </label>

      <div className="rounded-xl border border-neutral-300 bg-white">
        <div className="flex items-center gap-3 border-b border-neutral-300 px-4 py-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-body-2 font-semibold text-neutral-900">
              ผู้ใช้ของ{factoryName}
            </h2>
            <p className="text-body-3 text-neutral-500">
              {members.length} คน
              {changedCount > 0 && ` · แก้ไขแล้ว ${changedCount} รายการ`}
            </p>
          </div>
          <Button
            size="small"
            disabled={changedCount === 0}
            loading={saving}
            onClick={save}
            className="shrink-0"
          >
            บันทึกการเปลี่ยนแปลง
            {changedCount > 0 && ` (${changedCount})`}
          </Button>
        </div>

        {visible.length === 0 ? (
          <div className="grid place-items-center gap-2.5 px-6 py-12 text-center">
            <UsersIcon size={30} className="text-neutral-400" />
            <p className="text-body-2 text-neutral-600">
              {members.length === 0
                ? `ยังไม่มีผู้ใช้ใน${factoryName}`
                : "ไม่พบผู้ใช้ที่ค้นหา"}
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-50">
                <th className={HEAD}>ผู้ใช้</th>
                <th className={HEAD}>อีเมล</th>
                <th className={clsx(HEAD, "w-52")}>สิทธิ์</th>
                <th className={clsx(HEAD, "w-20 text-right")}>
                  <span className="sr-only">จัดการ</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((member, index) => {
                const isSelf = member.userId === currentUserId;
                const dirty = draft[member.userId] !== undefined;

                return (
                  <tr
                    key={member.userId}
                    className={clsx(
                      index < visible.length - 1 &&
                        "border-b border-neutral-100",
                      dirty && "bg-green-50/40",
                    )}
                  >
                    <td className={clsx(CELL, "font-medium")}>
                      <span className="flex items-center gap-2">
                        {/* จุดเขียวบอกว่าแถวนี้ยังไม่ได้บันทึก */}
                        {dirty && (
                          <span
                            className="size-1.5 shrink-0 rounded-full bg-green-400"
                            title="ยังไม่ได้บันทึก"
                          />
                        )}
                        {member.name}
                        {isSelf && (
                          <span className="text-body-3 font-normal text-neutral-500">
                            (คุณ)
                          </span>
                        )}
                      </span>
                    </td>
                    <td className={clsx(CELL, "font-eng text-neutral-700")}>
                      {member.email || "—"}
                    </td>
                    <td className="px-4 py-2">
                      {/* แก้สิทธิ์ตัวเองไม่ได้ (Select ไม่มี disabled จึงโชว์เป็นป้ายแทน) */}
                      {isSelf ? (
                        <RoleTag role={member.role} />
                      ) : (
                        <Select
                          value={draft[member.userId] ?? member.role}
                          onChange={(value) =>
                            setRole(member, value as AccessRole)
                          }
                          options={ROLE_OPTIONS}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!isSelf && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => onRevoke(member)}
                            aria-label={`ถอนสิทธิ์ ${member.name}`}
                            title="ถอนสิทธิ์"
                            className="grid size-8 cursor-pointer place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-500 transition-colors hover:border-danger/30 hover:bg-danger-light hover:text-danger-dark"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
