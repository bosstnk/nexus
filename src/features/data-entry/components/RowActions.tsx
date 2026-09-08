import clsx from "clsx";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { ACTION_BUTTON } from "./tableStyles";

export default function RowActions({
  label,
  onEdit,
  onDelete,
}: {
  label: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
