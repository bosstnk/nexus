import clsx from "clsx";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { ACTION_BUTTON } from "./tableStyles";

export default function RowActions({
  label,
  canEdit,
  onEdit,
  onDelete,
}: {
  label: string;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  // ตัวที่กันจริงคือ RLS ฝั่ง DB — ตรงนี้แค่ไม่โชว์ปุ่มที่กดไปก็ไม่ผ่าน
  if (!canEdit) {
    return (
      <div
        className="flex justify-end pr-2 text-body-3 text-neutral-400"
        title="แก้ไขได้เฉพาะข้อมูลที่ตัวเองบันทึกภายใน 1 วัน หรือโดยผู้ดูแลโรงงาน"
      >
        —
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`แก้ไข ${label}`}
        title="แก้ไข"
        className={clsx(
          ACTION_BUTTON,
          "hover:border-green-200 hover:bg-green-50 hover:text-green-700",
        )}
      >
        <PencilIcon size={14} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`ลบ ${label}`}
        title="ลบ"
        className={clsx(
          ACTION_BUTTON,
          "hover:border-danger/30 hover:bg-danger-light hover:text-danger-dark",
        )}
      >
        <TrashIcon size={14} />
      </button>
    </div>
  );
}
