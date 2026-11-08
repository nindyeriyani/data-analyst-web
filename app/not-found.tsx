import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = { title: "Halaman tidak ditemukan" };

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center">
          <Logo size={40} />
        </div>
        <p className="mt-6 text-sm font-semibold text-muted">404</p>
        <h1 className="mt-1 text-2xl font-bold text-text">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-muted">Alamatnya mungkin salah ketik, atau modul dan item ini tidak ada di kursus.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover"
        >
          Kembali ke dashboard
        </Link>
      </div>
    </main>
  );
}
