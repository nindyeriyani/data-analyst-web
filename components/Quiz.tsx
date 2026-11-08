"use client";

// Kuis dengan bank soal. Setiap percobaan mengambil beberapa soal acak, soal yang
// belum pernah muncul diutamakan. Setiap soal hanya bisa dijawab sekali, dan
// kuis lulus jika semua soal dalam satu percobaan dijawab benar.

import { useRef, useState } from "react";
import { useProgress } from "@/components/ProgressProvider";
import type { QuizQuestion } from "@/lib/content";
import { QUESTIONS_PER_ATTEMPT } from "@/lib/progress-rules";

/**
 * Status kuis, disimpan di kolom item_state.quiz.
 * Semua indeks soal mengacu ke urutan di file JSON, indeks jawaban ke urutan asli options.
 */
export interface QuizState {
  questions: number[]; // soal percobaan saat ini, urut tampil
  optionOrder: Record<string, number[]>; // urutan tampil pilihan per soal
  answers: Record<string, number>; // indeks soal -> indeks pilihan yang dijawab
  seen: number[]; // soal yang pernah muncul, paling lama di depan
}

const EMPTY_STATE: QuizState = { questions: [], optionOrder: {}, answers: {}, seen: [] };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

/** Pilih soal untuk percobaan baru: soal yang belum muncul dulu, lalu yang paling lama. */
function drawQuestions(poolSize: number, seen: number[], count: number): number[] {
  const validSeen = seen.filter((i) => i < poolSize);
  const seenSet = new Set(validSeen);
  const picked = shuffle(range(poolSize).filter((i) => !seenSet.has(i))).slice(0, count);
  for (const index of validSeen) {
    if (picked.length >= count) break;
    if (!picked.includes(index)) picked.push(index);
  }
  return shuffle(picked);
}

function newAttempt(pool: QuizQuestion[], previous: QuizState): QuizState {
  const count = Math.min(QUESTIONS_PER_ATTEMPT, pool.length);
  const questions = drawQuestions(pool.length, previous.seen, count);
  const optionOrder = Object.fromEntries(
    questions.map((q) => [q, shuffle(range(pool[q].options.length))]),
  );
  const seen = [...previous.seen.filter((i) => !questions.includes(i) && i < pool.length), ...questions];
  return { questions, optionOrder, answers: {}, seen };
}

type OptionState = "idle" | "correct" | "wrong" | "reveal" | "locked";

const OPTION_STYLES: Record<OptionState, string> = {
  idle: "border-line bg-bg text-text hover:border-primary hover:bg-primary-soft",
  correct: "border-done bg-done/10 text-text",
  wrong: "border-late bg-late/10 text-text",
  reveal: "border-done border-dashed bg-surface text-text",
  locked: "border-line bg-bg text-muted",
};

/** Status tersimpan yang valid untuk bank soal ini, atau status kosong. */
function parseQuizState(raw: unknown, poolSize: number): QuizState {
  if (!raw || typeof raw !== "object") return EMPTY_STATE;
  const r = raw as Partial<QuizState>;
  const isIndexList = (v: unknown): v is number[] =>
    Array.isArray(v) && v.every((i) => Number.isInteger(i) && i >= 0 && i < poolSize);
  if (!isIndexList(r.questions) || !isIndexList(r.seen ?? [])) return EMPTY_STATE;
  return {
    questions: r.questions,
    optionOrder: r.optionOrder && typeof r.optionOrder === "object" ? r.optionOrder : {},
    answers: r.answers && typeof r.answers === "object" ? r.answers : {},
    seen: r.seen ?? [],
  };
}

export default function Quiz({ itemId, questions }: { itemId: string; questions: QuizQuestion[] }) {
  const { ready, getItem } = useProgress();
  if (!ready) {
    return (
      <section aria-busy="true" className="my-8 rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
        Memuat kuis…
      </section>
    );
  }
  return <QuizBody itemId={itemId} pool={questions} initial={parseQuizState(getItem(itemId)?.quiz, questions.length)} />;
}

function QuizBody({ itemId, pool, initial }: { itemId: string; pool: QuizQuestion[]; initial: QuizState }) {
  const { isCompleted, updateItem } = useProgress();
  const passed = isCompleted(itemId);
  const [state, setState] = useState<QuizState>(initial);
  const [announcement, setAnnouncement] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  const total = state.questions.length;
  const started = total > 0;
  const answered = state.questions.filter((q) => state.answers[q] !== undefined).length;
  const correct = state.questions.filter((q) => state.answers[q] === pool[q].answer).length;
  const finished = started && answered === total;
  const perfect = finished && correct === total;
  const attemptSize = Math.min(QUESTIONS_PER_ATTEMPT, pool.length);

  // Status terbaru, dibaca oleh handler. Beberapa klik dalam satu render
  // (misalnya ketukan cepat) tidak boleh saling menimpa.
  const latest = useRef<QuizState>(state);

  // Satu-satunya tempat status kuis berubah: tampil langsung, lalu disimpan ke
  // item_state.quiz. Kuis yang lulus sekaligus menandai item selesai.
  // Jika penyimpanan gagal, status dikembalikan (pesan galat dari ProgressProvider).
  function updateState(next: QuizState, passedNow = false) {
    const previous = latest.current;
    latest.current = next;
    setState(next);
    const patch = passedNow ? { quiz: { ...next }, completed_at: new Date().toISOString() } : { quiz: { ...next } };
    void updateItem(itemId, patch).then((ok) => {
      if (!ok && latest.current === next) {
        latest.current = previous;
        setState(previous);
      }
    });
  }

  function start() {
    updateState(newAttempt(pool, latest.current));
    setAnnouncement(`Percobaan baru dimulai dengan ${attemptSize} soal.`);
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start" });
  }

  function choose(questionIndex: number, optionIndex: number) {
    const current = latest.current;
    if (current.answers[questionIndex] !== undefined) return;

    const answers: QuizState["answers"] = { ...current.answers, [questionIndex]: optionIndex };
    const count = current.questions.length;
    const doneCount = current.questions.filter((q) => answers[q] !== undefined).length;
    const score = current.questions.filter((q) => answers[q] === pool[q].answer).length;
    const finishedNow = doneCount === count;
    // Lulus sekali sudah cukup; latihan ulang tidak mengubah waktu selesai.
    updateState({ ...current, answers }, finishedNow && score === count && !passed);

    const question = pool[questionIndex];
    const position = current.questions.indexOf(questionIndex) + 1;
    const isRight = optionIndex === question.answer;
    let message = isRight
      ? `Soal ${position} benar.`
      : `Soal ${position} salah. Jawaban yang benar: ${question.options[question.answer]}.`;

    if (finishedNow) {
      if (score === count) {
        message += ` Percobaan selesai. Nilai ${score} dari ${count}. Kuis lulus.`;
      } else {
        message += ` Percobaan selesai. Nilai ${score} dari ${count}. Perlu nilai sempurna untuk lulus.`;
      }
    }
    setAnnouncement(message);
  }

  return (
    <section aria-labelledby="kuis-judul" className="my-8 scroll-mt-20">
      <div className="mb-5 rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="kuis-judul" ref={headingRef} tabIndex={-1} className="text-lg font-semibold text-text">
            Kuis
          </h2>
          {started && (
            <p className="text-sm text-muted">
              Terjawab <span className="font-semibold text-text">{answered}</span> dari {total}
              {" · "}
              <span className="font-semibold text-text">{correct}</span> benar
            </p>
          )}
          {!started && passed && <p className="text-sm font-semibold text-done">Sudah lulus</p>}
        </div>

        {started ? (
          <div
            role="progressbar"
            aria-label="Soal terjawab"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={answered}
            aria-valuetext={`${answered} dari ${total} soal terjawab`}
            className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${Math.round((answered / total) * 100)}%` }}
            />
          </div>
        ) : (
          <>
            <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted">
              <li>{attemptSize} soal diambil acak dari bank {pool.length} soal.</li>
              <li>Setiap soal hanya bisa dijawab sekali.</li>
              <li>Nilai lulus {attemptSize}/{attemptSize}. Kuis ditandai selesai setelah lulus.</li>
            </ul>
            <button
              type="button"
              onClick={start}
              className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Mulai kuis
            </button>
          </>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {started && (
        <ol className="space-y-4">
          {state.questions.map((qIndex, position) => {
            const question = pool[qIndex];
            const chosen = state.answers[qIndex];
            const isAnswered = chosen !== undefined;
            const isRight = chosen === question.answer;
            const order = state.optionOrder[qIndex] ?? range(question.options.length);

            return (
              <li key={qIndex} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
                <fieldset>
                  <legend className="mb-4 flex gap-2 font-bold leading-relaxed text-text">
                    <span className="text-primary">{position + 1}.</span>
                    <span>{question.question}</span>
                  </legend>

                  <div className="grid gap-2">
                    {order.map((oIndex) => {
                      const optionState: OptionState = !isAnswered
                        ? "idle"
                        : oIndex === chosen
                          ? isRight
                            ? "correct"
                            : "wrong"
                          : oIndex === question.answer
                            ? "reveal"
                            : "locked";

                      return (
                        <button
                          key={oIndex}
                          type="button"
                          onClick={() => choose(qIndex, oIndex)}
                          disabled={isAnswered}
                          aria-pressed={oIndex === chosen}
                          className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left leading-relaxed transition-colors disabled:cursor-default ${OPTION_STYLES[optionState]}`}
                        >
                          <span className="min-w-0 flex-1">{question.options[oIndex]}</span>
                          {(optionState === "correct" || optionState === "reveal" || optionState === "wrong") && (
                            <span
                              aria-hidden="true"
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                                optionState === "wrong"
                                  ? "bg-late text-white"
                                  : optionState === "correct"
                                    ? "bg-done text-white"
                                    : "border-2 border-done text-done"
                              }`}
                            >
                              {optionState === "wrong" ? "✕" : "✓"}
                            </span>
                          )}
                          {optionState === "correct" && <span className="sr-only">(jawaban Anda, benar)</span>}
                          {optionState === "wrong" && <span className="sr-only">(jawaban Anda, salah)</span>}
                          {optionState === "reveal" && <span className="sr-only">(jawaban yang benar)</span>}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {isAnswered && (
                  <p className="mt-3 rounded-xl bg-surface-2 px-4 py-3 text-sm leading-relaxed text-text">
                    {isRight ? (
                      <strong className="font-bold text-done">Benar.</strong>
                    ) : (
                      <>
                        <strong className="font-bold text-late">Belum tepat.</strong> Jawaban yang benar: “
                        {question.options[question.answer]}”.
                      </>
                    )}{" "}
                    {question.explanation}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {finished && (
        <div
          className={`mt-5 rounded-2xl border p-5 ${
            perfect ? "border-done/50 bg-done/10" : "border-late/50 bg-late/10"
          }`}
        >
          <p className={`font-semibold ${perfect ? "text-done" : "text-late"}`}>
            {perfect ? `Kuis lulus. Nilai ${correct}/${total}.` : `Nilai ${correct}/${total}.`}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text">
            {perfect
              ? "Kuis ini sudah ditandai selesai. Anda tetap bisa berlatih lagi dengan soal lain."
              : `Perlu ${total}/${total} agar kuis ini selesai. Pelajari penjelasan di atas, lalu coba lagi dengan soal baru.`}
          </p>
          <button
            type="button"
            onClick={start}
            className={
              perfect
                ? "mt-4 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
                : "mt-4 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            }
          >
            {perfect ? "Latihan lagi dengan soal lain" : "Ulangi dengan soal baru"}
          </button>
        </div>
      )}
    </section>
  );
}
