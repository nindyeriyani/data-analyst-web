"use client";

// Bagian halaman item yang menyimpan isian: rubrik proyek, tautan hasil kerja, dan catatan refleksi.

import { useId, useRef, useState } from "react";
import { useProgress } from "@/components/ProgressProvider";

type SaveStatus = "idle" | "saving" | "saved" | "failed";

const STATUS_TEXT: Record<SaveStatus, string> = {
  idle: "",
  saving: "Menyimpan…",
  saved: "Tersimpan",
  failed: "Gagal menyimpan",
};

function SaveIndicator({ status }: { status: SaveStatus }) {
  return (
    <span aria-live="polite" className={`text-xs ${status === "failed" ? "text-late" : "text-muted"}`}>
      {STATUS_TEXT[status]}
    </span>
  );
}

/** Menjalankan simpan dan melacak status; hanya hasil simpan terakhir yang ditampilkan. */
function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const latest = useRef(0);
  function track(save: Promise<boolean>) {
    const id = ++latest.current;
    setStatus("saving");
    void save.then((ok) => {
      if (id === latest.current) setStatus(ok ? "saved" : "failed");
    });
  }
  return { status, track };
}

export function RubricChecklist({ itemId, rubric }: { itemId: string; rubric: string[] }) {
  const { ready, getItem, updateItem } = useProgress();
  const checked = getItem(itemId)?.rubric ?? {};
  const done = rubric.filter((_, i) => checked[i]).length;

  function toggle(index: number, value: boolean) {
    const next = { ...checked };
    if (value) next[index] = true;
    else delete next[index];
    void updateItem(itemId, { rubric: next });
  }

  return (
    <section aria-labelledby="rubrik" className="my-8 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="rubrik" className="font-semibold text-text">
          Rubrik
        </h2>
        <span className="text-sm text-muted">
          {done} dari {rubric.length}
        </span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {rubric.map((criterion, i) => (
          <li key={criterion}>
            <label className="flex cursor-pointer gap-3 leading-relaxed text-text">
              <input
                type="checkbox"
                checked={Boolean(checked[i])}
                disabled={!ready}
                onChange={(e) => toggle(i, e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-[var(--done)]"
              />
              {criterion}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function WorkLink({ itemId }: { itemId: string }) {
  const { ready, getItem, updateItem } = useProgress();
  const saved = getItem(itemId)?.link ?? "";
  const [draft, setDraft] = useState<string | null>(null); // null = ikuti nilai tersimpan
  const value = draft ?? saved;
  const { status, track } = useSaveStatus();
  const inputId = useId();
  const trimmed = value.trim();
  const invalid = trimmed !== "" && !isValidUrl(trimmed);

  function save() {
    if (invalid || trimmed === saved) return;
    track(updateItem(itemId, { link: trimmed || null }));
    setDraft(null);
  }

  return (
    <section className="my-8 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={inputId} className="font-semibold text-text">
          Tautan hasil kerja
        </label>
        <SaveIndicator status={status} />
      </div>
      <p className="mt-1 text-sm text-muted">Misalnya repositori GitHub, notebook Colab, atau dashboard Tableau Public.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          type="url"
          inputMode="url"
          value={value}
          disabled={!ready}
          placeholder="https://"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
          }}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${inputId}-error` : undefined}
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-text placeholder:text-muted focus:border-primary aria-[invalid=true]:border-late"
        />
        {saved && !draft && isValidUrl(saved) && (
          <a
            href={saved}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-medium text-text hover:border-primary hover:text-primary"
          >
            Buka
            <span className="sr-only"> tautan hasil kerja (membuka tab baru)</span>
          </a>
        )}
      </div>
      {invalid && (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-late">
          Tautan harus diawali https:// atau http://.
        </p>
      )}
    </section>
  );
}

export function ReflectionNote({ itemId }: { itemId: string }) {
  const { ready, getItem, updateItem } = useProgress();
  const saved = getItem(itemId)?.note ?? "";
  const [draft, setDraft] = useState<string | null>(null);
  const { status, track } = useSaveStatus();
  const inputId = useId();

  function change(text: string) {
    setDraft(text);
    track(updateItem(itemId, { note: text === "" ? null : text }, { debounceMs: 800 }));
  }

  return (
    <section className="my-8 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={inputId} className="font-semibold text-text">
          Catatan refleksi
        </label>
        <SaveIndicator status={status} />
      </div>
      <p className="mt-1 text-sm text-muted">Tersimpan otomatis saat Anda mengetik. Tulis dengan kata-kata sendiri.</p>
      <textarea
        id={inputId}
        value={draft ?? saved}
        disabled={!ready}
        onChange={(e) => change(e.target.value)}
        rows={8}
        className="mt-3 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 leading-relaxed text-text placeholder:text-muted focus:border-primary"
        placeholder={ready ? "Tulis catatan Anda di sini…" : "Memuat…"}
      />
    </section>
  );
}
