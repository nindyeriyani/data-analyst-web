"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { getItem, getModuleOfItem } from "@/content/course";
import { formatDayMonth, toDateString } from "@/lib/schedule";

export default function RecentlyCompleted() {
  const { completedAt } = useProgress();
  const recent = Object.entries(completedAt)
    .sort(([, a], [, b]) => b.localeCompare(a))
    .slice(0, 4)
    .flatMap(([id, at]) => {
      const item = getItem(id);
      const mod = getModuleOfItem(id);
      return item && mod ? [{ item, mod, date: toDateString(new Date(at)) }] : [];
    });

  return (
    <section aria-labelledby="baru-selesai" className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <h2 id="baru-selesai" className="font-bold text-text">
        Baru selesai
      </h2>
      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Belum ada item yang selesai.</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {recent.map(({ item, mod, date }) => (
            <li key={item.id} className="flex items-baseline gap-4">
              <time dateTime={date} className="w-14 shrink-0 font-mono text-xs text-done">
                {formatDayMonth(date)}
              </time>
              <Link
                href={`/modul/${mod.id}/${item.id}`}
                className="min-w-0 flex-1 text-sm leading-snug text-text hover:text-primary hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
