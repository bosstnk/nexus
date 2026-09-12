import clsx from "clsx";
import { formatThaiMonthYear, formatThaiShortDate } from "@/lib/datetime";
import RowActions from "./RowActions";
import type { EntryRecord } from "../types";
import { formatMetric, metricHeader, type EntrySchema } from "../schemas";

const HEAD_CELL =
  "px-4 py-3 text-left text-body-3 font-semibold truncate text-neutral-600";

const CELL = "px-4 py-3 text-left text-body-2 truncate text-neutral-900";

const NUMERIC_CELL = `${CELL} font-eng tabular-nums`;

const ACTIONS_WIDTH = 104;

const columnWidth = (weight: number, total: number) =>
  `calc((100% - ${ACTIONS_WIDTH}px) * ${weight} / ${total})`;


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

              <td className={CELL}>{record.createdBy}</td>
              <td className={NUMERIC_CELL}>
                {formatThaiShortDate(record.createdAt)}
              </td>

              <td className="px-4 py-3">
                <RowActions
                  label={`ข้อมูลเดือน ${formatThaiMonthYear(record.year, record.month)}`}
                  canEdit={record.canEdit}
                  onEdit={() => onEdit(record)}
                  onDelete={() => onDelete(record)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
