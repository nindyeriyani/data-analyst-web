"use client";

import Link from "next/link";
import { ItemTypeTile } from "@/components/ItemTypeIcon";
import { ItemCheckbox, ItemDueLabel } from "@/components/ProgressBits";
import { useProgress } from "@/components/ProgressProvider";
import { ITEM_TYPE_LABELS, getModuleOfItem, moduleNumber, type Item } from "@/content/course";
import { itemsDueInWeek } from "@/lib/progress-rules";
import {
  currentWeek,
  displayWeek,
  formatDayMonth,
  formatDuration,
  formatLong,
  toDateString,
  weekEnd,
  type Schedule,
} from "@/lib/schedule";

/** Minggu yang ditampilkan dan itemnya. Kalau minggu ini tanpa tenggat, ambil minggu berikutnya yang punya tenggat. */
function weekToShow(schedule: Schedule, today: string): { week: number; items: Item[]; isNext: boolean } {
  const week = displayWeek(schedule, today);
  const items = itemsDueInWeek(schedule, week);
  if (items.length > 0) return { week, items, isNext: false };
  for (let next = week + 1; next <= schedule.totalWeeks; next++) {
    const nextItems = itemsDueInWeek(schedule, next);
    if (nextItems.length > 0) return { week: next, items: nextItems, isNext: true };
  }
  return { week, items, isNext: false };
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <h2 id="minggu-ini" className="text-xl font-bold text-text sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 text-muted">Centang di sini atau di halaman item. Tanggal selesai tercatat otomatis.</p>
    </div>
  );
}

export default function ThisWeek() {
  const { completed, completedAt, today, schedule } = useProgress();

  if (!today || !schedule) {
    return (
      <section aria-labelledby="minggu-ini">
        <SectionHeading title="Minggu ini" />
        <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">Memuat…</div>
      </section>
    );
  }

  const beforeStart = currentWeek(schedule, today) === 0;
  const { week, items, isNext } = weekToShow(schedule, today);
  const done = items.filter((item) => completed.has(item.id)).length;
  const title = beforeStart ? "Minggu pertama Anda" : isNext ? "Tenggat berikutnya" : "Minggu ini";

  return (
    <section aria-labelledby="minggu-ini">
      <SectionHeading title={title} />

      <div className="rounded-2xl border border-line bg-surface px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
          <p className="font-semibold text-text">Tenggat {formatLong(weekEnd(schedule, week))}</p>
          <p className="text-sm text-muted">
            Minggu {week} · {done} dari {items.length} selesai
          </p>
        </div>
        {isNext && !beforeStart && (
          <p className="mt-3 text-sm text-muted">Tidak ada tenggat minggu ini. Lanjutkan item berikut.</p>
        )}

        <ul className="divide-y divide-line">
          {items.map((item) => {
            const mod = getModuleOfItem(item.id);
            const n = mod ? moduleNumber(mod) : null;
            const finishedAt = completedAt[item.id];
            return (
              <li key={item.id} className="flex items-center gap-3 py-3.5 sm:gap-4">
                <ItemCheckbox item={item} />
                <ItemTypeTile type={item.type} className="hidden sm:flex" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/modul/${mod?.id}/${item.id}`}
                    className="font-medium leading-snug text-text hover:text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted">
                    {ITEM_TYPE_LABELS[item.type]} · {formatDuration(item.minutes)} ·{" "}
                    {n === null ? "Ekstra" : `Modul ${n}`}
                  </p>
                </div>
                {finishedAt ? (
                  <span className="shrink-0 rounded-md bg-done/10 px-2 py-1 font-mono text-xs text-done">
                    <span aria-hidden="true">✓ </span>
                    <span className="sr-only">Selesai </span>
                    {formatDayMonth(toDateString(new Date(finishedAt)))}
                  </span>
                ) : (
                  <span className="shrink-0 text-right text-sm">
                    <ItemDueLabel item={item} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
