"use client";

import Link from "next/link";
import { hoursPerWeek } from "@/components/HeaderStatus";
import { PHASE_BG, PHASE_GRADIENT, PHASE_TEXT } from "@/components/phase-styles";
import { useProgress } from "@/components/ProgressProvider";
import { MODULES, PHASES, moduleMinutes, moduleNumber, type Module, type PhaseId } from "@/content/course";
import { MODULE_STATUS_LABELS, moduleProgress, moduleStatus, type ModuleStatus } from "@/lib/progress-rules";
import {
  DEFAULT_TOTAL_WEEKS,
  calendarWeekSpan,
  formatHours,
  formatRange,
  formatSpanRange,
  weekEnd,
  weekStart,
  type Schedule,
} from "@/lib/schedule";

const STATUS_STYLES: Record<ModuleStatus, string> = {
  "not-started": "bg-surface-2 text-muted",
  "in-progress": "bg-primary-soft text-primary",
  done: "bg-done/10 text-done",
  late: "bg-late/10 text-late",
};

function bandLabel(mod: Module, schedule: Schedule | null): string {
  const n = moduleNumber(mod);
  const name = n === null ? "Ekstra" : `Modul ${n}`;
  if (!schedule) return name;
  const [a, b] = calendarWeekSpan(schedule, mod.weeks);
  return `${name} · ${a === b ? `minggu ${a}` : `minggu ${a}–${b}`}`;
}

/** Rentang tanggal satu fase, dari awal modul pertama sampai akhir modul terakhir. */
function phaseRange(modules: Module[], schedule: Schedule): string {
  const first = calendarWeekSpan(schedule, modules[0].weeks)[0];
  const last = calendarWeekSpan(schedule, modules[modules.length - 1].weeks)[1];
  const end = weekEnd(schedule, last);
  return `${formatRange(weekStart(schedule, first), end)} ${end.slice(0, 4)}`;
}

function ModuleCard({ mod }: { mod: Module }) {
  const { completed, today, schedule } = useProgress();
  const { done, total } = moduleProgress(mod, completed);
  const status = moduleStatus(mod, completed, today, schedule);
  const percent = Math.round((done / total) * 100);

  return (
    <li>
      <Link
        href={`/modul/${mod.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xs transition-shadow hover:shadow-md"
      >
        <div className={`flex h-24 items-end justify-between gap-3 px-4 pb-3 ${PHASE_GRADIENT[mod.phase]}`}>
          <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-text">
            {bandLabel(mod, schedule)}
          </span>
          {/* Grafik mini: satu batang per item, terisi jika selesai */}
          <span aria-hidden="true" className="flex h-7 w-24 shrink-0 items-end justify-end gap-[2px]">
            {mod.items.map((item) => (
              <span
                key={item.id}
                className={`max-w-2 flex-1 rounded-t-[2px] ${completed.has(item.id) ? "h-full bg-on-phase" : "h-2/5 bg-on-phase/35"}`}
              />
            ))}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h4 className="text-lg font-bold leading-snug text-text group-hover:text-primary">{mod.title}</h4>
          <p className="mt-1.5 text-sm text-muted">
            {total} item · {formatHours(moduleMinutes(mod))}
            {schedule && <> · {formatSpanRange(schedule, calendarWeekSpan(schedule, mod.weeks))}</>}
          </p>

          <div className="mt-auto pt-5">
            <div
              role="progressbar"
              aria-label={`Progres ${mod.title}`}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={done}
              aria-valuetext={`${done} dari ${total} item selesai`}
              className="h-1.5 overflow-hidden rounded-full bg-surface-2"
            >
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${PHASE_BG[mod.phase]}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-sm">
              <span className="text-muted">
                {done} dari {total} selesai
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>
                {MODULE_STATUS_LABELS[status]}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function ModuleCards() {
  const { schedule } = useProgress();
  const phases = Object.keys(PHASES).map(Number) as PhaseId[];
  const totalWeeks = schedule?.totalWeeks ?? DEFAULT_TOTAL_WEEKS;
  const mainModules = MODULES.filter((m) => moduleNumber(m) !== null).length;
  const extraModules = MODULES.length - mainModules;

  return (
    <section aria-labelledby="isi-kursus">
      <h2 id="isi-kursus" className="text-xl font-bold text-text sm:text-2xl">
        Isi kursus
      </h2>
      <p className="mt-1 text-muted">
        {mainModules} modul{extraModules > 0 && ` dan ${extraModules} modul ekstra`} · {totalWeeks} minggu · ≈
        {hoursPerWeek(totalWeeks)} jam/minggu
      </p>

      <div className="mt-6 space-y-8">
        {phases.map((phase) => {
          const modules = MODULES.filter((m) => m.phase === phase);
          return (
            <section key={phase} aria-labelledby={`fase-${phase}`}>
              <h3 id={`fase-${phase}`} className="mb-3 flex flex-wrap items-baseline gap-x-3">
                <span className={`font-bold ${PHASE_TEXT[phase]}`}>{PHASES[phase].title}</span>
                <span className="text-sm text-muted">
                  {PHASES[phase].label}
                  {schedule && <> · {phaseRange(modules, schedule)}</>}
                </span>
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((mod) => (
                  <ModuleCard key={mod.id} mod={mod} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
