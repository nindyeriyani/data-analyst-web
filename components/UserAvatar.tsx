"use client";

import Link from "next/link";
import { useState } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { initialOf } from "@/lib/user";

/** Foto profil (dari akun Google) atau inisial nama, menuju halaman pengaturan. */
export default function UserAvatar() {
  const { displayName, avatarUrl } = useProgress();
  const [failed, setFailed] = useState<string | null>(null);
  const showPhoto = avatarUrl !== null && failed !== avatarUrl;

  return (
    <Link
      href="/pengaturan"
      title={`${displayName} · Pengaturan`}
      className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-on-primary hover:bg-primary-hover md:ml-2"
    >
      {showPhoto ? (
        // Foto kecil dari Google; next/image tidak diperlukan untuk gambar 32px dari domain luar.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          width={36}
          height={36}
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setFailed(avatarUrl)}
        />
      ) : (
        <span aria-hidden="true">{initialOf(displayName)}</span>
      )}
      <span className="sr-only">Pengaturan akun {displayName}</span>
    </Link>
  );
}
