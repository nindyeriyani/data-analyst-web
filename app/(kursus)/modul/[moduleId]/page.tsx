import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemTypeTile } from "@/components/ItemTypeIcon";
import { PHASE_GRADIENT, PHASE_SOFT_BG } from "@/components/phase-styles";
import {
  ContinueButton,
  ItemCheckbox,
  ItemDueLabel,
  ModuleHeaderProgress,
  ModuleSchedule,
} from "@/components/ProgressBits";
import {
  ITEM_TYPE_LABELS,
  MODULES,
  PHASES,
  SECTIONS,
  getModule,
  itemsBySection,
  moduleMinutes,
  moduleNumber,
  sumMinutes,
  type ItemType,
  type Module,
} from "@/content/course";
import { formatDuration, formatHours } from "@/lib/schedule";

type Props = PageProps<"/modul/[moduleId]">;

export function generateStaticParams() {
  return MODULES.map((mod) => ({ moduleId: mod.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId } = await params;
  return { title: getModule(moduleId)?.title ?? "Modul tidak ditemukan" };
}

/** "1 pengantar · 2 bacaan · 1 kuis", sesuai urutan tipe pertama kali muncul. */
function typeSummary(mod: Module): string {
  const counts = new Map<ItemType, number>();
  for (const item of mod.items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].map(([type, count]) => `${count} ${ITEM_TYPE_LABELS[type].toLowerCase()}`).join(" · ");
}

/** Durasi bagian: menit untuk yang pendek, jam untuk yang panjang. */
function sectionDuration(minutes: number): string {
  return minutes < 60 ? formatDuration(minutes) : formatHours(minutes);
}

export default async function ModulePage({ params }: Props) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  const n = moduleNumber(mod);
  const sections = SECTIONS.map((section) => ({ ...section, items: itemsBySection(mod, section.id) })).filter(
    (section) => section.items.length > 0,
  );

  return (
    <div className="max-w-5xl">
      <header className={`rounded-3xl px-5 py-7 text-on-phase sm:px-8 sm:py-8 ${PHASE_GRADIENT[mod.phase]}`}>
        <p className="text-xs font-bold tracking-wide text-on-phase/90 sm:text-sm">
          {n === null ? "Modul ekstra" : `Modul ${n}`} · {PHASES[mod.phase].title} · <ModuleSchedule weeks={mod.weeks} />
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{mod.title}</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-on-phase/90 sm:text-lg">{mod.description}</p>

        <div className="mt-6">
          <ModuleHeaderProgress moduleId={mod.id} hours={formatHours(moduleMinutes(mod))} />
        </div>
      </header>

      <div className="mt-5">
        <ContinueButton moduleId={mod.id} />
      </div>

      <section aria-labelledby="tujuan" className={`mt-6 max-w-3xl rounded-2xl p-5 sm:px-6 ${PHASE_SOFT_BG[mod.phase]}`}>
        <h2 id="tujuan" className="font-bold text-text">
          Tujuan belajar
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed text-text marker:text-muted">
          {mod.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>

      <p className="mt-6 leading-relaxed text-muted">Di modul ini: {typeSummary(mod)}</p>

      {sections.map((section, index) => (
        <section key={section.id} aria-labelledby={`bagian-${section.id}`} className="mt-8">
          <h2 id={`bagian-${section.id}`} className="mb-3 flex items-baseline gap-2 text-sm">
            <span className="font-bold tracking-wide text-muted">
              Bagian {index + 1} · {section.label}
            </span>
            <span className="font-semibold text-text">{sectionDuration(sumMinutes(section.items))}</span>
          </h2>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface px-4 sm:px-5">
            {section.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3.5 sm:gap-4">
                <ItemCheckbox item={item} />
                <ItemTypeTile type={item.type} className="hidden sm:flex" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/modul/${mod.id}/${item.id}`}
                    className="font-semibold leading-snug text-text hover:text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-muted">
                    {ITEM_TYPE_LABELS[item.type]} · {formatDuration(item.minutes)}
                  </p>
                </div>
                <span className="shrink-0 text-right text-sm">
                  <ItemDueLabel item={item} prefix />
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
