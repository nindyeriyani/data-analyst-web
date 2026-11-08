export type NavIcon = "dashboard" | "calendar" | "book" | "link";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/jadwal", label: "Jadwal", icon: "calendar" },
  { href: "/glosarium", label: "Glosarium", icon: "book" },
  { href: "/sumber", label: "Sumber", icon: "link" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/modul");
  return pathname === href || pathname.startsWith(`${href}/`);
}
