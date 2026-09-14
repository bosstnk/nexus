export const VIEW_META = {
  home: { titleTh: "หน้าหลัก", titleEn: "Home" },
  dashboard: { titleTh: "ภาพรวมการผลิต", titleEn: "Production Overview" },
  records: { titleTh: "บันทึกข้อมูล", titleEn: "Data Entry" },
  partners: { titleTh: "ทะเบียนคู่ค้า", titleEn: "Trading Partners" },
  access: { titleTh: "สิทธิ์ของฉัน", titleEn: "My Access" },
  permissions: { titleTh: "จัดการสิทธิ์", titleEn: "Access Management" },
} as const;

export type ViewId = keyof typeof VIEW_META;
