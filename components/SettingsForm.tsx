"use client";

import { useId, useState } from "react";
import { useProgress } from "@/components/ProgressProvider";

export default function SettingsForm() {
  const { ready, displayName, email, setDisplayName } = useProgress();
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const inputId = useId();
  const value = draft ?? displayName;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!value.trim()) return;
    setStatus("saving");
    const ok = await setDisplayName(value);
    setStatus(ok ? "saved" : "idle");
    if (ok) setDraft(null);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-5">
      <label htmlFor={inputId} className="font-semibold text-text">
        Nama panggilan
      </label>
      <p className="mt-1 text-sm text-muted">Dipakai untuk sapaan di dashboard dan inisial di header.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          value={value}
          disabled={!ready}
          maxLength={40}
          required
          onChange={(e) => {
            setDraft(e.target.value);
            setStatus("idle");
          }}
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-text focus:border-primary"
        />
        <button
          type="submit"
          disabled={!ready || status === "saving" || !value.trim()}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60"
        >
          {status === "saving" ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 text-sm text-done">
        {status === "saved" ? "Nama tersimpan." : ""}
      </p>
      <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
        Masuk sebagai <span className="font-medium text-text">{email ?? "…"}</span>
      </p>
    </form>
  );
}
