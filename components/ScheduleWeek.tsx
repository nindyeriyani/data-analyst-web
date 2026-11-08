"use client";

// Bagian interaktif kartu minggu di halaman jadwal: sorotan minggu berjalan,
// gulir otomatis ke minggu itu, dan ringkasan progres minggu.

import { useEffect, useRef, type ReactNode } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { itemsByWeek } from "@/content/course";
import { itemStatus } from "@/lib/progress-rules";
import { currentWeek, displayWeek } from "@/lib/schedule";

export function WeekFrame({ week, children }: { week: number; children: ReactNode }) {
  const { today } = useProgress();
  const ref = useRef<HTMLElement>(null);
  const scrolled = useRef(false);

  const started = today !== null && currentWeek(today) >= 1;
  const highlighted = today !== null && displayWeek(today) === week && currentWeek(today) <= week;
  const label = started ? "Minggu ini" : "Minggu pertama";

  // Gulir ke minggu berjalan sekali, hanya jika kursus sudah dimulai.
  useEffect(() => {
    if (highlighted && started && !scrolled.current) {
      scrolled.current = true;
      ref.current?.scrollIntoView({ block: "start" });
    }
  }, [highlighted, started]);

  return (
    <section
      ref={ref}
      id={`minggu-${week}`}
      aria-labelledby={`minggu-${week}-judul`}
      aria-current={highlighted && started ? "date" : undefined}
      className={`scroll-mt-20 rounded-2xl border bg-surface ${
        highlighted ? "border-primary ring-2 ring-primary/20" : "border-line"
      }`}
    >
      {highlighted && (
        <p className="rounded-t-2xl bg-primary px-5 py-1.5 text-sm font-semibold text-on-primary">{label}</p>
      )}
      {children}
    </section>
  );
}

export function WeekProgress({ week }: { week: number }) {
  const { completed, today } = useProgress();
  const items = itemsByWeek(week);
  const done = items.filter((item) => completed.has(item.id)).length;
  const late = items.filter((item) => itemStatus(item, completed, today) === "late").length;

  return (
    <span className="text-sm">
      <span className={done === items.length ? "font-semibold text-done" : "text-muted"}>
        {done} dari {items.length} selesai
      </span>
      {late > 0 && <span className="ml-2 font-semibold text-late">· {late} tertinggal</span>}
    </span>
  );
}
