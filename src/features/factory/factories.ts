/* ── Factory mockup data ──────────────────────────────────────
   ยังไม่มี API โรงงานจริง ชุดนี้ใช้ประกอบ UI ไปก่อน
   สีเก็บเป็นคลาส Tailwind ตรง ๆ เพื่อให้ scanner เห็นตอน build
──────────────────────────────────────────────────────────────*/

export type Factory = {
  id: string;
  /** ตัวย่อบนป้ายสี่เหลี่ยมสีเข้ม */
  code: string;
  nameTh: string;
  nameEn: string;
  /** ที่ตั้ง — บรรทัดเล็กใต้ชื่อในเมนูเลือกโรงงาน */
  location: string;
  /** ป้ายโค้ดสีเข้ม + จุดนำหน้าชื่อ */
  solid: string;
  /** พื้นอ่อนของแถวที่เลือกอยู่ / ปุ่มตอนเปิดเมนู */
  soft: string;
  /** เส้นขอบปุ่มตอนเปิดเมนู */
  softBorder: string;
  /** แถบซ้ายของแถวที่เลือกอยู่ */
  rail: string;
  /** เครื่องหมายถูกท้ายแถว */
  accent: string;
  /** ชุดสีของ chip: พื้น + ตัวอักษร + เส้นขอบ */
  chip: string;
};

export const FACTORIES: Factory[] = [
  {
    id: "tst",
    code: "TST",
    nameTh: "โรงงาน TST",
    nameEn: "TST Factory",
    location: "สมุทรสาคร",
    solid: "bg-green-400",
    soft: "bg-green-50",
    softBorder: "border-green-200",
    rail: "border-l-green-400",
    accent: "text-green-500",
    chip: "bg-green-50 text-green-700 border-green-200",
  },
  {
    id: "btk",
    code: "BTK",
    nameTh: "โรงงาน BTK",
    nameEn: "BTK Factory",
    location: "ชลบุรี",
    solid: "bg-blue-400",
    soft: "bg-blue-50",
    softBorder: "border-blue-200",
    rail: "border-l-blue-400",
    accent: "text-blue-500",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
  },
];

export const DEFAULT_FACTORY_ID = FACTORIES[0].id;

export function factoryById(id: string): Factory {
  return FACTORIES.find((factory) => factory.id === id) ?? FACTORIES[0];
}
