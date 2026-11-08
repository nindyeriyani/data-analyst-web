import type { Metadata } from "next";
import Link from "next/link";
import ItemTypeIcon from "@/components/ItemTypeIcon";
import { PHASE_BG } from "@/components/phase-styles";
import { ItemCheckbox, ItemStatusDot } from "@/components/ProgressBits";
import { WeekFrame, WeekProgress } from "@/components/ScheduleWeek";
import {
  ITEM_TYPE_LABELS,
  MODULES,
  getModuleOfItem,
  itemsByWeek,
  moduleNumber,
  sumMinutes,
} from "@/content/course";
import {
  EXTRA_WEEK,
  TOTAL_WEEKS,
  formatDuration,
  formatHours,
  formatLong,
  formatShort,
  formatWeekRange,
  weekEnd,
} from "@/lib/schedule";

export const metadata: Metadata = { title: "Jadwal" };

export default function SchedulePage() {
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Jadwal</h1>
      <p className="mt-2 text-muted">
        12 minggu ditambah satu minggu ekstra. Tenggat setiap item adalah hari Minggu di minggunya, kecuali
        minggu ekstra yang berakhir {formatLong(weekEnd(EXTRA_WEEK))}.
      </p>

      <ol className="mt-6 space-y-5">
        {weeks.map((week) => {
          const items = itemsByWeek(week);
          const modules = MODULES.filter((m) => m.weeks[0] <= week && week <= m.weeks[1]);
          const due = weekEnd(week);

          return (
            <li key={week}>
              <WeekFrame week={week}>
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 id={`minggu-${week}-judul`} className="text-lg font-semibold text-text">
                      {week === EXTRA_WEEK ? "Minggu ekstra" : `Minggu ${week}`}
                      <span className="ml-2 text-base font-normal text-muted">{formatWeekRange(week)}</span>
                    </h2>
                    <WeekProgress week={week} />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    {modules.map((mod) => {
                      const n = moduleNumber(mod);
                      return (
                        <Link
                          key={mod.id}
                          href={`/modul/${mod.id}`}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-on-phase ${PHASE_BG[mod.phase]} hover:opacity-90`}
                        >
                          {n === null ? "Ekstra" : `Modul ${n}`} · {mod.title}
                        </Link>
                      );
                    })}
                    <span className="text-muted">
                      {formatHours(sumMinutes(items))} · tenggat{" "}
                      <time dateTime={due} title={formatLong(due)}>
                        {formatShort(due)}
                      </time>
                    </span>
                  </div>

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
                </div>
              </WeekFrame>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
