import type { Module } from "@/content/course";

// Kelas Tailwind per fase. Ditulis lengkap agar terdeteksi saat build.
export const PHASE_BG: Record<Module["phase"], string> = {
  1: "bg-phase-1",
  2: "bg-phase-2",
  3: "bg-phase-3",
};

export const PHASE_TEXT: Record<Module["phase"], string> = {
  1: "text-phase-1",
  2: "text-phase-2",
  3: "text-phase-3",
};
