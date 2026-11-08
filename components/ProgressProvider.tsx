"use client";

// Progres belajar untuk seluruh aplikasi, tersinkron dengan Supabase.
// - Saat dimuat: ambil semua baris item_state dan settings milik pengguna sekali.
// - Setiap perubahan langsung tampil (optimistic), lalu di-upsert ke Supabase.
//   Catatan dan tautan memakai debounce sekitar 800 ms.
// - Jika penyimpanan gagal: status UI dikembalikan dan muncul pesan kecil.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getModule, type Item } from "@/content/course";
import { LOCKS_ENABLED, blockingQuizzes } from "@/lib/progress-rules";
import { todayString, type DateString } from "@/lib/schedule";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { DISPLAY_NAME } from "@/lib/user";

/** Satu baris item_state (tanpa user_id dan item_id). */
export interface ItemRow {
  completed_at: string | null;
  quiz: Record<string, unknown>;
  rubric: Record<string, boolean>;
  note: string | null;
  link: string | null;
}

export type ItemPatch = Partial<ItemRow>;

const EMPTY_ROW: ItemRow = { completed_at: null, quiz: {}, rubric: {}, note: null, link: null };
const SAVE_ERROR = "Gagal menyimpan. Periksa koneksi lalu coba lagi.";

interface ProgressValue {
  /** True setelah progres dari Supabase selesai dimuat. */
  ready: boolean;
  loadError: string | null;
  /** Tanggal hari ini di zona waktu perangkat. Null saat render di server. */
  today: DateString | null;
  completed: ReadonlySet<string>;
  /** item_id -> waktu selesai (ISO), untuk "Baru selesai". */
  completedAt: Readonly<Record<string, string>>;
  isCompleted: (itemId: string) => boolean;
  setCompleted: (itemId: string, done: boolean) => void;
  getItem: (itemId: string) => ItemRow | undefined;
  /** Optimistic update. Resolve true jika tersimpan, false jika gagal (status sudah dikembalikan). */
  updateItem: (itemId: string, patch: ItemPatch, options?: { debounceMs?: number }) => Promise<boolean>;
  displayName: string;
  email: string | null;
  setDisplayName: (name: string) => Promise<boolean>;
}

const ProgressContext = createContext<ProgressValue | null>(null);

const subscribeNever = () => () => {};

/** Tanggal hari ini hanya dibaca di browser, agar HTML statis tidak bergantung pada tanggal build. */
function useToday(): DateString | null {
  return useSyncExternalStore(subscribeNever, todayString, () => null);
}

interface Pending {
  patch: ItemPatch; // gabungan perubahan yang belum terkirim
  before: ItemRow; // status sebelum perubahan pertama, untuk dikembalikan jika gagal
  timer: ReturnType<typeof setTimeout> | null;
  resolvers: ((ok: boolean) => void)[];
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const today = useToday();
  const [rows, setRows] = useState<Record<string, ItemRow>>({});
  const rowsRef = useRef(rows);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayNameState] = useState(DISPLAY_NAME);
  const [toast, setToast] = useState<string | null>(null);
  const pending = useRef(new Map<string, Pending>());

  const commitRows = useCallback((next: Record<string, ItemRow>) => {
    rowsRef.current = next;
    setRows(next);
  }, []);

  // Muat progres sekali.
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Ditunda satu tick agar tidak memanggil setState langsung di dalam effect.
      const id = setTimeout(() => setLoadError("Supabase belum dikonfigurasi."), 0);
      return () => clearTimeout(id);
    }
    let cancelled = false;
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (cancelled) return;
      if (userError || !userData.user) {
        setLoadError("Sesi berakhir. Muat ulang halaman untuk masuk kembali.");
        return;
      }
      const [items, settings] = await Promise.all([
        supabase.from("item_state").select("item_id, completed_at, quiz, rubric, note, link"),
        supabase.from("settings").select("display_name").maybeSingle(),
      ]);
      if (cancelled) return;
      if (items.error || settings.error) {
        setLoadError("Gagal memuat progres. Periksa koneksi lalu muat ulang halaman.");
        return;
      }
      const loaded: Record<string, ItemRow> = {};
      for (const row of items.data) {
        loaded[row.item_id] = {
          completed_at: row.completed_at,
          quiz: row.quiz ?? {},
          rubric: row.rubric ?? {},
          note: row.note,
          link: row.link,
        };
      }
      userIdRef.current = userData.user.id;
      setUserId(userData.user.id);
      setEmail(userData.user.email ?? null);
      if (settings.data?.display_name) setDisplayNameState(settings.data.display_name);
      commitRows(loaded);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [commitRows]);

  // Pesan galat hilang sendiri setelah beberapa detik.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  const flush = useCallback(
    async (itemId: string) => {
      const entry = pending.current.get(itemId);
      if (!entry) return;
      pending.current.delete(itemId);
      if (entry.timer) clearTimeout(entry.timer);

      const { error } = await getSupabaseBrowserClient()
        .from("item_state")
        .upsert(
          { user_id: userIdRef.current, item_id: itemId, ...entry.patch, updated_at: new Date().toISOString() },
          { onConflict: "user_id,item_id" },
        );

      if (error) {
        // Kembalikan hanya kolom yang belum diubah lagi sejak percobaan ini.
        const current = rowsRef.current[itemId] ?? EMPTY_ROW;
        const reverted: ItemRow = { ...current };
        for (const key of Object.keys(entry.patch) as (keyof ItemRow)[]) {
          if (current[key] === entry.patch[key]) (reverted as unknown as Record<string, unknown>)[key] = entry.before[key];
        }
        commitRows({ ...rowsRef.current, [itemId]: reverted });
        setToast(SAVE_ERROR);
      }
      for (const resolve of entry.resolvers) resolve(!error);
    },
    [commitRows],
  );

  // Kirim perubahan yang masih menunggu sebelum halaman ditutup.
  useEffect(() => {
    const flushAll = () => {
      for (const itemId of [...pending.current.keys()]) void flush(itemId);
    };
    window.addEventListener("pagehide", flushAll);
    return () => window.removeEventListener("pagehide", flushAll);
  }, [flush]);

  const updateItem = useCallback(
    (itemId: string, patch: ItemPatch, options?: { debounceMs?: number }) => {
      if (!userIdRef.current) {
        setToast(SAVE_ERROR);
        return Promise.resolve(false);
      }
      const before = rowsRef.current[itemId] ?? EMPTY_ROW;
      commitRows({ ...rowsRef.current, [itemId]: { ...before, ...patch } });

      const entry = pending.current.get(itemId) ?? { patch: {}, before, timer: null, resolvers: [] };
      entry.patch = { ...entry.patch, ...patch };
      if (entry.timer) clearTimeout(entry.timer);
      pending.current.set(itemId, entry);

      return new Promise<boolean>((resolve) => {
        entry.resolvers.push(resolve);
        if (options?.debounceMs) {
          entry.timer = setTimeout(() => void flush(itemId), options.debounceMs);
        } else {
          entry.timer = null;
          void flush(itemId);
        }
      });
    },
    [commitRows, flush],
  );

  const setCompleted = useCallback(
    (itemId: string, done: boolean) => {
      const current = rowsRef.current[itemId]?.completed_at ?? null;
      if ((current !== null) === done) return;
      void updateItem(itemId, { completed_at: done ? new Date().toISOString() : null });
    },
    [updateItem],
  );

  const setDisplayName = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!userId || !trimmed) return false;
      const previous = displayName;
      setDisplayNameState(trimmed);
      const { error } = await getSupabaseBrowserClient()
        .from("settings")
        .upsert({ user_id: userId, display_name: trimmed, updated_at: new Date().toISOString() });
      if (error) {
        setDisplayNameState(previous);
        setToast(SAVE_ERROR);
        return false;
      }
      return true;
    },
    [userId, displayName],
  );

  const completedAt = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [id, row] of Object.entries(rows)) if (row.completed_at) map[id] = row.completed_at;
    return map;
  }, [rows]);
  const completed = useMemo(() => new Set(Object.keys(completedAt)), [completedAt]);

  const value = useMemo<ProgressValue>(
    () => ({
      ready,
      loadError,
      today,
      completed,
      completedAt,
      isCompleted: (itemId) => completed.has(itemId),
      setCompleted,
      getItem: (itemId) => rows[itemId],
      updateItem,
      displayName,
      email,
      setDisplayName,
    }),
    [ready, loadError, today, completed, completedAt, setCompleted, rows, updateItem, displayName, email, setDisplayName],
  );

  return (
    <ProgressContext value={value}>
      {loadError && (
        <p role="alert" className="bg-late px-4 py-2 text-center text-sm font-medium text-white">
          {loadError}
        </p>
      )}
      {children}
      {toast && (
        <div
          role="alert"
          className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-sm rounded-xl bg-text px-4 py-3 text-sm text-white shadow-lg md:bottom-6"
        >
          {toast}
        </div>
      )}
    </ProgressContext>
  );
}

export function useProgress(): ProgressValue {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress harus dipakai di dalam ProgressProvider");
  return value;
}

/** Status kunci sebuah modul. Selama progres dimuat, `ready` false dan `locked` belum pasti. */
export function useModuleLock(moduleId: string | undefined): { ready: boolean; locked: boolean; blocking: Item[] } {
  const { ready, completed } = useProgress();
  if (!LOCKS_ENABLED || !moduleId || !getModule(moduleId)) return { ready, locked: false, blocking: [] };
  const blocking = blockingQuizzes(moduleId, completed);
  return { ready, locked: ready && blocking.length > 0, blocking };
}
