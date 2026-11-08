// Aturan progres yang tidak bergantung pada tempat data disimpan.
//
// Penguncian modul: sebuah modul terkunci jika ada kuis di modul sebelumnya
// yang belum lulus dengan nilai sempurna. Modul tanpa kuis tidak menambah syarat.
// Dipasang di halaman item, modul, dashboard, dan jadwal pada tahap 8,
// setelah status lulus kuis tersimpan di Supabase.

import { MODULES, type Item } from "@/content/course";

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
