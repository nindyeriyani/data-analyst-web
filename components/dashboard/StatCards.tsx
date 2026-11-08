"use client";

import type { ReactNode } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { COURSE_ITEMS } from "@/content/course";
import { courseStatus, nearestDeadline } from "@/lib/progress-rules";
import { COURSE_END, EXTRA_WEEK, daysUntil, formatLong, formatShort } from "@/lib/schedule";

function Card({ label, children, footer }: { label: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-2 flex-1">{children}</div>
      {footer && <p className="mt-2 text-sm text-muted">{footer}</p>}
    </div>
  );
}

/** Cincin persen: track abu-abu, isian hijau selesai, mulai dari atas. */
function Ring({ percent }: { percent: number }) {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" className="shrink-0 -rotate-90">
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="5" />
      {percent > 0 && (
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--done)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${(percent / 100) * circumference} ${circumference}`}
          className="transition-[stroke-dasharray] duration-300"
        />
      )}
    </svg>
  );
}

export default function StatCards() {
  const { completed, today } = useProgress();
  const total = COURSE_ITEMS.length;
  const done = COURSE_ITEMS.filter((item) => completed.has(item.id)).length;
  const percent = Math.round((done / total) * 100);
  const status = courseStatus(completed, today);
  const deadline = nearestDeadline(completed, today);
  const daysLeft = today === null ? null : daysUntil(COURSE_END, today);

  return (
    <section aria-label="Ringkasan" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Card label="Progres" footer={`${percent}% item selesai`}>
        <div className="flex items-center gap-3">
          <Ring percent={percent} />
          <p className="text-2xl font-semibold text-text">
            {done}
            <span className="text-base font-normal text-muted"> dari {total}</span>
          </p>
        </div>
      </Card>

      <Card
        label="Status"
        footer={status.kind === "late" ? "Kejar item yang paling lama dulu" : status.kind === "on-track" ? "Tidak ada item tertinggal" : "Belum ada item selesai"}
      >
        {status.kind === "late" ? (
          <p className="flex items-center gap-2 text-lg font-semibold sm:text-xl text-late">
            <span aria-hidden="true">!</span> Tertinggal {status.count} item
          </p>
        ) : status.kind === "on-track" ? (
          <p className="flex items-center gap-2 text-lg font-semibold sm:text-xl text-done">
            <span aria-hidden="true">✓</span> Sesuai jadwal
          </p>
        ) : (
          <p className="text-lg font-semibold sm:text-xl text-text">Belum mulai</p>
        )}
      </Card>

      <Card label="Hitung mundur" footer={`Menuju ${formatLong(COURSE_END)}`}>
        <p className="text-2xl font-semibold text-text">
          {daysLeft === null
            ? "–"
            : daysLeft > 0
              ? `${daysLeft} hari lagi`
              : daysLeft === 0
                ? "Hari terakhir"
                : "Kursus selesai"}
        </p>
      </Card>

      <Card
        label="Tenggat terdekat"
        footer={deadline ? `${deadline.remaining} item tersisa${deadline.week === EXTRA_WEEK ? " · minggu ekstra" : ` · minggu ${deadline.week}`}` : undefined}
      >
        <p className="text-2xl font-semibold text-text">
          {deadline ? <time dateTime={deadline.date}>{formatShort(deadline.date)}</time> : "Tidak ada"}
        </p>
      </Card>
    </section>
  );
}
