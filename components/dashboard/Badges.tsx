"use client";

import { useProgress } from "@/components/ProgressProvider";
import { BADGE_ITEMS, getItem, getModule } from "@/content/course";
import { badges, type Badge } from "@/lib/progress-rules";
import { formatDayMonth, itemDueDate, toDateString, type DateString, type Schedule } from "@/lib/schedule";

const ICONS: Record<Badge["id"], string> = {
  firstModule: "M5 21V4h11l-2 4 2 4H5",
  sql: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  python: "M8 7l-5 5 5 5M16 7l5 5-5 5",
  firstPortfolio: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  portfolioOnline: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  firstApplication: "M3 7l9 6 9-6M3 7v10h18V7z",
};

/** Tanggal di bawah badge: tanggal diraih, atau tanggal target dari jadwal jika belum. */
function badgeDate(
  badge: Badge,
  completedAt: Readonly<Record<string, string>>,
  schedule: Schedule | null,
): DateString | null {
  const items =
    badge.id === "firstModule"
      ? (getModule(BADGE_ITEMS.firstModule)?.items ?? [])
      : [getItem(BADGE_ITEMS[badge.id])].filter((item) => item !== undefined);
  if (items.length === 0) return null;

  if (badge.earned) {
    const latest = items.map((item) => completedAt[item.id]).filter(Boolean).sort().at(-1);
    return latest ? toDateString(new Date(latest)) : null;
  }
  if (!schedule) return null;
  const lastWeek = Math.max(...items.map((item) => item.week));
  return itemDueDate(schedule, { week: lastWeek });
}

export default function Badges() {
  const { completed, completedAt, schedule } = useProgress();
  const list = badges(completed);
  const earned = list.filter((b) => b.earned).length;

  return (
    <section aria-labelledby="pencapaian">
      <div className="mb-4">
        <h2 id="pencapaian" className="text-xl font-bold text-text sm:text-2xl">
          Pencapaian
        </h2>
        <p className="mt-1 text-muted">
          Badge terbuka saat Anda mencapainya · {earned} dari {list.length}
        </p>
      </div>

      <ul className="grid grid-cols-3 gap-x-3 gap-y-5 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        {list.map((badge) => {
          const date = badgeDate(badge, completedAt, schedule);
          return (
            <li key={badge.id} className="flex flex-col items-center gap-2 text-center" title={badge.requirement}>
              <span
                aria-hidden="true"
                className={`flex size-14 items-center justify-center rounded-full ${
                  badge.earned ? "bg-primary text-on-primary" : "bg-surface-2 text-muted"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={ICONS[badge.id]} />
                </svg>
              </span>
              <span className={`text-xs leading-snug ${badge.earned ? "font-semibold text-text" : "text-muted"}`}>
                {badge.label}
                {date && (
                  <span className="block font-normal">
                    {badge.earned ? "" : "Target "}
                    {formatDayMonth(date)}
                  </span>
                )}
                <span className="sr-only">
                  {badge.earned ? " (sudah diraih)" : ` (belum diraih. ${badge.requirement})`}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
