import TopBar from "@/components/layout/TopBar";
import { VIEW_META } from "@/components/layout/viewMeta";
import { requireUser } from "@/features/auth/currentUser";
import GreetingBanner from "@/features/home/components/GreetingBanner";
import Carousel from "@/features/news/components/Carousel";
import NewsSection from "@/features/news/components/NewsSection";
import { getNews } from "@/features/news/queries";

export default async function HomePage() {
  const [{ fullName }, news] = await Promise.all([requireUser(), getNews()]);

  return (
    <>
      <TopBar titleTh={VIEW_META.home.titleTh} />

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
        <GreetingBanner name={fullName} />
        <Carousel news={news} />
        <NewsSection news={news} />
      </div>
    </>
  );
}
