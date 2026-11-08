import Link from "next/link";
import { Suspense } from "react";
import Logo from "./Logo";
import { NavLinks, NavList } from "./NavLinks";

// Sementara ditulis tetap. Nama pengguna diambil dari Supabase di tahap 8.
const USER_INITIAL = "N";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-text"
        >
          <Logo />
          <span>Kursus Data Analyst</span>
        </Link>

        <nav aria-label="Navigasi utama" className="ml-auto hidden md:block">
          <Suspense fallback={<NavList variant="top" pathname={null} />}>
            <NavLinks variant="top" />
          </Suspense>
        </nav>

        <span
          className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary md:ml-2"
          title="Profil"
        >
          {USER_INITIAL}
        </span>
      </div>
    </header>
  );
}
