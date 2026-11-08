"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { MODULES, getModuleOfItem, moduleNumber } from "@/content/course";
import { nextDueItem } from "@/lib/progress-rules";
import { calendarWeekSpan, currentWeek, daysUntil, formatLong, type DateString, type Schedule } from "@/lib/schedule";

function subtitle(today: DateString | null, schedule: Schedule | null): string {
  if (today === null || schedule === null) return "Kursus data analyst: 10 modul, belajar sesuai jadwal Anda sendiri.";

  const week = currentWeek(schedule, today);
  if (week === 0) {
    const days = daysUntil(schedule.start, today);
    const when = days === 1 ? "besok" : `${days} hari lagi`;
    return `Kursus dimulai ${formatLong(schedule.start)}, ${when}.`;
  }
  if (week > schedule.totalWeeks) return "Jadwal kursus sudah selesai. Selamat atas kerja kerasnya!";

  const mod = MODULES.find((m) => {
    const [first, last] = calendarWeekSpan(schedule, m.weeks);
    return first <= week && week <= last;
  });
  const n = mod ? moduleNumber(mod) : null;
  const moduleLabel = mod ? ` · ${n === null ? "" : `Modul ${n}: `}${mod.title}` : "";
  return `Minggu ${week} dari ${schedule.totalWeeks}${moduleLabel}.`;
}

export default function Greeting() {
  const { ready, completed, today, displayName, schedule, scheduleIsCustom } = useProgress();
  const next = nextDueItem(completed);
  const nextModule = next ? getModuleOfItem(next.id) : undefined;

  return (
    <section aria-labelledby="sapaan" className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h1 id="sapaan" className="text-2xl font-bold text-text sm:text-3xl">
        Halo, {displayName}
      </h1>
      <p className="mt-2 text-muted">{subtitle(today, schedule)}</p>
      {ready && schedule && !scheduleIsCustom && (
        <p className="mt-2 text-sm text-muted">
          Jadwal memakai tanggal mulai {formatLong(schedule.start)} selama {schedule.totalWeeks} minggu.{" "}
          <Link href="/pengaturan" className="font-medium text-primary hover:underline">
            Atur jadwal
          </Link>
        </p>
      )}

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
