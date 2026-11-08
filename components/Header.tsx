import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "@/components/UserAvatar";
import { HeaderSubtitle, SyncStatus } from "./HeaderStatus";
import Logo from "./Logo";
import { NavLinks, NavList } from "./NavLinks";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="-my-2 flex min-w-0 items-center gap-3 py-2 text-text">
          <Logo size={36} />
          <span className="min-w-0">
            <span className="block font-semibold leading-tight">Data Analyst</span>
            <span className="block truncate text-xs text-muted">
              <HeaderSubtitle />
            </span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="ml-auto hidden md:block">
          <Suspense fallback={<NavList variant="top" pathname={null} />}>
            <NavLinks variant="top" />
          </Suspense>
        </nav>

        <div className="ml-auto flex items-center gap-4 md:ml-2">
          <SyncStatus />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
