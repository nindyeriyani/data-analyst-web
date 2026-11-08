"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useRef, type MouseEvent } from "react";
import ItemTypeIcon from "@/components/ItemTypeIcon";
import { ItemStatusDot } from "@/components/ProgressBits";
import { useProgress } from "@/components/ProgressProvider";
import { MODULES, SECTIONS, itemsBySection, moduleNumber, type Module } from "@/content/course";
import { moduleProgress } from "@/lib/progress-rules";

const PHASE_BG: Record<Module["phase"], string> = {
  1: "bg-phase-1",
  2: "bg-phase-2",
  3: "bg-phase-3",
};

function moduleShortLabel(mod: Module): string {
  const n = moduleNumber(mod);
  return n === null ? "Ekstra" : `Modul ${n}`;
}

function ModuleCount({ mod }: { mod: Module }) {
  const { completed } = useProgress();
  const { done, total } = moduleProgress(mod, completed);
  return (
    <span className="shrink-0 text-xs tabular-nums text-muted">
      {done}/{total}
    </span>
  );
}

/**
 * Pohon modul dan item. `pathname` null dipakai sebagai fallback Suspense:
 * modul aktif tetap terbuka, tetapi item aktif belum disorot.
 */
function SidebarTree({ pathname, activeModuleId }: { pathname: string | null; activeModuleId: string }) {
  return (
    <ul className="space-y-1">
      {MODULES.map((mod) => {
        const isActiveModule = mod.id === activeModuleId;
        const moduleHref = `/modul/${mod.id}`;

        return (
          <li key={mod.id}>
            <details open={isActiveModule} className="group/mod">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className={`h-8 w-1 shrink-0 rounded-full ${PHASE_BG[mod.phase]}`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-muted">{moduleShortLabel(mod)}</span>
                  <span className={`block truncate text-sm ${isActiveModule ? "font-semibold text-text" : "text-text"}`}>
                    {mod.title}
                  </span>
                </span>
                <ModuleCount mod={mod} />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 text-muted transition-transform group-open/mod:rotate-90"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </summary>

              <div className="mb-2 ml-3 border-l border-line pl-3">
                <Link
                  href={moduleHref}
                  aria-current={pathname === moduleHref ? "page" : undefined}
                  className={`mt-1 block rounded-md px-2 py-1.5 text-sm ${
                    pathname === moduleHref
                      ? "bg-surface-2 font-semibold text-text"
                      : "text-primary hover:bg-surface-2"
                  }`}
                >
                  Ringkasan modul
                </Link>

                {SECTIONS.map((section) => {
                  const items = itemsBySection(mod, section.id);
                  if (items.length === 0) return null;
                  return (
                    <div key={section.id} className="mt-2">
                      <p className="px-2 py-1 text-xs font-medium text-muted">{section.label}</p>
                      <ul>
                        {items.map((item) => {
                          const href = `${moduleHref}/${item.id}`;
                          const active = pathname === href;
                          return (
                            <li key={item.id}>
                              <Link
                                href={href}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-start gap-2 rounded-md px-2 py-1.5 text-sm leading-snug ${
                                  active ? "bg-surface-2 font-semibold text-text" : "text-text hover:bg-surface-2"
                                }`}
                              >
                                <span className="mt-0.5">
                                  <ItemStatusDot item={item} />
                                </span>
                                <span className="min-w-0 flex-1">{item.title}</span>
                                <span className="mt-0.5 shrink-0 text-muted">
                                  <ItemTypeIcon type={item.type} size={14} />
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
  return <SidebarTree pathname={pathname} activeModuleId={activeModuleId} />;
}

function Tree({ activeModuleId }: { activeModuleId: string }) {
  return (
    <Suspense fallback={<SidebarTree pathname={null} activeModuleId={activeModuleId} />}>
      <SidebarTreeWithPath activeModuleId={activeModuleId} />
    </Suspense>
  );
}

/** Sidebar tetap untuk layar lebar. */
export function ModuleSidebar({ activeModuleId }: { activeModuleId: string }) {
  return (
    <nav
      aria-label="Daftar modul"
      className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] overflow-y-auto pr-1 lg:block"
    >
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
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-text hover:border-primary"
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
          <nav aria-label="Daftar modul" className="flex-1 overflow-y-auto p-3">
            <Tree activeModuleId={activeModuleId} />
          </nav>
        </div>
      </dialog>
    </div>
  );
}
