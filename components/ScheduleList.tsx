"use client";

// Daftar minggu di halaman jadwal, dihitung dari jadwal milik pengguna:
// sorotan minggu berjalan, gulir otomatis ke minggu itu, dan item yang jatuh tempo.

import Link from "next/link";
import { useEffect, useRef } from "react";
import ItemTypeIcon from "@/components/ItemTypeIcon";
import { PHASE_BG } from "@/components/phase-styles";
import { ItemCheckbox, ItemStatusDot } from "@/components/ProgressBits";
import { useProgress } from "@/components/ProgressProvider";
import { ITEM_TYPE_LABELS, MODULES, getModuleOfItem, moduleNumber, sumMinutes } from "@/content/course";
import { itemStatus, itemsDueInWeek } from "@/lib/progress-rules";
import {
  calendarWeekSpan,
  currentWeek,
  displayWeek,
  formatDuration,
  formatHours,
  formatLong,
  formatShort,
  formatWeekRange,
  weekEnd,
  type Schedule,
} from "@/lib/schedule";

function WeekCard({
  schedule,
  week,
  highlighted,
  label,
}: {
  schedule: Schedule;
  week: number;
  highlighted: boolean;
  label: string;
}) {
  const { completed, today } = useProgress();
  const ref = useRef<HTMLElement>(null);
  const scrolled = useRef(false);
  const started = today !== null && currentWeek(schedule, today) >= 1;

  // Gulir ke minggu berjalan sekali, hanya jika kursus sudah dimulai.
  useEffect(() => {
    if (highlighted && started && !scrolled.current) {
      scrolled.current = true;
      ref.current?.scrollIntoView({ block: "start" });
    }
  }, [highlighted, started]);

  const items = itemsDueInWeek(schedule, week);
  const modules = MODULES.filter((m) => {
    const [first, last] = calendarWeekSpan(schedule, m.weeks);
    return first <= week && week <= last;
  });
  const due = weekEnd(schedule, week);
  const done = items.filter((item) => completed.has(item.id)).length;
  const late = items.filter((item) => itemStatus(item, completed, today, schedule) === "late").length;

  return (
    <section
      ref={ref}
      id={`minggu-${week}`}
      aria-labelledby={`minggu-${week}-judul`}
      aria-current={highlighted && started ? "date" : undefined}
      className={`scroll-mt-20 rounded-2xl border bg-surface ${highlighted ? "border-primary ring-2 ring-primary/20" : "border-line"}`}
    >
      {highlighted && (
        <p className="rounded-t-2xl bg-primary px-5 py-1.5 text-sm font-semibold text-on-primary">{label}</p>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id={`minggu-${week}-judul`} className="text-lg font-semibold text-text">
            Minggu {week}{" "}
            <span className="ml-1 text-base font-normal text-muted">{formatWeekRange(schedule, week)}</span>
          </h2>
          {items.length > 0 && (
            <span className="text-sm">
              <span className={done === items.length ? "font-semibold text-done" : "text-muted"}>
                {done} dari {items.length} selesai
              </span>
              {late > 0 && <span className="ml-2 font-semibold text-late">· {late} tertinggal</span>}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          {modules.map((mod) => {
            const n = moduleNumber(mod);
            return (
              <Link
                key={mod.id}
                href={`/modul/${mod.id}`}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-on-phase ${PHASE_BG[mod.phase]} hover:opacity-90`}
              >
                {n === null ? "Ekstra" : `Modul ${n}`} · {mod.title}
              </Link>
            );
          })}
          {items.length > 0 && (
            <span className="text-muted">
              {formatHours(sumMinutes(items))} · tenggat{" "}
              <time dateTime={due} title={formatLong(due)}>
                {formatShort(due)}
              </time>
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <p className="mt-4 border-t border-line pt-3 text-sm text-muted">
            Tidak ada tenggat minggu ini. Pakai untuk menyelesaikan item yang sedang berjalan atau mengulang materi.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-2.5">
                <ItemCheckbox item={item} />
                <span aria-hidden="true" className="hidden shrink-0 text-muted sm:block">
                  <ItemTypeIcon type={item.type} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/modul/${getModuleOfItem(item.id)?.id}/${item.id}`}
                    className="leading-snug text-text hover:text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted">
                    {ITEM_TYPE_LABELS[item.type]} · {formatDuration(item.minutes)}
                  </p>
                </div>
                <ItemStatusDot item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function ScheduleList() {
  const { today, schedule } = useProgress();
  if (!today || !schedule) return <p className="mt-6 text-sm text-muted">Memuat jadwal…</p>;

  const highlightedWeek = currentWeek(schedule, today) <= schedule.totalWeeks ? displayWeek(schedule, today) : 0;
  const label = currentWeek(schedule, today) === 0 ? "Minggu pertama" : "Minggu ini";
  const weeks = Array.from({ length: schedule.totalWeeks }, (_, i) => i + 1);

  return (
    <>
      <p className="mt-2 text-muted">
        {schedule.totalWeeks} minggu, {formatLong(schedule.start)} sampai{" "}
        {formatLong(weekEnd(schedule, schedule.totalWeeks))}. Tenggat setiap item adalah hari terakhir minggunya.{" "}
        <Link href="/pengaturan" className="font-medium text-primary hover:underline">
          Ubah jadwal
        </Link>
      </p>
      <ol className="mt-6 space-y-5">
        {weeks.map((week) => (
          <li key={week}>
            <WeekCard schedule={schedule} week={week} highlighted={week === highlightedWeek} label={label} />
          </li>
        ))}
      </ol>
    </>
  );
}
