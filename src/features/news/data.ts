import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";
import {
  FactoryIcon,
  LeafIcon,
  MegaphoneIcon,
  NewspaperIcon,
  ShieldAlertIcon,
  type IconProps,
} from "@/components/ui/icons";
import aerial1 from "../../../public/images/Picture_01.png";
import aerial2 from "../../../public/images/Picture_03.png";
import factorySafety from "../../../public/images/Picture_08.png";
import interiorSorting from "../../../public/images/Picture_09.png";
import truckContainer from "../../../public/images/Picture_11.png";
import teamHeart from "../../../public/images/Picture_13.png";

export type Priority = "urgent" | "high" | "normal" | "info";

export type NewsItem = {
  id: number;
  date: string;
  title: string;
  titleEn: string;
  summary: string;
  priority: Priority;
  category: string;
  author: string;
  img: StaticImageData | null;
  pinned: boolean;
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    date: "2025-04-27",
    title: "ประกาศวันหยุดพิเศษเดือนพฤษภาคม 2568",
    titleEn: "Special Holiday Announcement – May 2025",
    summary:
      "บริษัทประกาศวันหยุดพิเศษเพิ่มเติมในวันที่ 1–2 พฤษภาคม เนื่องในวันแรงงานแห่งชาติ ขอให้พนักงานทุกท่านรับทราบและเตรียมตัวให้พร้อม",
    priority: "high",
    category: "ประกาศ",
    author: "ฝ่ายบุคคล / HR",
    img: aerial2,
    pinned: true,
  },
  {
    id: 2,
    date: "2025-04-25",
    title: "ซ้อมแผนอพยพฉุกเฉินประจำปี 2568",
    titleEn: "Annual Emergency Evacuation Drill 2025",
    summary:
      "จะมีการซ้อมแผนอพยพฉุกเฉินในวันที่ 5 พฤษภาคม เวลา 10:00 น. ขอให้พนักงานทุกคนให้ความร่วมมือและปฏิบัติตามขั้นตอนที่กำหนด",
    priority: "urgent",
    category: "ความปลอดภัย",
    author: "ฝ่ายความปลอดภัย / Safety",
    img: factorySafety,
    pinned: false,
  },
  {
    id: 7,
    date: "2025-04-24",
    title: "ปรับปรุงมาตรฐานอุปกรณ์ป้องกัน PPE",
    titleEn: "Updated PPE Safety Standards",
    summary:
      "อุปกรณ์ป้องกันส่วนบุคคลชุดใหม่จะเริ่มแจกให้พนักงานหน้างานตั้งแต่ 1 พฤษภาคม พนักงานทุกคนต้องสวมใส่ตลอดเวลาที่อยู่ในพื้นที่การผลิต",
    priority: "urgent",
    category: "ความปลอดภัย",
    author: "ฝ่ายความปลอดภัย / Safety",
    img: null,
    pinned: false,
  },
  {
    id: 8,
    date: "2025-04-23",
    title: "เปิดตัวระบบจัดการภายในใหม่",
    titleEn: "New Internal Management System Launch",
    summary:
      "ระบบพอร์ทัลภายในใหม่พร้อมใช้งานแล้ว พนักงานสามารถดูข่าวสาร บันทึกข้อมูลรายเดือน และตรวจสอบรายงานได้จากที่เดียว",
    priority: "high",
    category: "ประกาศ",
    author: "ฝ่ายไอที / IT",
    img: aerial1,
    pinned: true,
  },
  {
    id: 3,
    date: "2025-04-22",
    title: "ผลการประเมินผลประจำไตรมาส Q1/2568",
    titleEn: "Q1/2025 Performance Review Results",
    summary:
      "ผลการประเมินประจำไตรมาสที่ 1 ได้รับการอนุมัติแล้ว พนักงานสามารถตรวจสอบผลประเมินของตนเองได้ผ่านระบบ HR ออนไลน์",
    priority: "normal",
    category: "ประกาศ",
    author: "ฝ่ายบุคคล / HR",
    img: null,
    pinned: false,
  },
  {
    id: 4,
    date: "2025-04-20",
    title: "อัปเดตระบบคัดแยกวัสดุสายการผลิต B",
    titleEn: "Material Sorting System Update – Line B",
    summary:
      "ระบบคัดแยกวัสดุสายการผลิต B ได้รับการอัปเกรดเพื่อเพิ่มประสิทธิภาพ 15% คาดว่าจะใช้งานได้เต็มรูปแบบตั้งแต่วันที่ 1 พฤษภาคม",
    priority: "normal",
    category: "การดำเนินงาน",
    author: "ฝ่ายวิศวกรรม / Engineering",
    img: interiorSorting,
    pinned: true,
  },
  {
    id: 5,
    date: "2025-04-18",
    title: "โครงการรีไซเคิลชุมชนรอบโรงงาน",
    titleEn: "Community Recycling Initiative",
    summary:
      "TST & BTK ร่วมกับชุมชนโดยรอบเปิดตัวโครงการรับซื้อวัสดุรีไซเคิลจากครัวเรือน เพื่อส่งเสริมเศรษฐกิจหมุนเวียนในท้องถิ่น",
    priority: "info",
    category: "สิ่งแวดล้อม",
    author: "ฝ่ายสิ่งแวดล้อม / Environment",
    img: null,
    pinned: false,
  },
  {
    id: 9,
    date: "2025-04-16",
    title: "ขยายเส้นทางการส่งออกไปยังญี่ปุ่น",
    titleEn: "Export Route Expansion to Japan",
    summary:
      "เริ่มเดินเรือเส้นทางใหม่ไปท่าเรือโยโกฮามา เดือนละ 2 เที่ยว รองรับการส่งออกเศษโลหะคุณภาพสูงเพิ่มขึ้นราว 30%",
    priority: "normal",
    category: "การดำเนินงาน",
    author: "ฝ่ายโลจิสติกส์ / Logistics",
    img: truckContainer,
    pinned: true,
  },
  {
    id: 6,
    date: "2025-04-15",
    title: "เปิดรับสมัครพนักงานตำแหน่งผู้ควบคุมสาย",
    titleEn: "Job Opening: Line Supervisor",
    summary:
      "บริษัทเปิดรับสมัครพนักงานตำแหน่งผู้ควบคุมสายการผลิต 2 อัตรา สนใจสมัครได้ที่ฝ่ายบุคคลภายในวันที่ 10 พฤษภาคม 2568",
    priority: "info",
    category: "ประกาศ",
    author: "ฝ่ายบุคคล / HR",
    img: null,
    pinned: false,
  },
  {
    id: 10,
    date: "2025-04-10",
    title: "ภาพความทรงจำ: วันพนักงาน TST & BTK",
    titleEn: "Memory: TST & BTK Employee Day",
    summary:
      "ขอบคุณพนักงานทุกท่านที่ร่วมงานวันพนักงานประจำปี ชมภาพบรรยากาศทั้งหมดได้ที่อัลบั้มภายในองค์กร",
    priority: "info",
    category: "ประกาศ",
    author: "ฝ่ายบุคคล / HR",
    img: teamHeart,
    pinned: true,
  },
];

export const PRIORITY_BADGE =
  "rounded-full px-2 py-1 text-body-3 font-semibold text-white";

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; labelEn: string; badge: string }
> = {
  urgent: {
    label: "เร่งด่วน",
    labelEn: "Urgent",
    badge: "bg-warning-dark",
  },
  high: {
    label: "สำคัญ",
    labelEn: "High",
    badge: "bg-danger-dark",
  },
  normal: {
    label: "ปกติ",
    labelEn: "Normal",
    badge: "bg-green-600",
  },
  info: {
    label: "ข้อมูล",
    labelEn: "Info",
    badge: "bg-blue-500",
  },
};

type CategoryMeta = {
  icon: ComponentType<IconProps>;
  solid: string;
  chip: string;
  panel: string;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  ประกาศ: {
    icon: MegaphoneIcon,
    solid: "bg-green-600",
    chip: "bg-green-600/10 text-green-600",
    panel: "bg-linear-to-br from-green-600/15 to-green-600/5 text-green-600",
  },
  ความปลอดภัย: {
    icon: ShieldAlertIcon,
    solid: "bg-danger-dark",
    chip: "bg-danger-dark/10 text-danger-dark",
    panel:
      "bg-linear-to-br from-danger-dark/15 to-danger-dark/5 text-danger-dark",
  },
  การดำเนินงาน: {
    icon: FactoryIcon,
    solid: "bg-blue-500",
    chip: "bg-blue-500/10 text-blue-500",
    panel: "bg-linear-to-br from-blue-500/15 to-blue-500/5 text-blue-500",
  },
  สิ่งแวดล้อม: {
    icon: LeafIcon,
    solid: "bg-green-500",
    chip: "bg-green-500/10 text-green-500",
    panel: "bg-linear-to-br from-green-500/15 to-green-500/5 text-green-500",
  },
};

const FALLBACK_CATEGORY: CategoryMeta = {
  icon: NewspaperIcon,
  solid: "bg-green-500",
  chip: "bg-green-500/10 text-green-500",
  panel: "bg-linear-to-br from-green-500/15 to-green-500/5 text-green-500",
};

export const catMeta = (category: string): CategoryMeta =>
  CATEGORY_META[category] ?? FALLBACK_CATEGORY;

export const sortNews = (list: NewsItem[]): NewsItem[] =>
  [...list].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
