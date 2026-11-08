"use client";

// Potongan UI kecil yang membaca progres: kotak centang, bulatan status,
// bilah progres modul, label tenggat, tombol lanjutkan, dan tombol tandai selesai.

import Link from "next/link";
import { useModuleLock, useProgress } from "@/components/ProgressProvider";
import { getModule, getModuleOfItem, type Item } from "@/content/course";
import { itemStatus, moduleProgress, nextItem } from "@/lib/progress-rules";
import { formatShort, itemDueDate } from "@/lib/schedule";

type ItemRef = Pick<Item, "id" | "title" | "type" | "week">;

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export { LockIcon };

export function ItemCheckbox({ item }: { item: ItemRef }) {
  const { ready, isCompleted, setCompleted } = useProgress();
  const { locked } = useModuleLock(getModuleOfItem(item.id)?.id);
  const done = isCompleted(item.id);
  const isQuiz = item.type === "quiz";

  return (
    <input
      type="checkbox"
      checked={done}
      disabled={isQuiz || !ready || locked}
      onChange={(e) => setCompleted(item.id, e.target.checked)}
      aria-label={`${done ? "Selesai" : "Tandai selesai"}: ${item.title}${locked ? " (modul terkunci)" : ""}`}
      title={
        locked
          ? "Modul ini masih terkunci"
          : isQuiz
            ? "Selesai otomatis saat kuis lulus dengan nilai sempurna"
            : undefined
      }
      className="size-5 shrink-0 cursor-pointer accent-[var(--done)] disabled:cursor-not-allowed"
    />
  );
}

export function ItemStatusDot({ item }: { item: Pick<Item, "id" | "week"> }) {
  const { completed, today } = useProgress();
  const { locked } = useModuleLock(getModuleOfItem(item.id)?.id);
  const status = itemStatus(item, completed, today);

  if (locked) {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center text-muted">
        <LockIcon size={13} />
        <span className="sr-only">Terkunci</span>
      </span>
    );
  }

  if (status === "done") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-done text-[0.6rem] font-bold text-white">
        <span aria-hidden="true">✓</span>
        <span className="sr-only">Selesai</span>
      </span>
    );
  }
  if (status === "late") {
    return (
      <span className="size-4 shrink-0 rounded-full border-2 border-late bg-late/15">
        <span className="sr-only">Tertinggal</span>
      </span>
    );
  }
  return (
    <span className="size-4 shrink-0 rounded-full border-2 border-line">
      <span className="sr-only">Belum selesai</span>
    </span>
  );
}

export function ItemDueLabel({ item }: { item: Pick<Item, "id" | "week"> }) {
  const { completed, today } = useProgress();
  const late = itemStatus(item, completed, today) === "late";
  const due = itemDueDate(item);
  return (
    <time dateTime={due} className={late ? "font-medium text-late" : "text-muted"}>
      {late ? `Tertinggal · ${formatShort(due)}` : formatShort(due)}
    </time>
  );
}

export function ModuleProgressBar({ moduleId, onPhase = false }: { moduleId: string; onPhase?: boolean }) {
  const { completed } = useProgress();
  const mod = getModule(moduleId);
  if (!mod) return null;
  const { done, total } = moduleProgress(mod, completed);
  const percent = Math.round((done / total) * 100);

  return (
    <div>
      <div
        role="progressbar"
        aria-label="Progres modul"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={`${done} dari ${total} item selesai`}
        className={`h-2 overflow-hidden rounded-full ${onPhase ? "bg-white/25" : "bg-surface-2"}`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${onPhase ? "bg-white" : "bg-done"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className={`mt-2 text-sm ${onPhase ? "text-on-phase/90" : "text-muted"}`}>
        <span className="font-semibold">{done}</span> dari {total} selesai
      </p>
    </div>
  );
}

export function ContinueButton({ moduleId }: { moduleId: string }) {
  const { completed } = useProgress();
  const mod = getModule(moduleId);
  if (!mod) return null;

  const next = nextItem(mod.items, completed);
  const started = mod.items.some((item) => completed.has(item.id));
  const target = next ?? mod.items[0];
  const label = !next ? "Modul selesai · ulas dari awal" : started ? `Lanjutkan: ${next.title}` : "Mulai modul";

  return (
    <Link
      href={`/modul/${mod.id}/${target.id}`}
      className="inline-flex max-w-full items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
    >
      <span className="truncate">{label}</span>
      <span aria-hidden="true">→</span>
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
            className="ml-auto disabled:opacity-60 rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
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
            className="ml-auto disabled:opacity-60 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            Tandai selesai
          </button>
        </>
      )}
    </div>
  );
}
