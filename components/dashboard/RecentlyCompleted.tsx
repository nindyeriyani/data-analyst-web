"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { getItem, getModuleOfItem } from "@/content/course";
import { formatShort, toDateString } from "@/lib/schedule";

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
    <section aria-labelledby="baru-selesai" className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <h2 id="baru-selesai" className="font-semibold text-text">
        Baru selesai
      </h2>
      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Belum ada item yang selesai.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {recent.map(({ item, mod, date }) => (
            <li key={item.id} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-done text-[0.65rem] font-bold text-white"
              >
                ✓
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/modul/${mod.id}/${item.id}`}
                  className="text-sm font-medium leading-snug text-text hover:text-primary hover:underline"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-muted">
                  <time dateTime={date}>{formatShort(date)}</time>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
