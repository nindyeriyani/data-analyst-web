"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavIcon from "./NavIcon";
import { NAV_ITEMS, isActivePath } from "./nav-items";

type Variant = "top" | "bottom";

/**
 * Daftar tautan navigasi. `pathname` null dipakai sebagai fallback Suspense
 * (tanpa penanda halaman aktif), karena dengan cacheComponents `usePathname`
 * bisa menunda render di rute dinamis.
 */
export function NavList({
  variant,
  pathname,
}: {
  variant: Variant;
  pathname: string | null;
}) {
  return (
    <ul className={variant === "top" ? "flex items-center gap-1" : "grid grid-cols-4"}>
      {NAV_ITEMS.map((item) => {
        const active = pathname !== null && isActivePath(pathname, item.href);
        const className =
          variant === "top"
            ? `block rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors ${
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              }`
            : `flex flex-col items-center gap-1 py-2 text-xs font-medium ${
                active ? "text-primary" : "text-muted hover:text-text"
              }`;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={className}
            >
              {variant === "bottom" && <NavIcon name={item.icon} />}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function NavLinks({ variant }: { variant: Variant }) {
  const pathname = usePathname();
  return <NavList variant={variant} pathname={pathname} />;
}
