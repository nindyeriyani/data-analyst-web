"use client";

// Progres belajar untuk seluruh aplikasi.
// Sampai tahap 8, progres hanya disimpan di memori: bertahan saat pindah halaman,
// hilang saat reload. Di tahap 8, bagian penyimpanan diganti dengan Supabase
// (ambil semua item_state sekali, lalu upsert setiap perubahan secara optimistic).

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { todayString, type DateString } from "@/lib/schedule";

interface ProgressValue {
  /** Tanggal hari ini di zona waktu perangkat. Null saat render di server. */
  today: DateString | null;
  completed: ReadonlySet<string>;
  isCompleted: (itemId: string) => boolean;
  setCompleted: (itemId: string, done: boolean) => void;
}

const ProgressContext = createContext<ProgressValue | null>(null);

const subscribeNever = () => () => {};

/** Tanggal hari ini hanya dibaca di browser, agar HTML statis tidak bergantung pada tanggal build. */
function useToday(): DateString | null {
  return useSyncExternalStore(subscribeNever, todayString, () => null);
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const today = useToday();
  // item_id -> completed_at (ISO). Bentuknya sama dengan kolom item_state.completed_at.
  const [completedAt, setCompletedAt] = useState<Record<string, string>>({});

  const completed = useMemo(() => new Set(Object.keys(completedAt)), [completedAt]);

  const setCompleted = useCallback((itemId: string, done: boolean) => {
    setCompletedAt((prev) => {
      if (done === itemId in prev) return prev;
      const next = { ...prev };
      if (done) next[itemId] = new Date().toISOString();
      else delete next[itemId];
      return next;
    });
  }, []);

  const value = useMemo<ProgressValue>(
    () => ({
      today,
      completed,
      isCompleted: (itemId) => completed.has(itemId),
      setCompleted,
    }),
    [today, completed, setCompleted],
  );

  return <ProgressContext value={value}>{children}</ProgressContext>;
}

export function useProgress(): ProgressValue {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress harus dipakai di dalam ProgressProvider");
  return value;
}
