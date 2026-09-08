import clsx from "clsx";
import { formatThaiShortDate } from "@/lib/datetime";
import RowActions from "./RowActions";
import {
  ACTIONS_WIDTH,
  CELL,
  columnWidth,
  HEAD_CELL,
  NUMERIC_CELL,
  sumWeights,
} from "./tableStyles";
import { SALE_TYPES, type SaleRecord } from "../sales";

const WEIGHTS = [1, 1, 3, 2, 1, 1, 1];
const TOTAL_WEIGHT = sumWeights(WEIGHTS);

export default function SalesTable({
  records,
  onEdit,
  onDelete,
}: {
  records: SaleRecord[];
  onEdit: (record: SaleRecord) => void;
  onDelete: (record: SaleRecord) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white">
      <table className="w-full min-w-240 table-fixed border-collapse">
        <colgroup>
          {WEIGHTS.map((weight, i) => (
            <col key={i} style={{ width: columnWidth(weight, TOTAL_WEIGHT) }} />
          ))}
          <col style={{ width: `${ACTIONS_WIDTH}px` }} />
        </colgroup>

        <thead>
          <tr className="border-b border-neutral-300 bg-neutral-50">
            <th className={HEAD_CELL}>ประเภท</th>
            <th className={HEAD_CELL}>วันที่</th>
            <th className={HEAD_CELL}>คู่ค้า</th>
            <th className={HEAD_CELL}>วัสดุ</th>
            <th className={HEAD_CELL}>น้ำหนักรวม (ตัน)</th>
            <th className={HEAD_CELL}>จำนวนเงิน (฿)</th>
            <th className={HEAD_CELL}>บันทึกโดย</th>
            <th className={HEAD_CELL}>
              <span className="sr-only">จัดการ</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {records.map((record, i) => {
            const type = SALE_TYPES[record.type];
            const TypeIcon = type.icon;
            const shown = record.materials.slice(0, 2);
            const rest = record.materials.length - shown.length;

            return (
              <tr
                key={record.id}
                className={clsx(
                  "transition-colors hover:bg-neutral-50",
                  i < records.length - 1 && "border-b border-neutral-100",
                )}
              >
                <td className={CELL}>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-body-3 font-semibold",
                      type.chip,
                    )}
                  >
                    <TypeIcon size={12} />
                    {type.th}
                  </span>
                </td>

                <td className={NUMERIC_CELL}>
                  {formatThaiShortDate(record.date)}
                </td>
                <td className={CELL} title={record.partner}>
                  {record.partner}
                </td>

                <td className={clsx(CELL, "overflow-hidden")}>
                  <span className="flex items-center gap-1">
                    {shown.map((material) => (
                      <span
                        key={material}
                        className="truncate rounded-full bg-neutral-100 px-2 py-0.5 text-body-3 text-neutral-600"
                      >
                        {material}
                      </span>
                    ))}
                    {rest > 0 && (
                      <span className="shrink-0 text-body-3 text-neutral-500">
                        +{rest}
                      </span>
                    )}
                  </span>
                </td>

                <td className={NUMERIC_CELL}>{record.weight.toFixed(1)}</td>
                <td className={NUMERIC_CELL}>
                  ฿{record.amount.toLocaleString("en-US")}
                </td>
                <td className={CELL}>{record.submittedBy}</td>

                <td className="px-4 py-3">
                  <RowActions
                    label={`${type.th} ${record.partner}`}
                    onEdit={() => onEdit(record)}
                    onDelete={() => onDelete(record)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
