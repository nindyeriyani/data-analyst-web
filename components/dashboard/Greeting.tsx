"use client";

import Link from "next/link";
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

/** Ilustrasi alur data: tabel, lembar kerja, lalu grafik. Hanya dekorasi. */
function Illustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 220"
      className="hidden h-auto w-72 shrink-0 md:block lg:w-80"
    >
      <circle cx="292" cy="58" r="58" fill="var(--phase-1-to)" opacity="0.25" />
      <circle cx="118" cy="62" r="17" fill="var(--accent-coral)" />
      <circle cx="210" cy="40" r="9" fill="var(--type-teal)" />

      {/* Garis penghubung */}
      <rect x="60" y="160" width="250" height="8" rx="4" fill="var(--text-muted)" opacity="0.7" />

      {/* Tabel database */}
      <rect x="20" y="112" width="76" height="98" rx="12" fill="var(--phase-1)" />
      <ellipse cx="58" cy="114" rx="38" ry="12" fill="var(--phase-1-to)" />

      {/* Lembar kerja */}
      <rect x="138" y="122" width="84" height="88" rx="14" fill="var(--accent-amber)" />
      <rect x="156" y="146" width="48" height="8" rx="4" fill="var(--surface)" />
      <rect x="156" y="162" width="36" height="8" rx="4" fill="var(--surface)" />
      <rect x="156" y="178" width="48" height="8" rx="4" fill="var(--surface)" />

      {/* Grafik batang */}
      <rect x="264" y="104" width="76" height="106" rx="12" fill="var(--phase-2)" />
      <rect x="280" y="160" width="10" height="34" rx="5" fill="var(--surface)" />
      <rect x="297" y="140" width="10" height="54" rx="5" fill="var(--surface)" />
      <rect x="314" y="120" width="10" height="74" rx="5" fill="var(--surface)" />
    </svg>
  );
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

      <Illustration />
    </section>
  );
}
