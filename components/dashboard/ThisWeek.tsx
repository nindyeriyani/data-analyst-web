"use client";

import Link from "next/link";
import ItemTypeIcon from "@/components/ItemTypeIcon";
import { ItemCheckbox, ItemDueLabel } from "@/components/ProgressBits";
import { useProgress } from "@/components/ProgressProvider";
import { ITEM_TYPE_LABELS, getModuleOfItem, itemsByWeek } from "@/content/course";
import { EXTRA_WEEK, currentWeek, displayWeek, formatDuration, formatWeekRange } from "@/lib/schedule";

export default function ThisWeek() {
  const { completed, today } = useProgress();
  const week = today === null ? 1 : displayWeek(today);
  const beforeStart = today !== null && currentWeek(today) === 0;
  const items = itemsByWeek(week);
  const done = items.filter((item) => completed.has(item.id)).length;

  const title = beforeStart ? "Minggu pertama" : "Minggu ini";
  const weekLabel = week === EXTRA_WEEK ? "Minggu ekstra" : `Minggu ${week}`;

  return (
    <section aria-labelledby="minggu-ini" className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="minggu-ini" className="font-semibold text-text">
          {title}
        </h2>
        <p className="text-sm text-muted">
          {weekLabel} · {formatWeekRange(week)} · {done} dari {items.length} selesai
        </p>
      </div>

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
