// Membaca isi materi dan soal kuis dari folder content/. Hanya dipakai di server.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getItem } from "@/content/course";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // indeks opsi yang benar
  explanation: string;
}

// Path ditulis literal per folder agar Turbopack hanya menyertakan folder
// content/items dan content/quizzes saat deploy, bukan seluruh proyek.
// Hanya id yang terdaftar di course.ts yang boleh dipakai sebagai nama file.

/** Isi markdown materi item, atau null jika belum ada file materinya. */
export function getItemMarkdown(itemId: string): string | null {
  if (!getItem(itemId)) return null;
  const path = join(process.cwd(), "content", "items", `${itemId}.md`);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

/** Soal kuis item, atau null jika belum ada file kuisnya. */
export function getQuiz(itemId: string): QuizQuestion[] | null {
  if (!getItem(itemId)) return null;
  const path = join(process.cwd(), "content", "quizzes", `${itemId}.json`);
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as QuizQuestion[]) : null;
}
