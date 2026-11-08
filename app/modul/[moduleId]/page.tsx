import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ItemTypeIcon from "@/components/ItemTypeIcon";
import { ContinueButton, ItemCheckbox, ItemDueLabel, ModuleProgressBar } from "@/components/ProgressBits";
import {
  ITEM_TYPE_LABELS,
  MODULES,
  PHASES,
  SECTIONS,
  getModule,
  itemsBySection,
  moduleMinutes,
  moduleNumber,
  type Module,
} from "@/content/course";
import { formatDuration, formatHours, formatShort, formatWeeksRange, weekEnd } from "@/lib/schedule";

type Props = PageProps<"/modul/[moduleId]">;

export function generateStaticParams() {
  return MODULES.map((mod) => ({ moduleId: mod.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId } = await params;
  return { title: getModule(moduleId)?.title ?? "Modul tidak ditemukan" };
}

const PHASE_BG: Record<Module["phase"], string> = {
  1: "bg-phase-1",
  2: "bg-phase-2",
  3: "bg-phase-3",
};

const PHASE_TEXT: Record<Module["phase"], string> = {
  1: "text-phase-1",
  2: "text-phase-2",
  3: "text-phase-3",
};

function weeksLabel([first, last]: [number, number]): string {
  return first === last ? `Minggu ${first}` : `Minggu ${first}–${last}`;
}

export default async function ModulePage({ params }: Props) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  const n = moduleNumber(mod);
  const due = weekEnd(mod.weeks[1]);

  return (
    <div className="mx-auto max-w-3xl">
      <header className={`rounded-2xl px-5 py-6 text-on-phase sm:px-7 ${PHASE_BG[mod.phase]}`}>
        <p className="text-sm font-medium text-on-phase/90">
          {PHASES[mod.phase].label} · {PHASES[mod.phase].title} · {n === null ? "Minggu ekstra" : `Modul ${n}`} ·{" "}
          {weeksLabel(mod.weeks)}
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{mod.title}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-on-phase/90">{mod.description}</p>

        <div className="mt-5">
          <ModuleProgressBar moduleId={mod.id} onPhase />
          <p className="mt-1 text-sm text-on-phase/90">
            {mod.items.length} item · {formatHours(moduleMinutes(mod))} · {formatWeeksRange(mod.weeks)} · tenggat{" "}
            {formatShort(due)}
          </p>
        </div>
      </header>

      <div className="mt-5">
        <ContinueButton moduleId={mod.id} />
      </div>

      <section aria-labelledby="tujuan" className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <h2 id="tujuan" className="font-semibold text-text">
          Tujuan belajar
        </h2>
        <ul className="mt-3 space-y-2">
          {mod.objectives.map((objective) => (
            <li key={objective} className="flex gap-3 leading-relaxed text-text">
              <span aria-hidden="true" className={`mt-0.5 font-bold ${PHASE_TEXT[mod.phase]}`}>
                ✓
              </span>
              {objective}
            </li>
          ))}
        </ul>
      </section>

      {SECTIONS.map((section) => {
        const items = itemsBySection(mod, section.id);
        if (items.length === 0) return null;
        return (
          <section key={section.id} aria-labelledby={`bagian-${section.id}`} className="mt-8">
            <h2 id={`bagian-${section.id}`} className="mb-3 text-lg font-semibold text-text">
              {section.label}
            </h2>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4">
                  <ItemCheckbox item={item} />
                  <span
                    aria-hidden="true"
                    className={`hidden size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 sm:flex ${PHASE_TEXT[mod.phase]}`}
                  >
                    <ItemTypeIcon type={item.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/modul/${mod.id}/${item.id}`}
                      className="font-medium leading-snug text-text hover:text-primary hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted">
                      {ITEM_TYPE_LABELS[item.type]} · {formatDuration(item.minutes)}
                    </p>
                  </div>
                  <span className="shrink-0 text-right text-sm">
                    <ItemDueLabel item={item} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
