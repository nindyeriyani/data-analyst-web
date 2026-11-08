import type { ReactNode } from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { ProgressProvider } from "@/components/ProgressProvider";

// Layout semua halaman kursus (perlu login). Halaman /login berada di luar grup ini.
export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider>
      <Header />
      {/* Lebar konten diatur per halaman (mx-auto max-w-…), agar halaman modul bisa memakai sidebar penuh. */}
      <main className="w-full flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-10">{children}</main>
      <BottomNav />
    </ProgressProvider>
  );
}
