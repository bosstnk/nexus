export type FactoryTheme = {
  solid: string;
  soft: string;
  softBorder: string;
  rail: string;
  accent: string;
  chip: string;
};

// คลาสของ theme ถูกกางแบนไว้ในตัว Factory เลย เพื่อให้ component เรียก
// factory.solid ได้ตรง ๆ เหมือนตอนที่ยังเป็นข้อมูล static
export type Factory = FactoryTheme & {
  id: string;
  code: string;
  name: string;
  location: string | null;
  role: string;
};
