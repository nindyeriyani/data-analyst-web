import type { ItemType } from "@/content/course";
import { TYPE_TILE } from "@/components/phase-styles";

const PATHS: Record<ItemType, string> = {
  intro: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  reading: "M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z",
  course: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  lab: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 15h9",
  quiz: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01",
  project: "M4 7h16v13H4zM9 7V4h6v3M4 12h16",
  magang: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
  wrap: "M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
};

export default function ItemTypeIcon({ type, size = 18 }: { type: ItemType; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[type]} />
    </svg>
  );
}

/** Kotak ikon berwarna sesuai tipe item. */
export function ItemTypeTile({ type, className = "" }: { type: ItemType; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${TYPE_TILE[type]} ${className}`}
    >
      <ItemTypeIcon type={type} />
    </span>
  );
}
