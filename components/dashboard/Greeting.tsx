"use client";

import Link from "next/link";
import DataFlowIllustration from "@/components/DataFlowIllustration";
import { useProgress } from "@/components/ProgressProvider";
import { MODULES, getModuleOfItem, moduleNumber } from "@/content/course";
import { nextDueItem } from "@/lib/progress-rules";
import {
  calendarWeekSpan,
  currentWeek,
  daysUntil,
  formatLong,
  formatShort,
  type DateString,
  type Schedule,
} from "@/lib/schedule";

/** Baris kecil di atas sapaan dan kalimat di bawahnya. */
function heroText(today: DateString | null, schedule: Schedule | null): { eyebrow: string; subtitle: string } {
  if (today === null || schedule === null) {
    return { eyebrow: "Kursus data analyst", subtitle: "10 modul, belajar sesuai jadwal Anda sendiri." };
  }

  const week = currentWeek(schedule, today);
  if (week === 0) {
    const days = daysUntil(schedule.start, today);
    const when = days === 1 ? "besok" : `dalam ${days} hari`;
    return {
      eyebrow: `Mulai ${formatShort(schedule.start)}`,
      subtitle: `Kursus dimulai ${when}. Anda boleh mulai kapan saja.`,
    };
  }
  if (week > schedule.totalWeeks) {
    return { eyebrow: "Jadwal selesai", subtitle: "Jadwal kursus sudah selesai. Selamat atas kerja kerasnya!" };
  }

  const mod = MODULES.find((m) => {
    const [first, last] = calendarWeekSpan(schedule, m.weeks);
    return first <= week && week <= last;
  });
  const n = mod ? moduleNumber(mod) : null;
  return {
    eyebrow: `Minggu ${week} dari ${schedule.totalWeeks}`,
    subtitle: mod ? `Sekarang: ${n === null ? "" : `Modul ${n}, `}${mod.title}.` : "Lanjutkan item berikutnya.",
  };
}

export default function Greeting() {
  const { ready, completed, today, displayName, schedule, scheduleIsCustom } = useProgress();
  const next = nextDueItem(completed);
  const nextModule = next ? getModuleOfItem(next.id) : undefined;
  const { eyebrow, subtitle } = heroText(today, schedule);

  return (
    <section
      aria-labelledby="sapaan"
      className="flex items-center gap-6 overflow-hidden rounded-3xl bg-primary-soft px-5 py-7 sm:px-10 sm:py-10"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold tracking-wide text-primary">{eyebrow}</p>
        <h1 id="sapaan" className="mt-2 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Halo, {displayName}
        </h1>
        <p className="mt-3 text-text sm:text-lg">{subtitle}</p>
        {ready && schedule && !scheduleIsCustom && (
          <p className="mt-2 text-sm text-muted">
            Jadwal memakai tanggal mulai {formatLong(schedule.start)} selama {schedule.totalWeeks} minggu.{" "}
            <Link href="/pengaturan" className="font-semibold text-primary hover:underline">
              Atur jadwal
            </Link>
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {next && nextModule ? (
            <Link
              href={`/modul/${nextModule.id}/${next.id}`}
              className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover sm:text-base"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" className="shrink-0">
                <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
              </svg>
              <span className="truncate">Lanjutkan: {next.title}</span>
            </Link>
          ) : (
            <p className="rounded-full bg-done/10 px-5 py-3 text-sm font-semibold text-done">Semua item selesai</p>
          )}
          <Link
            href="/jadwal"
            className="inline-flex items-center rounded-full border border-primary/30 bg-surface px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary sm:text-base"
          >
            Lihat jadwal
          </Link>
        </div>
      </div>

      <DataFlowIllustration className="hidden w-72 shrink-0 md:block lg:w-80" />
    </section>
  );
}
