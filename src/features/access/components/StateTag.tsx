import clsx from "clsx";
import { ACCESS_ROLES, REQUEST_STATES } from "../data";
import type { AccessRole, FactoryAccessState } from "../types";

const CHIP =
  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-body-3 font-semibold whitespace-nowrap";

// ถ้ามีสิทธิ์แล้วให้บอกไปเลยว่าระดับไหน มีค่ากว่าคำว่า "มีสิทธิ์แล้ว" ลอย ๆ
export function StateTag({ state }: { state: FactoryAccessState }) {
  const meta =
    state.key === "granted"
      ? ACCESS_ROLES[state.role]
      : REQUEST_STATES[state.key];
  const Icon = meta.icon;

  return (
    <span className={clsx(CHIP, meta.chip)}>
      <Icon size={11} />
      {meta.th}
    </span>
  );
}

export function RoleTag({ role }: { role: AccessRole }) {
  const meta = ACCESS_ROLES[role];
  const Icon = meta.icon;

  return (
    <span className={clsx(CHIP, meta.chip)}>
      <Icon size={11} />
      {meta.th}
    </span>
  );
}
