"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getMyFactories } from "./queries";
import { FACTORY_COOKIE } from "./currentFactory";

// จุดเดียวในระบบที่เขียน cookie โรงงาน เกิดเฉพาะตอนผู้ใช้กดสลับเอง
export async function selectFactory(factoryId: string) {
  const factories = await getMyFactories();

  // ปฏิเสธ id ที่ผู้ใช้ไม่ได้สังกัด แทนที่จะเขียนลง cookie แล้วไปกรองทีหลัง
  if (!factories.some((factory) => factory.id === factoryId)) return;

  const cookieStore = await cookies();
  cookieStore.set(FACTORY_COOKIE, factoryId, {
    // มีแต่ server ที่อ่าน cookie นี้ ปิดไม่ให้ JS ฝั่ง client แตะได้เลย
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  // layout + ทุกหน้าใต้มัน ดึงข้อมูลใหม่ตามโรงงานที่เพิ่งเลือก
  revalidatePath("/", "layout");
}
