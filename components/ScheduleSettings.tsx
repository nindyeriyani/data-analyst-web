"use client";

// Pengaturan jadwal belajar: tanggal mulai dan lama kursus. Semua tenggat dihitung dari sini.

import { useId, useState } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { COURSE_ITEMS, sumMinutes } from "@/content/course";
import {
  MAX_TOTAL_WEEKS,
  MIN_TOTAL_WEEKS,
  clampTotalWeeks,
  courseEndDate,
  formatLong,
  type DateString,
} from "@/lib/schedule";

const TOTAL_MINUTES = sumMinutes(COURSE_ITEMS);
const WEEK_OPTIONS = Array.from({ length: MAX_TOTAL_WEEKS - MIN_TOTAL_WEEKS + 1 }, (_, i) => MIN_TOTAL_WEEKS + i);

export default function ScheduleSettings() {
  const { ready, schedule, scheduleIsCustom, setSchedule } = useProgress();
  const [draftStart, setDraftStart] = useState<DateString | null>(null);
  const [draftWeeks, setDraftWeeks] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const startId = useId();
  const weeksId = useId();

  if (!schedule) {
    return <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">Memuat jadwal…</div>;
  }

  const start = draftStart ?? schedule.start;
  const weeks = draftWeeks ?? schedule.totalWeeks;
  const validStart = /^\d{4}-\d{2}-\d{2}$/.test(start);
  const end = validStart ? courseEndDate({ start, totalWeeks: weeks }) : null;
  const hoursPerWeek = Math.round((TOTAL_MINUTES / 60 / weeks) * 2) / 2;
  const changed = start !== schedule.start || weeks !== schedule.totalWeeks || !scheduleIsCustom;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validStart) return;
    setStatus("saving");
    const ok = await setSchedule(start, clampTotalWeeks(weeks));
    setStatus(ok ? "saved" : "idle");
    if (ok) {
      setDraftStart(null);
      setDraftWeeks(null);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="font-semibold text-text">Jadwal belajar</h2>
      <p className="mt-1 text-sm text-muted">
        Atur kapan mulai dan berapa lama Anda ingin menyelesaikan kursus. Semua tenggat, jadwal mingguan, dan hitung
        mundur menyesuaikan. Materi tetap bisa dipelajari dengan urutan apa pun.
      </p>
      {!scheduleIsCustom && (
        <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-sm text-muted">
          Saat ini memakai jadwal bawaan: mulai Senin minggu ini, {schedule.totalWeeks} minggu.
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={startId} className="mb-1.5 block text-sm font-medium text-text">
            Tanggal mulai
          </label>
          <input
            id={startId}
            type="date"
            value={start}
            disabled={!ready}
            required
            onChange={(e) => {
              setDraftStart(e.target.value);
              setStatus("idle");
            }}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-text focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor={weeksId} className="mb-1.5 block text-sm font-medium text-text">
            Lama kursus
          </label>
          <select
            id={weeksId}
            value={weeks}
            disabled={!ready}
            onChange={(e) => {
              setDraftWeeks(Number(e.target.value));
              setStatus("idle");
            }}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-text focus:border-primary"
          >
            {WEEK_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} minggu{n === 13 ? " (rencana awal)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-text">
        {end ? (
          <>
            Selesai <span className="font-semibold">{formatLong(end)}</span>, sekitar{" "}
            <span className="font-semibold">{String(hoursPerWeek).replace(".", ",")} jam per minggu</span>.
          </>
        ) : (
          "Pilih tanggal mulai."
        )}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!ready || !validStart || status === "saving" || !changed}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60"
        >
          {status === "saving" ? "Menyimpan…" : "Simpan jadwal"}
        </button>
        <p aria-live="polite" className="text-sm text-done">
          {status === "saved" ? "Jadwal tersimpan." : ""}
        </p>
      </div>
    </form>
  );
}
