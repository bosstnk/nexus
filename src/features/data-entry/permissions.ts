// สิทธิ์แก้ไข/ลบ: ใครในโรงงานก็แก้ได้ภายใน 1 วันหลังบันทึก ส่วน admin แก้ได้ตลอด
// (ข้อมูลเป็นของโรงงาน ไม่ใช่ของส่วนตัว เพื่อนกรอกผิดแล้วลาป่วยต้องมีคนแก้แทนได้)
// คำนวณจาก created_at ไม่ต้องเก็บคอลัมน์เพิ่ม — ตรงกับ RLS ที่บังคับไว้ฝั่ง DB
// (ฝั่งนี้มีไว้ซ่อนปุ่มเท่านั้น ตัวที่กันจริงคือ policy)
export const EDIT_WINDOW_HOURS = 24;

const ADMIN_ROLES = ["owner", "admin"];

export const isFactoryAdmin = (role: string) =>
  ADMIN_ROLES.includes(role.toLowerCase());

export function canEditRecord({
  createdAt,
  role,
}: {
  createdAt: string;
  role: string;
}) {
  if (isFactoryAdmin(role)) return true;

  const age = Date.now() - new Date(createdAt).getTime();
  return age < EDIT_WINDOW_HOURS * 60 * 60 * 1000;
}
