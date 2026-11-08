"use client";

import Link from "next/link";
import ItemTypeIcon from "@/components/ItemTypeIcon";
import { ItemCheckbox, ItemDueLabel } from "@/components/ProgressBits";
import { useProgress } from "@/components/ProgressProvider";
import { ITEM_TYPE_LABELS, getModuleOfItem, type Item } from "@/content/course";
import { itemsDueInWeek } from "@/lib/progress-rules";
import { currentWeek, displayWeek, formatDuration, formatWeekRange, type Schedule } from "@/lib/schedule";

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

export default function ThisWeek() {
  const { completed, today, schedule } = useProgress();

  if (!today || !schedule) {
    return (
      <section aria-labelledby="minggu-ini" className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
        <h2 id="minggu-ini" className="font-semibold text-text">
          Minggu ini
        </h2>
        <p className="mt-3 text-sm text-muted">Memuat…</p>
      </section>
    );
  }

  const beforeStart = currentWeek(schedule, today) === 0;
  const { week, items, isNext } = weekToShow(schedule, today);
  const done = items.filter((item) => completed.has(item.id)).length;
  const title = beforeStart ? "Minggu pertama" : isNext ? "Tenggat berikutnya" : "Minggu ini";

  return (
    <section aria-labelledby="minggu-ini" className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="minggu-ini" className="font-semibold text-text">
          {title}
        </h2>
        <p className="text-sm text-muted">
          Minggu {week} · {formatWeekRange(schedule, week)} · {done} dari {items.length} selesai
        </p>
      </div>
      {isNext && !beforeStart && (
        <p className="mt-2 text-sm text-muted">Tidak ada tenggat minggu ini. Lanjutkan item berikut.</p>
      )}

      <ul className="mt-4 divide-y divide-line">
        {items.map((item) => {
          const mod = getModuleOfItem(item.id);
          return (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <ItemCheckbox item={item} />
              <span aria-hidden="true" className="hidden shrink-0 text-muted sm:block">
                <ItemTypeIcon type={item.type} />
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/modul/${mod?.id}/${item.id}`}
                  className="font-medium leading-snug text-text hover:text-primary hover:underline"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-muted">
                  {ITEM_TYPE_LABELS[item.type]} · {formatDuration(item.minutes)}
                </p>
              </div>
              <span className="shrink-0 text-sm">
                <ItemDueLabel item={item} />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
