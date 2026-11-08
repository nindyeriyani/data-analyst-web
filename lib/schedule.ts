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

/** Banyak minggu dalam rencana kursus di content/course.ts (12 minggu + 1 minggu ekstra). */
export const COURSE_WEEKS = 13;
/** Pilihan lama kursus yang bisa diatur pengguna, dalam minggu. */
export const DEFAULT_TOTAL_WEEKS = 13;
export const MIN_TOTAL_WEEKS = 8;
export const MAX_TOTAL_WEEKS = 26;

/** Jadwal milik pengguna: tanggal mulai dan lama kursus. */
export interface Schedule {
  start: DateString;
  totalWeeks: number;
}

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
// Jadwal pengguna
//
// Pengguna memilih tanggal mulai dan lama kursus (N minggu). Minggu kalender ke-k
// dimulai start + 7(k−1) hari dan berakhir start + 7k − 1 hari. Minggu kursus w
// (1–13, dari course.ts) dipetakan ke minggu kalender round(w × N / 13), sehingga
// rencana 13 minggu diregangkan atau dipadatkan secara merata.

/** Senin di minggu yang sama dengan tanggal ini. */
export function mondayOf(value: DateString): DateString {
  const day = parseDate(value).getDay(); // 0 = Minggu
  return addDays(value, day === 0 ? -6 : 1 - day);
}

/** Jadwal bawaan sebelum pengguna mengatur sendiri: mulai Senin minggu ini, 13 minggu. */
export function defaultSchedule(today: DateString): Schedule {
  return { start: mondayOf(today), totalWeeks: DEFAULT_TOTAL_WEEKS };
}

export function clampTotalWeeks(weeks: number): number {
  if (!Number.isFinite(weeks)) return DEFAULT_TOTAL_WEEKS;
  return Math.min(MAX_TOTAL_WEEKS, Math.max(MIN_TOTAL_WEEKS, Math.round(weeks)));
}

/** Minggu kalender tempat tenggat minggu kursus w jatuh. */
export function calendarWeekOf(schedule: Schedule, courseWeek: number): number {
  return Math.max(1, Math.round((courseWeek * schedule.totalWeeks) / COURSE_WEEKS));
}

/** Rentang minggu kalender untuk rentang minggu kursus [a, b], misalnya minggu sebuah modul. */
export function calendarWeekSpan(schedule: Schedule, [first, last]: [number, number]): [number, number] {
  const end = calendarWeekOf(schedule, last);
  const startOfFirst = first <= 1 ? 1 : calendarWeekOf(schedule, first - 1) + 1;
  return [Math.min(startOfFirst, calendarWeekOf(schedule, first)), end];
}

/** Hari pertama minggu kalender ke-k. */
export function weekStart(schedule: Schedule, week: number): DateString {
  return addDays(schedule.start, 7 * (week - 1));
}

/** Hari terakhir minggu kalender ke-k. */
export function weekEnd(schedule: Schedule, week: number): DateString {
  return addDays(schedule.start, 7 * week - 1);
}

/** Minggu kalender tenggat sebuah item. */
export function itemDueWeek(schedule: Schedule, item: Pick<Item, "week">): number {
  return calendarWeekOf(schedule, item.week);
}

export function itemDueDate(schedule: Schedule, item: Pick<Item, "week">): DateString {
  return weekEnd(schedule, itemDueWeek(schedule, item));
}

/** Hari terakhir kursus, target hitung mundur di dashboard. */
export function courseEndDate(schedule: Schedule): DateString {
  return weekEnd(schedule, schedule.totalWeeks);
}

/**
 * Minggu kalender yang sedang berjalan.
 * 0 = belum mulai, 1–N = minggu kursus, N + 1 = kursus sudah selesai.
 */
export function currentWeek(schedule: Schedule, today: DateString): number {
  if (today < schedule.start) return 0;
  const week = Math.floor(daysBetween(schedule.start, today) / 7) + 1;
  return Math.min(week, schedule.totalWeeks + 1);
}

/** Minggu yang ditampilkan di bagian "Minggu ini": minggu 1 sebelum mulai, minggu terakhir sesudah selesai. */
export function displayWeek(schedule: Schedule, today: DateString): number {
  return Math.min(Math.max(currentWeek(schedule, today), 1), schedule.totalWeeks);
}

/** Item tertinggal: belum selesai dan tenggatnya sebelum hari ini. */
export function isOverdue(schedule: Schedule, item: Pick<Item, "week">, today: DateString, completed: boolean): boolean {
  return !completed && itemDueDate(schedule, item) < today;
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

/** Rentang tanggal satu minggu kalender, misalnya "9–15 Nov". */
export function formatWeekRange(schedule: Schedule, week: number): string {
  return formatRange(weekStart(schedule, week), weekEnd(schedule, week));
}

/** Rentang tanggal beberapa minggu kalender, misalnya "23 Nov–6 Des". */
export function formatSpanRange(schedule: Schedule, [first, last]: [number, number]): string {
  return formatRange(weekStart(schedule, first), weekEnd(schedule, last));
}

/** "Minggu 3" atau "Minggu 3–4". */
export function formatWeekLabel([first, last]: [number, number]): string {
  return first === last ? `Minggu ${first}` : `Minggu ${first}–${last}`;
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
