"use client";

import { useProgress } from "@/components/ProgressProvider";
import { COURSE_ITEMS, sumMinutes } from "@/content/course";

/** Hitungan jam per minggu, dibulatkan ke 0,5 jam: "4,5". */
export function hoursPerWeek(totalWeeks: number): string {
  const hours = Math.round((sumMinutes(COURSE_ITEMS) / 60 / totalWeeks) * 2) / 2;
  return String(hours).replace(".", ",");
}

/** Baris kecil di bawah judul aplikasi: lama kursus dan beban per minggu. */
export function HeaderSubtitle() {
  const { ready, schedule } = useProgress();
  if (!ready || !schedule) return <>Kursus pribadi</>;
  return (
    <>
      Kursus pribadi · {schedule.totalWeeks} minggu · ≈{hoursPerWeek(schedule.totalWeeks)} jam/minggu
    </>
  );
}

/** Penanda sinkronisasi dengan Supabase. */
export function SyncStatus() {
  const { ready, saving, loadError } = useProgress();
  const state = loadError
    ? { dot: "bg-late", label: "Tidak tersambung" }
    : !ready
      ? { dot: "bg-muted/50", label: "Memuat…" }
      : saving
        ? { dot: "bg-primary animate-pulse", label: "Menyimpan…" }
        : { dot: "bg-muted", label: "Tersimpan" };

  return (
    <p role="status" className="hidden items-center gap-2 text-sm text-muted sm:flex">
      <span aria-hidden="true" className={`size-2 rounded-full ${state.dot}`} />
      {state.label}
    </p>
  );
}
