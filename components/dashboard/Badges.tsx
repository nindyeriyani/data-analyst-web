"use client";

import { useProgress } from "@/components/ProgressProvider";
import { badges, type Badge } from "@/lib/progress-rules";

const ICONS: Record<Badge["id"], string> = {
  firstModule: "M5 21V4h11l-2 4 2 4H5",
  sql: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  python: "M8 7l-5 5 5 5M16 7l5 5-5 5",
  firstPortfolio: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  portfolioOnline: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  firstApplication: "M3 7l9 6 9-6M3 7v10h18V7z",
};

export default function Badges() {
  const { completed } = useProgress();
  const list = badges(completed);
  const earned = list.filter((b) => b.earned).length;

  return (
    <section aria-labelledby="pencapaian" className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="pencapaian" className="font-semibold text-text">
          Pencapaian
        </h2>
        <p className="text-sm text-muted">
          {earned} dari {list.length}
        </p>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-3">
        {list.map((badge) => (
          <li key={badge.id} className="flex flex-col items-center gap-2 text-center" title={badge.requirement}>
            <span
              aria-hidden="true"
              className={`flex size-12 items-center justify-center rounded-full ${
                badge.earned ? "bg-primary text-on-primary" : "border-2 border-dashed border-line bg-surface-2 text-muted"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={ICONS[badge.id]} />
              </svg>
            </span>
            <span className={`text-xs leading-snug ${badge.earned ? "font-semibold text-text" : "text-muted"}`}>
              {badge.label}
              <span className="sr-only">
                {badge.earned ? " (sudah diraih)" : ` (belum diraih. ${badge.requirement})`}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
