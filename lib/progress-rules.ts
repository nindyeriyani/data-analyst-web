// Aturan progres yang tidak bergantung pada tempat data disimpan.
//
// Penguncian modul: sebuah modul terkunci jika ada kuis di modul sebelumnya
// yang belum lulus dengan nilai sempurna. Modul tanpa kuis tidak menambah syarat.
// Dipasang di halaman item, modul, dashboard, dan jadwal pada tahap 8,
// setelah status lulus kuis tersimpan di Supabase.

import {
  BADGE_ITEMS,
  COURSE_ITEMS,
  MODULES,
  allItems,
  getItem,
  getModule,
  itemsByWeek,
  sumMinutes,
  type Item,
  type Module,
} from "@/content/course";
import { COURSE_START, TOTAL_WEEKS, isOverdue, weekEnd, type DateString } from "@/lib/schedule";

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

// ---------------------------------------------------------------------------
// Ringkasan untuk dashboard

/** Item pertama yang belum selesai, urut tenggat lalu urutan kursus. */
export function nextDueItem(completed: ReadonlySet<string>): Item | undefined {
  return nextItem(allItems(), completed);
}

export function lateItems(completed: ReadonlySet<string>, today: DateString | null): Item[] {
  return COURSE_ITEMS.filter((item) => itemStatus(item, completed, today) === "late");
}

export type CourseStatus =
  | { kind: "not-started" }
  | { kind: "on-track" }
  | { kind: "late"; count: number };

export function courseStatus(completed: ReadonlySet<string>, today: DateString | null): CourseStatus {
  const late = lateItems(completed, today).length;
  if (late > 0) return { kind: "late", count: late };
  return completed.size === 0 ? { kind: "not-started" } : { kind: "on-track" };
}

/** Total menit dan menit selesai per minggu, untuk grafik 13 minggu. */
export function weeklyMinutes(completed: ReadonlySet<string>) {
  return Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const week = i + 1;
    const items = itemsByWeek(week);
    return {
      week,
      total: sumMinutes(items),
      done: sumMinutes(items.filter((item) => completed.has(item.id))),
      itemCount: items.length,
      doneCount: items.filter((item) => completed.has(item.id)).length,
    };
  });
}

/** Tenggat terdekat (hari ini atau sesudahnya) yang masih punya item belum selesai. */
export function nearestDeadline(
  completed: ReadonlySet<string>,
  today: DateString | null,
): { date: DateString; week: number; remaining: number } | null {
  const reference = today ?? COURSE_START;
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    const date = weekEnd(week);
    if (date < reference) continue;
    const remaining = itemsByWeek(week).filter((item) => !completed.has(item.id)).length;
    if (remaining > 0) return { date, week, remaining };
  }
  return null;
}

export interface Badge {
  id: keyof typeof BADGE_ITEMS;
  label: string;
  requirement: string;
  earned: boolean;
}

export function badges(completed: ReadonlySet<string>): Badge[] {
  const firstModule = getModule(BADGE_ITEMS.firstModule);
  const itemBadge = (id: Exclude<Badge["id"], "firstModule">, label: string): Badge => {
    const item = getItem(BADGE_ITEMS[id]);
    return {
      id,
      label,
      requirement: `Selesaikan “${item?.title ?? BADGE_ITEMS[id]}”`,
      earned: completed.has(BADGE_ITEMS[id]),
    };
  };
  return [
    {
      id: "firstModule",
      label: "Modul pertama",
      requirement: `Selesaikan semua item “${firstModule?.title ?? "modul 0"}”`,
      earned: firstModule ? moduleProgress(firstModule, completed).done === firstModule.items.length : false,
    },
    itemBadge("sql", "SQL tuntas"),
    itemBadge("python", "Python tuntas"),
    itemBadge("firstPortfolio", "Proyek portofolio pertama"),
    itemBadge("portfolioOnline", "Portofolio online"),
    itemBadge("firstApplication", "Lamaran pertama"),
  ];
}
