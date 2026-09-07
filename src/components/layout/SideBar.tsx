import Image from "next/image";
import clsx from "clsx";
import logo from "../../../public/images/Logo.png";
import {
  HomeIcon,
  NewspaperIcon,
  LayoutDashboardIcon,
  ClipboardListIcon,
  HandshakeIcon,
  SettingsIcon,
} from "@/components/ui/icons";
import SignOutButton from "@/features/auth/components/SignOutButton";

const MENU = [
  { id: "home", icon: HomeIcon, label: "หน้าหลัก", href: "/" },
  { id: "news", icon: NewspaperIcon, label: "ข่าวสาร", href: "/news" },
  {
    id: "dashboard",
    icon: LayoutDashboardIcon,
    label: "ภาพรวม",
    href: "/dashboard",
  },
  {
    id: "records",
    icon: ClipboardListIcon,
    label: "บันทึกข้อมูล",
    href: "/records",
  },
  { id: "partners", icon: HandshakeIcon, label: "คู่ค้า", href: "/partners" },
  { id: "settings", icon: SettingsIcon, label: "ตั้งค่า", href: "/settings" },
];

type SideBarProps = {
  name?: string;
  role?: string;
  /** id ของเมนูที่กำลังเปิดอยู่ */
  active?: string;
};

export default function SideBar({
  name = "User",
  role = "Member",
  active = "home",
}: SideBarProps) {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r-[0.5px] border-neutral-300 bg-white">
      <div className="flex flex-col gap-1 border-b border-neutral-300 px-4 pt-5 pb-4">
        <Image src={logo} alt="Nexus" priority className="h-auto w-38" />
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {MENU.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <a
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                isActive ? "bg-green-50" : "hover:bg-neutral-50",
              )}
            >
              <Icon
                size={24}
                className={clsx(
                  "pointer-events-none shrink-0",
                  isActive ? "text-green-500" : "text-neutral-500",
                )}
              />
              <span
                className={clsx(
                  "text-body-1 font-medium leading-0",
                  isActive ? "text-green-700" : "text-neutral-900",
                )}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 border-t border-neutral-300 px-4 py-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-green-400 text-body-2 font-semibold text-green-800">
          {name.trim().charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-body-2 font-medium text-neutral-900">
            {name}
          </div>
          <div className="text-body-3 text-neutral-500">{role}</div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
