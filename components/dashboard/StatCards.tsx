"use client";

import type { ReactNode } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { COURSE_ITEMS } from "@/content/course";
import { courseStatus, nearestDeadline } from "@/lib/progress-rules";
import { courseEndDate, daysUntil, formatLong, formatShort } from "@/lib/schedule";

/** Kartu angka mendatar: ikon di kiri, angka besar, lalu keterangan kecil. */
function Card({ icon, value, detail }: { icon: ReactNode; value: ReactNode; detail: ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      {icon}
      <div className="min-w-0">
        <p className="text-xl font-bold leading-tight text-text sm:text-2xl">{value}</p>
        <p className="mt-1 text-sm leading-snug text-muted">{detail}</p>
      </div>
    </div>
  );
}

function IconTile({ className, path }: { className: string; path: string }) {
  return (
    <span aria-hidden="true" className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${className}`}>
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </span>
  );
}

/** Cincin persen dengan angka di tengah. */
function Ring({ percent }: { percent: number }) {
  const r = 22;
  const circumference = 2 * Math.PI * r;
  return (
    <span aria-hidden="true" className="relative flex size-14 shrink-0 items-center justify-center">
      <svg viewBox="0 0 56 56" width="56" height="56" className="absolute inset-0 -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--primary-soft)" strokeWidth="5" />
        {percent > 0 && (
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${(percent / 100) * circumference} ${circumference}`}
            className="transition-[stroke-dasharray] duration-300"
          />
        )}
      </svg>
      <span className="relative text-xs font-bold text-text">{percent}%</span>
    </span>
  );
}

const PATHS = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert: "M12 7v6M12 17v.01",
  play: "M8 5v14l11-7z",
  flag: "M5 21V4h11l-2 4 2 4H5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
};

export default function StatCards() {
  const { completed, today, schedule } = useProgress();
  const total = COURSE_ITEMS.length;
  const done = COURSE_ITEMS.filter((item) => completed.has(item.id)).length;
  const percent = Math.round((done / total) * 100);
  const status = courseStatus(completed, today, schedule);
  const deadline = today && schedule ? nearestDeadline(completed, today, schedule) : null;
  const end = schedule ? courseEndDate(schedule) : null;
  const daysLeft = today && end ? daysUntil(end, today) : null;

  return (
    <section aria-label="Ringkasan" className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      <Card
        icon={<Ring percent={percent} />}
        value={
          <>
            {done} / {total}
          </>
        }
        detail="item selesai"
      />

      {status.kind === "late" ? (
        <Card
          icon={<IconTile className="bg-late/10 text-late" path={PATHS.alert} />}
          value={<span className="text-late">Tertinggal {status.count} item</span>}
          detail="Kejar item yang paling lama dulu"
        />
      ) : status.kind === "on-track" ? (
        <Card
          icon={<IconTile className="bg-done/10 text-done" path={PATHS.check} />}
          value="Sesuai jadwal"
          detail={end ? `Selesai ${formatShort(end)}` : "Tidak ada item tertinggal"}
        />
      ) : (
        <Card
          icon={<IconTile className="bg-surface-2 text-muted" path={PATHS.play} />}
          value="Belum mulai"
          detail="Belum ada item selesai"
        />
      )}

      <Card
        icon={<IconTile className="bg-type-amber-bg text-type-amber" path={PATHS.flag} />}
        value={
          daysLeft === null
            ? "–"
            : daysLeft > 0
              ? `${daysLeft} hari`
              : daysLeft === 0
                ? "Hari terakhir"
                : "Kursus selesai"
        }
        detail={end ? `menuju akhir jadwal · ${formatLong(end)}` : "menuju akhir jadwal"}
      />

      <Card
        icon={<IconTile className="bg-type-purple-bg text-type-purple" path={PATHS.calendar} />}
        value={deadline ? <time dateTime={deadline.date}>{formatShort(deadline.date)}</time> : "Tidak ada"}
        detail={deadline ? `tenggat terdekat · ${deadline.remaining} item` : "tenggat terdekat"}
      />
    </section>
  );
}
