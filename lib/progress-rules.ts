// Aturan progres yang tidak bergantung pada tempat data disimpan.
//
// Penguncian modul: sebuah modul terkunci jika ada kuis di modul sebelumnya
// yang belum lulus dengan nilai sempurna. Modul tanpa kuis tidak menambah syarat.
// Dipasang di halaman item, modul, dashboard, dan jadwal pada tahap 8,
// setelah status lulus kuis tersimpan di Supabase.

import { MODULES, type Item, type Module } from "@/content/course";
import { isOverdue, type DateString } from "@/lib/schedule";

/** Jumlah soal per percobaan kuis. Nilai lulus adalah semua soal benar. */
export const QUESTIONS_PER_ATTEMPT = 5;

/** Kuis di semua modul sebelum moduleId, urut kursus. */
export function quizzesBefore(moduleId: string): Item[] {
  const index = MODULES.findIndex((m) => m.id === moduleId);
  if (index <= 0) return [];
  return MODULES.slice(0, index).flatMap((m) => m.items.filter((item) => item.type === "quiz"));
}

/** Kuis yang belum lulus dan membuat moduleId terkunci. Kosong berarti modul terbuka. */
export function blockingQuizzes(moduleId: string, passedQuizIds: ReadonlySet<string>): Item[] {
  return quizzesBefore(moduleId).filter((quiz) => !passedQuizIds.has(quiz.id));
}

export function isModuleLocked(moduleId: string, passedQuizIds: ReadonlySet<string>): boolean {
  return blockingQuizzes(moduleId, passedQuizIds).length > 0;
}

// ---------------------------------------------------------------------------
// Status item dan modul

export type ItemStatus = "done" | "late" | "todo";

/** Selesai, tertinggal (tenggat sebelum hari ini), atau belum. today null = belum diketahui. */
export function itemStatus(
  item: Pick<Item, "id" | "week">,
  completed: ReadonlySet<string>,
  today: DateString | null,
): ItemStatus {
  const done = completed.has(item.id);
  if (done) return "done";
  return today !== null && isOverdue(item, today, false) ? "late" : "todo";
}

export function moduleProgress(mod: Module, completed: ReadonlySet<string>) {
  const done = mod.items.filter((item) => completed.has(item.id)).length;
  return { done, total: mod.items.length };
}

export type ModuleStatus = "not-started" | "in-progress" | "done" | "late";

export const MODULE_STATUS_LABELS: Record<ModuleStatus, string> = {
  "not-started": "Belum mulai",
  "in-progress": "Berjalan",
  done: "Selesai",
  late: "Tertinggal",
};

export function moduleStatus(
  mod: Module,
  completed: ReadonlySet<string>,
  today: DateString | null,
): ModuleStatus {
  const { done, total } = moduleProgress(mod, completed);
  if (done === total) return "done";
  if (mod.items.some((item) => itemStatus(item, completed, today) === "late")) return "late";
  return done === 0 ? "not-started" : "in-progress";
}

/** Item pertama yang belum selesai, dalam urutan yang diberikan. */
export function nextItem(items: Item[], completed: ReadonlySet<string>): Item | undefined {
  return items.find((item) => !completed.has(item.id));
}
