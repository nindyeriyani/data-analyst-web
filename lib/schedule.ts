// Logika tanggal dan tenggat kursus.
//
// Semua tanggal disimpan sebagai teks "YYYY-MM-DD" (DateString) dan dibandingkan
// sebagai tanggal saja, tanpa jam. Format ini bisa dibandingkan langsung dengan
// < dan > karena urutan teksnya sama dengan urutan tanggal.
//
// "Hari ini" selalu diterima sebagai parameter. Hitung dengan todayString() hanya
// di Client Component, karena server Vercel memakai UTC sehingga tanggalnya bisa
// berbeda dengan zona waktu perangkat.

import type { Item } from "@/content/course";

export type DateString = string;

export const COURSE_START: DateString = "2026-11-09";
/** Akhir kursus utama (akhir minggu 12), target hitung mundur di dashboard. */
export const COURSE_END: DateString = "2027-01-31";
/** Minggu 13 adalah minggu ekstra dengan tenggat khusus. */
export const EXTRA_WEEK = 13;
export const EXTRA_WEEK_END: DateString = "2027-02-09";
export const TOTAL_WEEKS = 13;

const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const DAYS_LONG = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTHS_LONG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ---------------------------------------------------------------------------
// Konversi dasar

/** Ubah "YYYY-MM-DD" menjadi Date pada tengah malam waktu lokal. */
export function parseDate(value: DateString): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Ubah Date menjadi "YYYY-MM-DD" memakai tanggal lokal (bukan UTC). */
export function toDateString(date: Date): DateString {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Tanggal hari ini di zona waktu perangkat. Panggil hanya di Client Component. */
export function todayString(now: Date = new Date()): DateString {
  return toDateString(now);
}

export function addDays(value: DateString, days: number): DateString {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

/** Selisih hari dari `from` ke `to` (positif jika `to` setelah `from`). */
export function daysBetween(from: DateString, to: DateString): number {
  const ms = parseDate(to).getTime() - parseDate(from).getTime();
  // Dibulatkan agar aman dari pergeseran jam musim panas di sebagian zona waktu.
  return Math.round(ms / 86_400_000);
}

// ---------------------------------------------------------------------------
// Minggu dan tenggat

/** Senin awal minggu ke-n. */
export function weekStart(week: number): DateString {
  return addDays(COURSE_START, 7 * (week - 1));
}

/** Hari terakhir minggu ke-n: hari Minggu, kecuali minggu 13 yang berakhir 9 Februari 2027. */
export function weekEnd(week: number): DateString {
  if (week === EXTRA_WEEK) return EXTRA_WEEK_END;
  return addDays(COURSE_START, 7 * week - 1);
}

export function itemDueDate(item: Pick<Item, "week">): DateString {
  return weekEnd(item.week);
}

/**
 * Minggu yang sedang berjalan.
 * 0 = kursus belum mulai, 1–13 = minggu kursus, 14 = kursus sudah selesai.
 */
export function currentWeek(today: DateString): number {
  if (today < COURSE_START) return 0;
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    if (today <= weekEnd(week)) return week;
  }
  return TOTAL_WEEKS + 1;
}

/** Minggu yang ditampilkan di bagian "Minggu ini": minggu 1 sebelum kursus mulai. */
export function displayWeek(today: DateString): number {
  return Math.min(Math.max(currentWeek(today), 1), TOTAL_WEEKS);
}

/** Item tertinggal: belum selesai dan tenggatnya sebelum hari ini. */
export function isOverdue(item: Pick<Item, "week">, today: DateString, completed: boolean): boolean {
  return !completed && itemDueDate(item) < today;
}

export function daysUntil(target: DateString, today: DateString): number {
  return daysBetween(today, target);
}

// ---------------------------------------------------------------------------
// Format tanggal Indonesia

/** "Min, 15 Nov" */
export function formatShort(value: DateString): string {
  const date = parseDate(value);
  return `${DAYS_SHORT[date.getDay()]}, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** "Minggu, 15 November 2026" */
export function formatLong(value: DateString): string {
  const date = parseDate(value);
  return `${DAYS_LONG[date.getDay()]}, ${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

/** "15 Nov" */
export function formatDayMonth(value: DateString): string {
  const date = parseDate(value);
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** "9–15 Nov", atau "23 Nov–6 Des" jika berbeda bulan. */
export function formatRange(start: DateString, end: DateString): string {
  const s = parseDate(start);
  const e = parseDate(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.getDate()} ${MONTHS_SHORT[e.getMonth()]}`;
  }
  return `${formatDayMonth(start)}–${formatDayMonth(end)}`;
}

/** Rentang tanggal satu minggu kursus, misalnya "9–15 Nov". */
export function formatWeekRange(week: number): string {
  return formatRange(weekStart(week), weekEnd(week));
}

/** Rentang tanggal beberapa minggu, misalnya modul m2: "23 Nov–6 Des". */
export function formatWeeksRange(weeks: [number, number]): string {
  return formatRange(weekStart(weeks[0]), weekEnd(weeks[1]));
}

/** "≈ 9,5 jam" dari jumlah menit. */
export function formatHours(minutes: number): string {
  const hours = Math.round((minutes / 60) * 2) / 2;
  // Koma desimal ditulis manual agar hasil server dan browser selalu sama.
  return `≈ ${String(hours).replace(".", ",")} jam`;
}

/** Durasi item: "15 menit", "2 jam", "1 jam 30 menit". */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} menit`;
  return rest === 0 ? `${hours} jam` : `${hours} jam ${rest} menit`;
}
