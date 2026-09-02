/** ตรึงโซนเวลาไว้ที่ไทย ไม่ให้ผลลัพธ์เพี้ยนตามเครื่อง server หรือเครื่องผู้ใช้ */
export const TZ = "Asia/Bangkok";

/** คำทักทายตามช่วงเวลาของวัน */
export function greetingFor(hour: number) {
  if (hour < 12) return { th: "สวัสดีตอนเช้า", en: "Good morning" };
  if (hour < 18) return { th: "สวัสดีตอนบ่าย", en: "Good afternoon" };
  return { th: "สวัสดีตอนเย็น", en: "Good evening" };
}

/** วันที่ไทยแบบเต็ม เช่น "วันจันทร์ที่ 1 กันยายน 2568" */
export function formatThaiDate(date: Date) {
  const parts = new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("weekday")}ที่ ${get("day")} ${get("month")} ${get("year")}`;
}

/** วันที่ไทยแบบสั้น เช่น "15 เม.ย. 2568" — th-TH ใช้ปฏิทินพุทธเป็นค่าเริ่มต้น */
export function formatThaiShortDate(date: Date | string) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(date));
}

/** ชั่วโมงปัจจุบัน (0–23) ตามเวลาไทย */
export function hourInBangkok(date: Date) {
  return (
    Number(
      date.toLocaleDateString("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: TZ,
      }),
    ) % 24
  );
}
