import type { FactoryTheme } from "./types";

// Tailwind หาคลาสด้วยการสแกน source ตอน build คลาสพวกนี้จึงต้องเป็น literal
// ที่เขียนอยู่ในไฟล์ .ts ห้ามเก็บสตริงคลาสไว้ใน database แล้วอ่านมาใช้
// เพราะ Tailwind จะไม่เห็น แล้ว purge ทิ้ง สีจะหายเงียบ ๆ โดยไม่มี error
const THEMES = {
  green: {
    solid: "bg-green-400",
    soft: "bg-green-50",
    softBorder: "border-green-200",
    rail: "border-l-green-400",
    accent: "text-green-500",
    chip: "bg-green-50 text-green-700 border-green-200",
  },
  blue: {
    solid: "bg-blue-400",
    soft: "bg-blue-50",
    softBorder: "border-blue-200",
    rail: "border-l-blue-400",
    accent: "text-blue-500",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
  },
  amber: {
    solid: "bg-amber-400",
    soft: "bg-amber-50",
    softBorder: "border-amber-200",
    rail: "border-l-amber-400",
    accent: "text-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
  },
  violet: {
    solid: "bg-violet-400",
    soft: "bg-violet-50",
    softBorder: "border-violet-200",
    rail: "border-l-violet-400",
    accent: "text-violet-500",
    chip: "bg-violet-50 text-violet-700 border-violet-200",
  },
} satisfies Record<string, FactoryTheme>;

type ThemeKey = keyof typeof THEMES;

// สีประจำโรงงานที่มีอยู่แล้ว ล็อกไว้ให้ตรงกับที่ผู้ใช้คุ้นตา
const PINNED: Record<string, ThemeKey> = {
  TST: "green",
  BTK: "blue",
};

const ROTATION: ThemeKey[] = ["green", "blue", "amber", "violet"];

// โรงงานที่เพิ่มเข้ามาใหม่ใน DB ยังได้สีของตัวเองโดยไม่ต้องแก้โค้ด
export function themeFor(shortName: string | null, index: number): FactoryTheme {
  const pinned = shortName ? PINNED[shortName.toUpperCase()] : undefined;
  return THEMES[pinned ?? ROTATION[index % ROTATION.length]];
}
