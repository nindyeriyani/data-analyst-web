"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { MODULES, getModuleOfItem, moduleNumber } from "@/content/course";
import { nextDueItem } from "@/lib/progress-rules";
import { COURSE_START, EXTRA_WEEK, currentWeek, daysUntil, formatLong } from "@/lib/schedule";
import { DISPLAY_NAME } from "@/lib/user";

function subtitle(today: string | null): string {
  if (today === null) return "Kursus 12 minggu, 9 November 2026 sampai 31 Januari 2027.";

  const week = currentWeek(today);
  if (week === 0) {
    const days = daysUntil(COURSE_START, today);
    const when = days === 1 ? "besok" : `${days} hari lagi`;
    return `Kursus dimulai ${formatLong(COURSE_START)}, ${when}.`;
  }
  if (week === EXTRA_WEEK) return "Minggu ekstra · Serah terima magang.";
  if (week > EXTRA_WEEK) return "Kursus selesai. Selamat atas kerja kerasnya!";

  const mod = MODULES.find((m) => m.weeks[0] <= week && week <= m.weeks[1]);
  const n = mod ? moduleNumber(mod) : null;
  const moduleLabel = mod ? ` · ${n === null ? "" : `Modul ${n}: `}${mod.title}` : "";
  return `Minggu ${week} dari 12${moduleLabel}.`;
}

export default function Greeting() {
  const { completed, today } = useProgress();
  const next = nextDueItem(completed);
  const nextModule = next ? getModuleOfItem(next.id) : undefined;

  return (
    <section aria-labelledby="sapaan" className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h1 id="sapaan" className="text-2xl font-bold text-text sm:text-3xl">
        Halo, {DISPLAY_NAME}
      </h1>
      <p className="mt-2 text-muted">{subtitle(today)}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {next && nextModule ? (
          <Link
            href={`/modul/${nextModule.id}/${next.id}`}
            className="inline-flex max-w-full items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <span className="truncate">Lanjutkan: {next.title}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <p className="rounded-lg bg-done/10 px-4 py-2.5 text-sm font-semibold text-done">Semua item selesai</p>
        )}
        <Link
          href="/jadwal"
          className="inline-flex items-center rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
        >
          Lihat jadwal
        </Link>
      </div>
    </section>
  );
}
