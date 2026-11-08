"use client";

// Grafik batang 13 minggu: tinggi kolom = total menit rencana, bagian bawah yang
// terisi = menit item yang selesai. Satu ukuran (menit), satu sumbu.

import { useState } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { weeklyMinutes } from "@/lib/progress-rules";
import { currentWeek, formatDayMonth, formatDuration, formatWeekRange, weekStart, type Schedule } from "@/lib/schedule";

const PLOT_HEIGHT = 168; // px

/** Jarak tick dan batas atas sumbu (jam), agar batas atas selalu jatuh di tick. */
function axisScale(maxMinutes: number): { step: number; max: number } {
  const hours = maxMinutes / 60;
  const step = hours <= 6 ? 2 : hours <= 15 ? 5 : 10;
  return { step, max: Math.max(step, Math.ceil(hours / step) * step) };
}

function weekName(week: number): string {
  return `Minggu ${week}`;
}

export default function WeeklyChart() {
  const { completed, today, schedule } = useProgress();
  const weeks = schedule ? weeklyMinutes(completed, schedule) : [];
  const active = today === null || schedule === null ? 0 : currentWeek(schedule, today);
  const [hovered, setHovered] = useState<number | null>(null);

  const { step, max: maxHours } = axisScale(Math.max(...weeks.map((w) => w.total)));
  const maxMinutes = maxHours * 60;
  const ticks = Array.from({ length: Math.floor(maxHours / step) + 1 }, (_, i) => i * step);

  return (
    <section aria-labelledby="grafik-judul" className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h2 id="grafik-judul" className="font-semibold text-text">
            Jam belajar per minggu
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tinggi batang adalah total rencana, bagian bawahnya yang sudah selesai.
          </p>
        </div>
        <ul className="flex gap-4 text-sm text-muted" aria-label="Legenda">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[3px] bg-primary" />
            Selesai
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[3px] bg-primary/20" />
            Belum selesai
          </li>
        </ul>
      </div>

      <div className="mt-6 flex gap-2">
        {/* Sumbu y dalam jam */}
        <div
          aria-hidden="true"
          className="relative w-7 shrink-0 text-right text-xs tabular-nums text-muted"
          style={{ height: PLOT_HEIGHT }}
        >
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0"
              style={{ bottom: `${(t / maxHours) * 100}%`, transform: "translateY(50%)" }}
            >
              {t}j
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* Garis bantu di belakang kolom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{ height: PLOT_HEIGHT }}
          >
            {ticks.map((t) => (
              <div
                key={t}
                className={`absolute inset-x-0 h-px ${t === 0 ? "bg-text/25" : "bg-line"}`}
                style={{ bottom: `${(t / maxHours) * 100}%` }}
              />
            ))}
          </div>

          <ol className="relative flex gap-[2px]" aria-label="Jam belajar per minggu">
            {weeks.map((w, i) => {
              const isCurrent = w.week === active;
              const remaining = w.total - w.done;
              const heightPct = (w.total / maxMinutes) * 100;
              const doneShare = w.total === 0 ? 0 : (w.done / w.total) * 100;
              const align = i < 2 ? "left-0" : i > weeks.length - 3 ? "right-0" : "left-1/2 -translate-x-1/2";
              const description = `${weekName(w.week)}, ${formatWeekRange(schedule as Schedule, w.week)}${isCurrent ? ", minggu ini" : ""}: ${formatDuration(w.done)} selesai dari ${formatDuration(w.total)}, ${w.doneCount} dari ${w.itemCount} item.`;

              return (
                <li key={w.week} className="relative flex min-w-0 flex-1 flex-col items-center">
                  <button
                    type="button"
                    aria-label={description}
                    onMouseEnter={() => setHovered(w.week)}
                    onMouseLeave={() => setHovered((h) => (h === w.week ? null : h))}
                    onFocus={() => setHovered(w.week)}
                    onBlur={() => setHovered((h) => (h === w.week ? null : h))}
                    className="group flex w-full cursor-default flex-col items-center justify-end rounded-md focus-visible:outline-offset-0"
                    style={{ height: PLOT_HEIGHT }}
                  >
                    <span
                      className="flex w-full max-w-6 flex-col gap-[2px] overflow-hidden rounded-t-[4px] transition-opacity group-hover:opacity-90"
                      style={{ height: `${heightPct}%` }}
                    >
                      {remaining > 0 && <span className="w-full flex-1 bg-primary/20" />}
                      {w.done > 0 && (
                        <span
                          className="w-full shrink-0 bg-primary transition-[height] duration-300"
                          style={{ height: remaining > 0 ? `calc(${doneShare}% - 1px)` : "100%" }}
                        />
                      )}
                    </span>
                  </button>

                  {/* Label sumbu x */}
                  <span
                    className={`mt-2 text-xs tabular-nums ${isCurrent ? "font-semibold text-text" : "text-muted"}`}
                    aria-hidden="true"
                  >
                    {/* Untuk jadwal panjang, label ditampilkan selang-seling agar tidak bertumpuk di HP. */}
                    {weeks.length <= 13 || w.week % 2 === 1 || isCurrent ? w.week : ""}
                  </span>
                  <span aria-hidden="true" className="hidden text-[0.65rem] leading-tight text-muted xl:block">
                    {formatDayMonth(weekStart(schedule as Schedule, w.week))}
                  </span>
                  {isCurrent && <span aria-hidden="true" className="mt-1 h-1 w-4 rounded-full bg-text" />}

                  {hovered === w.week && (
                    <div
                      role="tooltip"
                      className={`pointer-events-none absolute bottom-full z-10 mb-1 w-48 rounded-lg border border-line bg-surface p-3 text-left text-xs shadow-lg ${align}`}
                    >
                      <p className="font-semibold text-text">
                        {weekName(w.week)}
                        {isCurrent && " · minggu ini"}
                      </p>
                      <p className="text-muted">{formatWeekRange(schedule as Schedule, w.week)}</p>
                      <p className="mt-2 flex items-center gap-2 text-text">
                        <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-primary" />
                        {formatDuration(w.done)} selesai
                      </p>
                      <p className="flex items-center gap-2 text-text">
                        <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-primary/20" />
                        {formatDuration(w.total)} rencana
                      </p>
                      <p className="mt-1 text-muted">
                        {w.doneCount} dari {w.itemCount} item
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {schedule && active >= 1 && active <= schedule.totalWeeks && (
        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span aria-hidden="true" className="h-1 w-4 rounded-full bg-text" />
          Minggu ini
        </p>
      )}

      {/* Tabel tidak mematuhi lebar 1px dari sr-only, jadi dibungkus div. */}
      <div className="sr-only">
        <table>
          <caption>Jam belajar per minggu</caption>
          <thead>
            <tr>
              <th scope="col">Minggu</th>
              <th scope="col">Tanggal</th>
              <th scope="col">Selesai</th>
              <th scope="col">Rencana</th>
              <th scope="col">Item selesai</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.week}>
                <th scope="row">{weekName(w.week)}</th>
                <td>{formatWeekRange(schedule as Schedule, w.week)}</td>
                <td>{formatDuration(w.done)}</td>
                <td>{formatDuration(w.total)}</td>
                <td>
                  {w.doneCount} dari {w.itemCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
