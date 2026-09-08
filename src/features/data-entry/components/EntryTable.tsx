import clsx from "clsx";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { formatThaiMonthYear, formatThaiShortDate } from "@/lib/datetime";
import type { EntryRecord } from "../data";
import { formatMetric, metricHeader, type EntrySchema } from "../schemas";

const HEAD_CELL =
  "px-4 py-3 text-left text-body-3 font-semibold truncate text-neutral-600";

const CELL = "px-4 py-3 text-left text-body-2 truncate text-neutral-900";

const NUMERIC_CELL = `${CELL} font-eng tabular-nums`;

const ACTIONS_WIDTH = 104;

const columnWidth = (weight: number, total: number) =>
  `calc((100% - ${ACTIONS_WIDTH}px) * ${weight} / ${total})`;

const ACTION_BUTTON =
  "grid size-8 cursor-pointer place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-500 transition-colors";

export default function EntryTable({
  schema,
  records,
  onEdit,
  onDelete,
}: {
  schema: EntrySchema;
  records: EntryRecord[];
  onEdit: (record: EntryRecord) => void;
  onDelete: (record: EntryRecord) => void;
}) {
  const weights = [2, ...schema.metrics.map(() => 1), 2, 2];
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white">
      <table className="w-full min-w-180 table-fixed border-collapse">
        <colgroup>
          {weights.map((weight, i) => (
            <col key={i} style={{ width: columnWidth(weight, totalWeight) }} />
          ))}
          <col style={{ width: `${ACTIONS_WIDTH}px` }} />
        </colgroup>

        <thead>
          <tr className="border-b border-neutral-300 bg-neutral-50">
            <th className={HEAD_CELL}>เดือน</th>
            {schema.metrics.map((metric) => (
              <th key={metric.key} className={HEAD_CELL}>
                {metricHeader(metric)}
              </th>
            ))}
            <th className={HEAD_CELL}>บันทึกโดย</th>
            <th className={HEAD_CELL}>วันที่บันทึก</th>
            <th className={HEAD_CELL}>
              <span className="sr-only">จัดการ</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, i) => (
            <tr
              key={record.id}
              className={clsx(
                "transition-colors hover:bg-neutral-50",
                i < records.length - 1 && "border-b border-neutral-100",
              )}
            >
              <td className={clsx(CELL, "font-medium")}>
                {formatThaiMonthYear(record.year, record.month)}
              </td>

              {schema.metrics.map((metric) => (
                <td key={metric.key} className={NUMERIC_CELL}>
                  {formatMetric(metric, record.values[metric.key] ?? 0)}
                </td>
              ))}

              <td className={CELL}>{record.submittedBy}</td>
              <td className={NUMERIC_CELL}>
                {formatThaiShortDate(record.submittedAt)}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(record)}
                    aria-label={`แก้ไขข้อมูลเดือน ${formatThaiMonthYear(record.year, record.month)}`}
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
                    onClick={() => onDelete(record)}
                    aria-label={`ลบข้อมูลเดือน ${formatThaiMonthYear(record.year, record.month)}`}
                    title="ลบ"
                    className={clsx(
                      ACTION_BUTTON,
                      "hover:border-danger/30 hover:bg-danger-light hover:text-danger-dark",
                    )}
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
