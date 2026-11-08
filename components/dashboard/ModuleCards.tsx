"use client";

import Link from "next/link";
import { PHASE_BG } from "@/components/phase-styles";
import { useProgress } from "@/components/ProgressProvider";
import { MODULES, PHASES, moduleMinutes, moduleNumber, type Module, type PhaseId } from "@/content/course";
import { MODULE_STATUS_LABELS, moduleProgress, moduleStatus, type ModuleStatus } from "@/lib/progress-rules";
import { formatHours, formatWeeksRange } from "@/lib/schedule";

const STATUS_STYLES: Record<ModuleStatus, string> = {
  "not-started": "bg-surface-2 text-muted",
  "in-progress": "bg-primary/10 text-primary",
  done: "bg-done/10 text-done",
  late: "bg-late/10 text-late",
};

function bandLabel(mod: Module): string {
  const n = moduleNumber(mod);
  const [a, b] = mod.weeks;
  const weeks = a === b ? `minggu ${a}` : `minggu ${a}–${b}`;
  return n === null ? `Ekstra, ${weeks}` : `Modul ${n}, ${weeks}`;
}

function ModuleCard({ mod }: { mod: Module }) {
  const { completed, today } = useProgress();
  const { done, total } = moduleProgress(mod, completed);
  const status = moduleStatus(mod, completed, today);
  const percent = Math.round((done / total) * 100);

  return (
    <li>
      <Link
        href={`/modul/${mod.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-primary"
      >
        <div className={`px-4 pb-3 pt-3 text-on-phase ${PHASE_BG[mod.phase]}`}>
          <p className="text-sm font-medium">{bandLabel(mod)}</p>
          {/* Grafik mini: satu batang per item, terisi jika selesai */}
          <div aria-hidden="true" className="mt-3 flex h-6 items-end gap-[2px]">
            {mod.items.map((item) => (
              <span
                key={item.id}
                className={`max-w-3 flex-1 rounded-t-[2px] ${completed.has(item.id) ? "h-full bg-white" : "h-2/5 bg-white/35"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold leading-snug text-text group-hover:text-primary">{mod.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {total} item · {formatHours(moduleMinutes(mod))} · {formatWeeksRange(mod.weeks)}
          </p>

          <div className="mt-auto pt-4">
            <div
              role="progressbar"
              aria-label={`Progres ${mod.title}`}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={done}
              aria-valuetext={`${done} dari ${total} item selesai`}
              className="h-1.5 overflow-hidden rounded-full bg-surface-2"
            >
              <div className="h-full rounded-full bg-done transition-[width] duration-300" style={{ width: `${percent}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-sm">
              <span className="text-muted">
                {done} dari {total} selesai
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
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
  const phases = Object.keys(PHASES).map(Number) as PhaseId[];

  return (
    <div className="space-y-8">
      {phases.map((phase) => (
        <section key={phase} aria-labelledby={`fase-${phase}`}>
          <h2 id={`fase-${phase}`} className="mb-3 font-semibold text-text">
            {PHASES[phase].label} · {PHASES[phase].title}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.filter((m) => m.phase === phase).map((mod) => (
              <ModuleCard key={mod.id} mod={mod} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
