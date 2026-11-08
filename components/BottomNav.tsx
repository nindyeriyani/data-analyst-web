import { Suspense } from "react";
import { NavLinks, NavList } from "./NavLinks";

export default function BottomNav() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <Suspense fallback={<NavList variant="bottom" pathname={null} />}>
        <NavLinks variant="bottom" />
      </Suspense>
    </nav>
  );
}
