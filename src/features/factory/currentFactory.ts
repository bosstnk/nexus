import { cache } from "react";
import { cookies } from "next/headers";
import { getMyFactories } from "./queries";
import type { Factory } from "./types";

export const FACTORY_COOKIE = "nexus-factory";

// โรงงานที่กำลังดูอยู่ตอนนี้ — อ่านอย่างเดียว ไม่เขียน
// (Server Component เขียน cookie ไม่ได้ การเขียนอยู่ใน actions.ts เท่านั้น)
//
// cookie มาจาก browser จึงเชื่อไม่ได้: ค่าที่อ่านได้ต้องอยู่ใน getMyFactories()
// เท่านั้นถึงจะถูกใช้ ไม่งั้นตกไปที่โรงงานแรกที่ผู้ใช้สังกัดจริง
export const getCurrentFactory = cache(async (): Promise<Factory | null> => {
  const [factories, cookieStore] = await Promise.all([
    getMyFactories(),
    cookies(),
  ]);

  const saved = cookieStore.get(FACTORY_COOKIE)?.value;

  return factories.find((factory) => factory.id === saved) ?? factories[0] ?? null;
});
