import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "@/components/UserAvatar";
import Logo from "./Logo";
import { NavLinks, NavList } from "./NavLinks";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="-my-2 flex items-center gap-2 py-2 font-semibold text-text"
        >
          <Logo />
          <span>Kursus Data Analyst</span>
        </Link>

        <nav aria-label="Navigasi utama" className="ml-auto hidden md:block">
          <Suspense fallback={<NavList variant="top" pathname={null} />}>
            <NavLinks variant="top" />
          </Suspense>
        </nav>

        <UserAvatar />
      </div>
    </header>
  );
}
