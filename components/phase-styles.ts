import type { ItemType, Module } from "@/content/course";

// Kelas Tailwind per fase dan per tipe item. Ditulis lengkap agar terdeteksi saat build.
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

/** Gradasi pita kartu modul dan kepala modul. */
export const PHASE_GRADIENT: Record<Module["phase"], string> = {
  1: "bg-linear-to-br from-phase-1 to-phase-1-to",
  2: "bg-linear-to-br from-phase-2 to-phase-2-to",
  3: "bg-linear-to-br from-phase-3 to-phase-3-to",
};

export const PHASE_SOFT_BG: Record<Module["phase"], string> = {
  1: "bg-phase-1-soft",
  2: "bg-phase-2-soft",
  3: "bg-phase-3-soft",
};

/** Kotak ikon tipe item: latar tipis dan warna ikon. */
export const TYPE_TILE: Record<ItemType, string> = {
  intro: "bg-type-blue-bg text-type-blue",
  reading: "bg-type-blue-bg text-type-blue",
  course: "bg-type-red-bg text-type-red",
  lab: "bg-type-teal-bg text-type-teal",
  quiz: "bg-type-amber-bg text-type-amber",
  project: "bg-type-green-bg text-type-green",
  magang: "bg-type-orange-bg text-type-orange",
  wrap: "bg-type-purple-bg text-type-purple",
};
