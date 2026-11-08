import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExternalLinkCard from "@/components/ExternalLinkCard";
import ItemPager from "@/components/ItemPager";
import { ReflectionNote, RubricChecklist, WorkLink } from "@/components/ItemWork";
import Markdown from "@/components/Markdown";
import { CompleteButton, ItemDueInfo } from "@/components/ProgressBits";
import Quiz from "@/components/Quiz";
import { ITEM_TYPE_LABELS, MODULES, SECTIONS, getModule, moduleNumber, type Module } from "@/content/course";
import { getItemMarkdown, getQuiz } from "@/lib/content";
import { formatDuration } from "@/lib/schedule";

type Props = PageProps<"/modul/[moduleId]/[itemId]">;

export function generateStaticParams() {
  return MODULES.flatMap((mod) => mod.items.map((item) => ({ moduleId: mod.id, itemId: item.id })));
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
  // Untuk item dengan tautan, note tampil di kartu tautan, bukan di atas.
  const showNoteAsBody = !markdown && !item.url && item.note;

  return (
    <article className="max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <li>
            <Link href={`/modul/${mod.id}`} className="font-semibold text-primary hover:underline">
              {moduleLabel(mod)}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>{SECTIONS.find((section) => section.id === item.section)?.label}</li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">{ITEM_TYPE_LABELS[item.type]}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl">{item.title}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
          <span>
            {ITEM_TYPE_LABELS[item.type]} · {formatDuration(item.minutes)}
          </span>
          <span aria-hidden="true">·</span>
          <ItemDueInfo item={item} />
        </p>
      </header>

      {markdown && <Markdown source={markdown} />}

      {showNoteAsBody && (
        <div className="materi">
          <p>{item.note}</p>
        </div>
      )}

      {!markdown && !quiz && (
        <p className="mt-6 rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-muted">
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

      {item.type === "project" && item.rubric && <RubricChecklist itemId={item.id} rubric={item.rubric} />}
      {item.type === "project" && <WorkLink itemId={item.id} />}
      {item.type === "wrap" && <ReflectionNote itemId={item.id} />}

      {item.type !== "quiz" && <CompleteButton itemId={item.id} />}

      <ItemPager itemId={item.id} />
    </article>
  );
}
