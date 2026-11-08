// Pemeriksa konten kursus. Jalankan dengan: npm run check:content
// Memakai type stripping bawaan Node 22, tanpa dependensi tambahan.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { MODULES, SECTIONS, COURSE_ITEMS, BADGE_ITEMS, sumMinutes } from "../content/course.ts";
import { TOTAL_WEEKS, formatHours, formatShort, formatWeekRange, weekEnd } from "../lib/schedule.ts";

const ROOT = join(import.meta.dirname, "..");
const ITEMS_DIR = join(ROOT, "content", "items");
const QUIZZES_DIR = join(ROOT, "content", "quizzes");

const errors: string[] = [];
const warnings: string[] = [];
const QUIZ_BANK_SIZE = 15; // 5 soal per percobaan, cukup untuk 3 percobaan berbeda
const sectionIndex = new Map(SECTIONS.map((s, i) => [s.id, i]));

// --- Struktur modul dan item -------------------------------------------------

const seen = new Set<string>();
for (const mod of MODULES) {
  const [firstWeek, lastWeek] = mod.weeks;
  if (firstWeek > lastWeek) errors.push(`${mod.id}: weeks terbalik`);
  if (mod.objectives.length === 0) errors.push(`${mod.id}: objectives kosong`);

  let prevKey = -1;
  for (const item of mod.items) {
    const where = `${mod.id} › ${item.id}`;
    if (seen.has(item.id)) errors.push(`${where}: id duplikat`);
    seen.add(item.id);

    if (!item.id.startsWith(`${mod.id}-`)) errors.push(`${where}: id harus diawali "${mod.id}-"`);
    if (!/^[a-z0-9-]+$/.test(item.id)) errors.push(`${where}: id hanya boleh huruf kecil, angka, dan tanda hubung`);
    if (item.week < firstWeek || item.week > lastWeek) {
      errors.push(`${where}: week ${item.week} di luar rentang modul ${firstWeek}–${lastWeek}`);
    }
    if (!Number.isInteger(item.minutes) || item.minutes <= 0) errors.push(`${where}: minutes harus bilangan bulat positif`);
    if (item.type === "course" && !item.url) errors.push(`${where}: item course wajib punya url`);
    if (item.type === "project" && !item.rubric?.length) errors.push(`${where}: item project wajib punya rubric`);
    if (item.url && !item.url.startsWith("https://")) errors.push(`${where}: url harus https`);

    // Urutan di dalam modul: minggu dulu, lalu bagian (mulai, pelajari, latihan, uji).
    const key = item.week * 10 + (sectionIndex.get(item.section) ?? 0);
    if (key < prevKey) warnings.push(`${where}: urutan tidak sesuai minggu atau bagian`);
    prevKey = Math.max(prevKey, key);

    const hasMarkdown = existsSync(join(ITEMS_DIR, `${item.id}.md`));
    const hasQuiz = existsSync(join(QUIZZES_DIR, `${item.id}.json`));
    if (item.type === "quiz" && !hasQuiz) warnings.push(`${where}: soal kuis belum ada`);
    if (item.type !== "quiz" && !hasMarkdown && !item.note && !item.url) {
      warnings.push(`${where}: belum ada materi, note, maupun url`);
    }
  }
}

for (const [badge, id] of Object.entries(BADGE_ITEMS)) {
  if (!seen.has(id) && !MODULES.some((m) => m.id === id)) errors.push(`badge ${badge}: "${id}" tidak ditemukan`);
}

// --- File materi dan kuis -----------------------------------------------------

for (const file of readdirSync(ITEMS_DIR).filter((f) => f.endsWith(".md"))) {
  const id = file.replace(/\.md$/, "");
  if (!seen.has(id)) errors.push(`content/items/${file}: tidak ada item dengan id "${id}"`);
}

for (const file of readdirSync(QUIZZES_DIR).filter((f) => f.endsWith(".json"))) {
  const id = file.replace(/\.json$/, "");
  const where = `content/quizzes/${file}`;
  const item = COURSE_ITEMS.find((i) => i.id === id);
  if (!item) errors.push(`${where}: tidak ada item dengan id "${id}"`);
  else if (item.type !== "quiz") errors.push(`${where}: item "${id}" bukan bertipe quiz`);

  let questions: unknown;
  try {
    questions = JSON.parse(readFileSync(join(QUIZZES_DIR, file), "utf8"));
  } catch (e) {
    errors.push(`${where}: JSON tidak valid (${(e as Error).message})`);
    continue;
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push(`${where}: harus berupa array soal yang tidak kosong`);
    continue;
  }
  questions.forEach((q, i) => {
    const n = `${where} soal ${i + 1}`;
    if (typeof q?.question !== "string" || !q.question) errors.push(`${n}: question kosong`);
    if (!Array.isArray(q?.options) || q.options.length < 2) errors.push(`${n}: options minimal 2`);
    else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      errors.push(`${n}: answer harus indeks options yang valid`);
    }
    if (typeof q?.explanation !== "string" || !q.explanation) errors.push(`${n}: explanation kosong`);
  });
  if (questions.length < QUIZ_BANK_SIZE) {
    warnings.push(`${where}: bank soal baru ${questions.length}, target ${QUIZ_BANK_SIZE}`);
  }
}

// --- Ringkasan per minggu ------------------------------------------------------

console.log("Ringkasan per minggu\n");
console.log("Mg  Tanggal         Tenggat        Item  Waktu");
for (let week = 1; week <= TOTAL_WEEKS; week++) {
  const items = COURSE_ITEMS.filter((i) => i.week === week);
  console.log(
    [
      String(week).padEnd(3),
      formatWeekRange(week).padEnd(15),
      formatShort(weekEnd(week)).padEnd(14),
      String(items.length).padStart(4),
      ` ${formatHours(sumMinutes(items))}`,
    ].join(" "),
  );
}
console.log(`\nTotal: ${COURSE_ITEMS.length} item, ${formatHours(sumMinutes(COURSE_ITEMS))}, ${MODULES.length} modul.`);

const withMarkdown = COURSE_ITEMS.filter((i) => existsSync(join(ITEMS_DIR, `${i.id}.md`))).length;
const quizzes = COURSE_ITEMS.filter((i) => i.type === "quiz");
const withQuiz = quizzes.filter((i) => existsSync(join(QUIZZES_DIR, `${i.id}.json`))).length;
console.log(`Materi tersedia: ${withMarkdown} dari ${COURSE_ITEMS.length} item. Soal kuis: ${withQuiz} dari ${quizzes.length} kuis.`);

if (warnings.length) {
  console.log(`\nPeringatan (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.error(`\nKesalahan (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("\nKonten valid.");
