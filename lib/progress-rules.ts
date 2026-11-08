// Aturan progres yang tidak bergantung pada tempat data disimpan.
// Semua modul terbuka: pengguna bebas belajar berurutan maupun tidak.
// Tanggal (tenggat, minggu berjalan) dihitung dari jadwal milik pengguna (lib/schedule.ts).

import {
  BADGE_ITEMS,
  COURSE_ITEMS,
  allItems,
  getItem,
  getModule,
  sumMinutes,
  type Item,
  type Module,
} from "@/content/course";
import { isOverdue, itemDueWeek, weekEnd, type DateString, type Schedule } from "@/lib/schedule";

/** Jumlah soal per percobaan kuis. Nilai lulus adalah semua soal benar. */
export const QUESTIONS_PER_ATTEMPT = 5;

// ---------------------------------------------------------------------------
// Status item dan modul

export type ItemStatus = "done" | "late" | "todo";

/** Selesai, tertinggal (tenggat sebelum hari ini), atau belum. today/schedule null = belum diketahui. */
export function itemStatus(
  item: Pick<Item, "id" | "week">,
  completed: ReadonlySet<string>,
  today: DateString | null,
  schedule: Schedule | null,
): ItemStatus {
  if (completed.has(item.id)) return "done";
  return today !== null && schedule !== null && isOverdue(schedule, item, today, false) ? "late" : "todo";
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
  schedule: Schedule | null,
): ModuleStatus {
  const { done, total } = moduleProgress(mod, completed);
  if (done === total) return "done";
  if (mod.items.some((item) => itemStatus(item, completed, today, schedule) === "late")) return "late";
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

export function lateItems(completed: ReadonlySet<string>, today: DateString | null, schedule: Schedule | null): Item[] {
  return COURSE_ITEMS.filter((item) => itemStatus(item, completed, today, schedule) === "late");
}

/** Item yang tenggatnya jatuh di minggu kalender ke-week. */
export function itemsDueInWeek(schedule: Schedule, week: number): Item[] {
  return COURSE_ITEMS.filter((item) => itemDueWeek(schedule, item) === week);
}

export type CourseStatus =
  | { kind: "not-started" }
  | { kind: "on-track" }
  | { kind: "late"; count: number };

export function courseStatus(
  completed: ReadonlySet<string>,
  today: DateString | null,
  schedule: Schedule | null,
): CourseStatus {
  const late = lateItems(completed, today, schedule).length;
  if (late > 0) return { kind: "late", count: late };
  return completed.size === 0 ? { kind: "not-started" } : { kind: "on-track" };
}

/** Total menit dan menit selesai per minggu kalender, untuk grafik mingguan. */
export function weeklyMinutes(completed: ReadonlySet<string>, schedule: Schedule) {
  return Array.from({ length: schedule.totalWeeks }, (_, i) => {
    const week = i + 1;
    const items = itemsDueInWeek(schedule, week);
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
  today: DateString,
  schedule: Schedule,
): { date: DateString; week: number; remaining: number } | null {
  for (let week = 1; week <= schedule.totalWeeks; week++) {
    const date = weekEnd(schedule, week);
    if (date < today) continue;
    const remaining = itemsDueInWeek(schedule, week).filter((item) => !completed.has(item.id)).length;
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
