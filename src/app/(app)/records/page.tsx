import PlaceholderView from "@/components/layout/PlaceholderView";
import TopBar from "@/components/layout/TopBar";
import { VIEW_META } from "@/components/layout/viewMeta";

const meta = VIEW_META.records;

export default function RecordsPage() {
  return (
    <>
      <TopBar titleTh={meta.titleTh} />
      <PlaceholderView titleTh={meta.titleTh} titleEn={meta.titleEn} />
    </>
  );
}
