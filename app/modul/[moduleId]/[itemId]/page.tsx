import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExternalLinkCard from "@/components/ExternalLinkCard";
import ItemPager from "@/components/ItemPager";
import ItemTypeIcon from "@/components/ItemTypeIcon";
import Markdown from "@/components/Markdown";
import { CompleteButton } from "@/components/ProgressBits";
import Quiz from "@/components/Quiz";
import {
  ITEM_TYPE_LABELS,
  MODULES,
  getModule,
  moduleNumber,
  type Module,
} from "@/content/course";
import { getItemMarkdown, getQuiz } from "@/lib/content";
import { formatDuration, formatLong, formatShort, itemDueDate } from "@/lib/schedule";

type Props = PageProps<"/modul/[moduleId]/[itemId]">;

export function generateStaticParams() {
  return MODULES.flatMap((mod) =>
    mod.items.map((item) => ({ moduleId: mod.id, itemId: item.id })),
  );
}

async function findItem(params: Props["params"]) {
  const { moduleId, itemId } = await params;
  const mod = getModule(moduleId);
  const item = mod?.items.find((i) => i.id === itemId);
  return mod && item ? { mod, item } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await findItem(params);
  return { title: found?.item.title ?? "Item tidak ditemukan" };
}

const PHASE_TEXT: Record<Module["phase"], string> = {
  1: "text-phase-1",
  2: "text-phase-2",
  3: "text-phase-3",
};

function moduleLabel(mod: Module): string {
  const n = moduleNumber(mod);
  return n === null ? mod.title : `Modul ${n}: ${mod.title}`;
}

export default async function ItemPage({ params }: Props) {
  const found = await findItem(params);
  if (!found) notFound();
  const { mod, item } = found;

  const markdown = getItemMarkdown(item.id);
  const quiz = item.type === "quiz" ? getQuiz(item.id) : null;
  const due = itemDueDate(item);
  // Untuk item dengan tautan, note tampil di kartu tautan, bukan di atas.
  const showNoteAsBody = !markdown && !item.url && item.note;

  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-primary hover:underline">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href={`/modul/${mod.id}`} className="hover:text-primary hover:underline">
              {moduleLabel(mod)}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-text">
            {item.title}
          </li>
        </ol>
      </nav>

      <header className="mb-8 border-b border-line pb-6">
        <p className={`mb-2 flex items-center gap-2 text-sm font-semibold ${PHASE_TEXT[mod.phase]}`}>
          <ItemTypeIcon type={item.type} />
          {ITEM_TYPE_LABELS[item.type]}
        </p>
        <h1 className="text-2xl font-bold leading-tight text-text sm:text-3xl">{item.title}</h1>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-1.5">
            <dt className="text-muted">Durasi</dt>
            <dd className="font-medium text-text">{formatDuration(item.minutes)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-muted">Tenggat</dt>
            <dd className="font-medium text-text">
              <time dateTime={due} title={formatLong(due)}>
                {formatShort(due)}
              </time>
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-muted">Minggu</dt>
            <dd className="font-medium text-text">{item.week}</dd>
          </div>
        </dl>
      </header>

      {markdown && <Markdown source={markdown} />}

      {showNoteAsBody && (
        <div className="materi">
          <p>{item.note}</p>
        </div>
      )}

      {!markdown && !quiz && (
        <p className="mt-6 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted">
          Materi lengkap untuk item ini belum ditulis.
        </p>
      )}

      {item.url && <ExternalLinkCard url={item.url} note={item.note} type={item.type} />}

      {quiz && <Quiz itemId={item.id} questions={quiz} />}

      {item.type === "quiz" && !quiz && (
        <p className="my-8 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted">
          Soal untuk kuis ini belum ditulis.
        </p>
      )}

      {item.type === "project" && item.rubric && (
        <section aria-labelledby="rubrik" className="my-8 rounded-2xl border border-line bg-surface p-5">
          <h2 id="rubrik" className="font-semibold text-text">
            Rubrik
          </h2>
          <ul className="mt-3 space-y-2.5">
            {item.rubric.map((criterion) => (
              <li key={criterion} className="flex gap-3 leading-relaxed text-text">
                <span
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 rounded border-2 border-line"
                />
                {criterion}
              </li>
            ))}
          </ul>
        </section>
      )}

      {item.type !== "quiz" && <CompleteButton itemId={item.id} />}

      <ItemPager itemId={item.id} gated={Boolean(quiz)} />
    </article>
  );
}
