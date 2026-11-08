"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { initialOf } from "@/lib/user";

/** Inisial nama pengguna di header, menuju halaman pengaturan. */
export default function UserAvatar() {
  const { displayName } = useProgress();
  return (
    <Link
      href="/pengaturan"
      title={`${displayName} · Pengaturan`}
      className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary hover:bg-primary-hover md:ml-2"
    >
      <span aria-hidden="true">{initialOf(displayName)}</span>
      <span className="sr-only">Pengaturan akun {displayName}</span>
    </Link>
  );
}
