export type Factory = {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
  location: string;
  solid: string;
  soft: string;
  softBorder: string;
  rail: string;
  accent: string;
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
