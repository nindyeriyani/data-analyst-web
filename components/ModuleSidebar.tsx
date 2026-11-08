"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, type MouseEvent } from "react";
import { ItemStatusDot } from "@/components/ProgressBits";
import { useProgress } from "@/components/ProgressProvider";
import {
  ITEM_TYPE_LABELS,
  MODULES,
  SECTIONS,
  itemsBySection,
  moduleNumber,
  type Item,
  type Module,
} from "@/content/course";
import { moduleProgress } from "@/lib/progress-rules";
import { calendarWeekSpan, formatDayMonth, formatDuration, formatSpanRange, itemDueDate } from "@/lib/schedule";

function moduleLabel(mod: Module): string {
  const n = moduleNumber(mod);
  return n === null ? `Ekstra · ${mod.title}` : `Modul ${n} · ${mod.title}`;
}

/** "Minggu 3–4 · 23 Nov–6 Des · 2/11" */
function ModuleMeta({ mod }: { mod: Module }) {
  const { completed, schedule } = useProgress();
  const { done, total } = moduleProgress(mod, completed);
  let dates = "";
  if (schedule) {
    const [a, b] = calendarWeekSpan(schedule, mod.weeks);
    dates = `${a === b ? `Minggu ${a}` : `Minggu ${a}–${b}`} · ${formatSpanRange(schedule, [a, b])} · `;
  }
  return (
    <span className="mt-1 block text-xs text-muted">
      {dates}
      <span className="tabular-nums">
        {done}/{total}
      </span>
    </span>
  );
}

/** "Bacaan · 15 menit · tenggat 17 Jan" */
function ItemMeta({ item }: { item: Item }) {
  const { schedule } = useProgress();
  return (
    <span className="mt-0.5 block text-xs font-normal text-muted">
      {ITEM_TYPE_LABELS[item.type]} · {formatDuration(item.minutes)}
      {schedule && <> · tenggat {formatDayMonth(itemDueDate(schedule, item))}</>}
    </span>
  );
}

/**
 * Pohon modul dan item. `pathname` null dipakai sebagai fallback Suspense:
 * modul aktif tetap terbuka, tetapi item aktif belum disorot.
 */
function SidebarTree({ pathname, activeModuleId }: { pathname: string | null; activeModuleId: string }) {
  return (
    <ul>
      {MODULES.map((mod) => {
        const isActiveModule = mod.id === activeModuleId;
        const moduleHref = `/modul/${mod.id}`;

        return (
          <li key={mod.id} className="border-b border-line">
            <details open={isActiveModule} className="group/mod">
              <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-4 hover:bg-surface-2/60 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-snug text-text">{moduleLabel(mod)}</span>
                  <ModuleMeta mod={mod} />
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-muted transition-transform group-open/mod:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>

              <div className="pb-3">
                <Link
                  href={moduleHref}
                  aria-current={pathname === moduleHref ? "page" : undefined}
                  className={`block border-l-4 px-7 py-2 text-sm font-semibold ${
                    pathname === moduleHref
                      ? "border-primary bg-primary-soft text-text"
                      : "border-transparent text-primary hover:bg-surface-2/60"
                  }`}
                >
                  Ringkasan modul
                </Link>

                {SECTIONS.map((section) => {
                  const items = itemsBySection(mod, section.id);
                  if (items.length === 0) return null;
                  return (
                    <div key={section.id} className="mt-3">
                      <p className="px-8 py-1 text-xs font-bold tracking-wide text-muted">{section.label}</p>
                      <ul>
                        {items.map((item) => {
                          const href = `${moduleHref}/${item.id}`;
                          const active = pathname === href;
                          return (
                            <li key={item.id}>
                              <Link
                                href={href}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-start gap-3 border-l-4 py-2.5 pl-7 pr-5 text-sm leading-snug ${
                                  active
                                    ? "border-primary bg-primary-soft text-text"
                                    : "border-transparent text-text hover:bg-surface-2/60"
                                }`}
                              >
                                <span className="mt-px">
                                  <ItemStatusDot item={item} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  {item.title}
                                  <ItemMeta item={item} />
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarTreeWithPath({ activeModuleId }: { activeModuleId: string }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Gulir item aktif ke dalam tampilan sidebar, karena daftarnya panjang.
  useEffect(() => {
    const active = ref.current?.querySelector('[aria-current="page"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <div ref={ref}>
      <SidebarTree pathname={pathname} activeModuleId={activeModuleId} />
    </div>
  );
}

function Tree({ activeModuleId }: { activeModuleId: string }) {
  return (
    <Suspense fallback={<SidebarTree pathname={null} activeModuleId={activeModuleId} />}>
      <SidebarTreeWithPath activeModuleId={activeModuleId} />
    </Suspense>
  );
}

function BackToDashboard() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 border-b border-line px-5 py-4 text-sm font-semibold text-primary hover:underline"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      Dashboard
    </Link>
  );
}

/** Sidebar penuh setinggi layar untuk layar lebar. */
export function ModuleSidebar({ activeModuleId }: { activeModuleId: string }) {
  return (
    <nav
      aria-label="Daftar modul"
      className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto border-r border-line bg-surface lg:block"
    >
      <BackToDashboard />
      <Tree activeModuleId={activeModuleId} />
    </nav>
  );
}

/** Tombol "Daftar modul" dan panel untuk layar kecil. */
export function MobileModuleMenu({ activeModuleId }: { activeModuleId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeOnLinkClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) dialogRef.current?.close();
  }

  return (
    <div className="mb-5 lg:hidden">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-text hover:border-primary"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Daftar modul
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Daftar modul"
        onClick={(event) => {
          // Klik di luar panel (pada backdrop) menutup dialog.
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-surface p-0 text-text backdrop:bg-black/40"
      >
        <div className="flex h-full flex-col" onClick={closeOnLinkClick}>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-semibold">Daftar modul</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-md px-2 py-1 text-sm text-muted hover:bg-surface-2 hover:text-text"
            >
              Tutup
            </button>
          </div>
          <nav aria-label="Daftar modul" className="flex-1 overflow-y-auto">
            <Tree activeModuleId={activeModuleId} />
          </nav>
        </div>
      </dialog>
    </div>
  );
}
