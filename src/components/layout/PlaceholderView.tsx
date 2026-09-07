import { ConstructionIcon } from "@/components/ui/icons";

type PlaceholderViewProps = {
  titleTh: string;
  titleEn: string;
};

export default function PlaceholderView({
  titleTh,
  titleEn,
}: PlaceholderViewProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <ConstructionIcon size={40} className="text-neutral-400" />
      <p className="text-h5 font-medium text-neutral-600">{titleTh}</p>
      <p className="text-body-2 text-neutral-500">{titleEn} — coming soon</p>
    </div>
  );
}
