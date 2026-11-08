"use client";

// Potongan UI kecil yang membaca progres: kotak centang, bulatan status,
// bilah progres modul, label tenggat, tombol lanjutkan, dan tombol tandai selesai.

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { getModule, type Item } from "@/content/course";
import { itemStatus, moduleProgress, nextItem } from "@/lib/progress-rules";
import {
  calendarWeekSpan,
  formatShort,
  formatSpanRange,
  itemDueDate,
  itemDueWeek,
  weekEnd,
} from "@/lib/schedule";

type ItemRef = Pick<Item, "id" | "title" | "type" | "week">;

export function ItemCheckbox({ item }: { item: ItemRef }) {
  const { ready, isCompleted, setCompleted } = useProgress();
  const done = isCompleted(item.id);
  const isQuiz = item.type === "quiz";

  return (
    // Label membesarkan area sentuh menjadi 44px di HP tanpa menggeser tata letak.
    <label className="-m-3 flex shrink-0 cursor-pointer items-center justify-center p-3 has-disabled:cursor-not-allowed">
      <input
        type="checkbox"
        checked={done}
        disabled={isQuiz || !ready}
        onChange={(e) => setCompleted(item.id, e.target.checked)}
        aria-label={`${done ? "Selesai" : "Tandai selesai"}: ${item.title}`}
        title={isQuiz ? "Selesai otomatis saat kuis lulus dengan nilai sempurna" : undefined}
        className="size-5 shrink-0 cursor-pointer accent-[var(--done)] disabled:cursor-not-allowed"
      />
    </label>
  );
}

export function ItemStatusDot({ item }: { item: Pick<Item, "id" | "week"> }) {
  const { completed, today, schedule } = useProgress();
  const status = itemStatus(item, completed, today, schedule);

  if (status === "done") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-done text-[0.65rem] font-bold text-white">
        <span aria-hidden="true">✓</span>
        <span className="sr-only">Selesai</span>
      </span>
    );
  }
  if (status === "late") {
    return (
      <span className="block size-5 shrink-0 rounded-full border-2 border-late bg-late/10">
        <span className="sr-only">Tertinggal</span>
      </span>
    );
  }
  return (
    <span className="block size-5 shrink-0 rounded-full border-2 border-muted/60">
      <span className="sr-only">Belum selesai</span>
    </span>
  );
}

export function ItemDueLabel({ item, prefix = false }: { item: Pick<Item, "id" | "week">; prefix?: boolean }) {
  const { completed, today, schedule } = useProgress();
  if (!schedule) return <span className="text-muted">…</span>;
  const late = itemStatus(item, completed, today, schedule) === "late";
  const due = itemDueDate(schedule, item);
  return (
    <time dateTime={due} className={late ? "font-medium text-late" : "text-muted"}>
      {late ? `Tertinggal · ${formatShort(due)}` : `${prefix ? "Tenggat " : ""}${formatShort(due)}`}
    </time>
  );
}

/** Bilah progres dan ringkasan di kepala modul (di atas latar gradasi fase). */
export function ModuleHeaderProgress({ moduleId, hours }: { moduleId: string; hours: string }) {
  const { completed, schedule } = useProgress();
  const mod = getModule(moduleId);
  if (!mod) return null;
  const { done, total } = moduleProgress(mod, completed);
  const percent = Math.round((done / total) * 100);
  const due = schedule ? weekEnd(schedule, calendarWeekSpan(schedule, mod.weeks)[1]) : null;

  return (
    <div>
      <div
        role="progressbar"
        aria-label="Progres modul"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={`${done} dari ${total} item selesai`}
        className="h-2 max-w-md overflow-hidden rounded-full bg-on-phase/30"
      >
        <div
          className="h-full rounded-full bg-on-phase transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-3 text-sm font-bold">
        {done} dari {total} selesai · {hours}
        {due && (
          <>
            {" "}
            · tenggat <time dateTime={due}>{formatShort(due)} {due.slice(0, 4)}</time>
          </>
        )}
      </p>
    </div>
  );
}

/** "minggu 3–4 · 23 Nov–6 Des" sesuai jadwal pengguna. */
export function ModuleSchedule({ weeks }: { weeks: [number, number] }) {
  const { schedule } = useProgress();
  if (!schedule) return <>minggu …</>;
  const span = calendarWeekSpan(schedule, weeks);
  const label = span[0] === span[1] ? `minggu ${span[0]}` : `minggu ${span[0]}–${span[1]}`;
  return (
    <>
      {label} · {formatSpanRange(schedule, span)}
    </>
  );
}

export function ContinueButton({ moduleId }: { moduleId: string }) {
  const { completed } = useProgress();
  const mod = getModule(moduleId);
  if (!mod) return null;

  const next = nextItem(mod.items, completed);
  const started = mod.items.some((item) => completed.has(item.id));
  const target = next ?? mod.items[0];
  const label = !next
    ? "Modul selesai · ulas dari awal"
    : started
      ? `Lanjutkan: ${next.title}`
      : `Mulai modul: ${next.title}`;

  return (
    <Link
      href={`/modul/${mod.id}/${target.id}`}
      className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover sm:text-base"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" className="shrink-0">
        <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
      </svg>
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function CompleteButton({ itemId }: { itemId: string }) {
  const { ready, isCompleted, setCompleted } = useProgress();
  const done = isCompleted(itemId);

  return (
    <div className="my-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-5">
      {done ? (
        <>
          <p className="flex items-center gap-2 font-semibold text-done">
            <span
              aria-hidden="true"
              className="flex size-6 items-center justify-center rounded-full bg-done text-xs text-white"
            >
              ✓
            </span>
            Selesai
          </p>
          <button
            type="button"
            onClick={() => setCompleted(itemId, false)}
            disabled={!ready}
            className="ml-auto disabled:opacity-60 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
          >
            Batalkan selesai
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted">Sudah benar-benar dikerjakan?</p>
          <button
            type="button"
            onClick={() => setCompleted(itemId, true)}
            disabled={!ready}
            className="ml-auto disabled:opacity-60 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            Tandai selesai
          </button>
        </>
      )}
    </div>
  );
}

/** "Tenggat Min, 6 Des 2026 · minggu 3", untuk kepala halaman item. */
export function ItemDueInfo({ item }: { item: Pick<Item, "id" | "week"> }) {
  const { completed, today, schedule } = useProgress();
  if (!schedule) return <span>Tenggat …</span>;
  const due = itemDueDate(schedule, item);
  const late = itemStatus(item, completed, today, schedule) === "late";
  return (
    <span className={late ? "font-medium text-late" : undefined}>
      {late ? "Tertinggal · tenggat" : "Tenggat"}{" "}
      <time dateTime={due}>
        {formatShort(due)} {due.slice(0, 4)}
      </time>{" "}
      · minggu {itemDueWeek(schedule, item)}
    </span>
  );
}
