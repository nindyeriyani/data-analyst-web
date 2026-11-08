"use client";

// Menyembunyikan isi modul yang masih terkunci (ada kuis di modul sebelumnya
// yang belum lulus dengan nilai sempurna). Lihat lib/progress-rules.ts.

import Link from "next/link";
import type { ReactNode } from "react";
import { LockIcon } from "@/components/ProgressBits";
import { useModuleLock } from "@/components/ProgressProvider";
import { getModuleOfItem, moduleNumber } from "@/content/course";
import { quizzesBefore } from "@/lib/progress-rules";

export default function LockGate({ moduleId, children }: { moduleId: string; children: ReactNode }) {
  const { ready, locked, blocking } = useModuleLock(moduleId);
  const mayBeLocked = quizzesBefore(moduleId).length > 0;

  // Modul tanpa syarat (m0) langsung tampil. Modul lain menunggu progres dimuat
  // agar isi tidak sempat terlihat lalu hilang.
  if (mayBeLocked && !ready) {
    return (
      <p aria-busy="true" className="py-10 text-center text-sm text-muted">
        Memuat…
      </p>
    );
  }
  if (!locked) return <>{children}</>;

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-line bg-surface p-6 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-surface-2 text-muted">
        <LockIcon size={22} />
      </span>
      <h1 className="mt-4 text-xl font-bold text-text">Modul ini masih terkunci</h1>
      <p className="mt-2 leading-relaxed text-muted">
        Modul ini terbuka setelah {blocking.length === 1 ? "kuis berikut" : "kuis-kuis berikut"} lulus dengan nilai
        sempurna.
      </p>
      <ul className="mt-4 space-y-2">
        {blocking.map((quiz) => {
          const mod = getModuleOfItem(quiz.id);
          const n = mod ? moduleNumber(mod) : null;
          return (
            <li key={quiz.id}>
              <Link
                href={`/modul/${mod?.id}/${quiz.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover"
              >
                {quiz.title}
                {n !== null && <span className="font-normal opacity-80">· Modul {n}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
