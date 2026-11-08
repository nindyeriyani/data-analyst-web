"use client";

// Batas galat untuk halaman kursus. Header dan navigasi tetap tampil.

import Link from "next/link";
import { useEffect } from "react";

export default function CourseError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <h1 className="text-2xl font-bold text-text">Terjadi kesalahan</h1>
      <p className="mt-2 text-muted">
        Halaman ini gagal dimuat. Periksa koneksi lalu coba lagi. Progres Anda yang sudah tersimpan tetap aman.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover"
        >
          Coba lagi
        </button>
        <Link
          href="/"
          className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-text hover:border-primary hover:text-primary"
        >
          Ke dashboard
        </Link>
      </div>
    </div>
  );
}
