export const VIEW_META = {
  home: { titleTh: "หน้าหลัก", titleEn: "Home" },
  news: { titleTh: "ข่าวสารและประกาศ", titleEn: "News & Announcements" },
  dashboard: { titleTh: "ภาพรวมการผลิต", titleEn: "Production Overview" },
  records: { titleTh: "บันทึกข้อมูล", titleEn: "Data Entry" },
  partners: { titleTh: "ทะเบียนคู่ค้า", titleEn: "Trading Partners" },
  settings: { titleTh: "ตั้งค่าระบบ", titleEn: "Settings" },
} as const;

export type ViewId = keyof typeof VIEW_META;
