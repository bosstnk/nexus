import clsx from "clsx";
import { HandshakeIcon, PencilIcon, TrashIcon } from "@/components/ui/icons";
import { formatTaxId, PARTNER_TYPES, type Partner } from "../data";

const HEAD_CELL =
  "px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.04em] whitespace-nowrap text-neutral-600 uppercase";

const ACTION_BUTTON =
  "grid size-8 cursor-pointer place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-500 transition-colors";

export default function PartnersTable({
  partners,
  onEdit,
  onDelete,
}: {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
}) {
  if (partners.length === 0) {
    return (
      <div className="grid place-items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
        <HandshakeIcon size={32} className="text-neutral-400" />
        <div>
          <p className="text-body-2 text-neutral-600">ไม่พบคู่ค้า</p>
          <p className="text-body-3 text-neutral-500">
            No partners match your filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-300 bg-neutral-50">
            <th className={HEAD_CELL}>ชื่อบริษัท</th>
            <th className={HEAD_CELL}>ประเภท</th>
            <th className={HEAD_CELL}>เลขผู้เสียภาษี</th>
            <th className={clsx(HEAD_CELL, "w-24 text-right")}>
              <span className="sr-only">จัดการ</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner, i) => {
            const type = PARTNER_TYPES[partner.type];
            const TypeIcon = type.icon;
            return (
              <tr
                key={partner.id}
                className={clsx(
                  "transition-colors hover:bg-neutral-50",
                  i < partners.length - 1 && "border-b border-neutral-100",
                )}
              >
                <td className="px-4 py-3 text-body-2 font-medium text-neutral-900">
                  {partner.name}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-body-3 font-semibold whitespace-nowrap",
                      type.chip,
                    )}
                  >
                    <TypeIcon size={12} />
                    {type.th}
                  </span>
                </td>
                <td className="px-4 py-3 font-eng text-body-2 tabular-nums text-neutral-700">
                  {formatTaxId(partner.taxId)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(partner)}
                      aria-label={`แก้ไข ${partner.name}`}
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
                      onClick={() => onDelete(partner)}
                      aria-label={`ลบ ${partner.name}`}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
