import Link from "next/link";
import { adjacentItems, getModuleOfItem, type Item } from "@/content/course";

function itemHref(item: Item): string {
  return `/modul/${getModuleOfItem(item.id)?.id}/${item.id}`;
}

function PagerLink({ item, direction }: { item: Item; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={itemHref(item)}
      rel={direction}
      className={`group flex min-w-0 flex-1 flex-col gap-1 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-primary ${
        isNext ? "items-end text-right" : "items-start"
      }`}
    >
      <span className="text-sm text-muted">{isNext ? "Berikutnya →" : "← Sebelumnya"}</span>
      <span className="font-semibold text-text group-hover:text-primary">{item.title}</span>
    </Link>
  );
}

export default function ItemPager({ itemId }: { itemId: string }) {
  const { prev, next } = adjacentItems(itemId);
  if (!prev && !next) return null;

  return (
    <nav aria-label="Navigasi item" className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row">
      {prev ? <PagerLink item={prev} direction="prev" /> : <div className="hidden flex-1 sm:block" />}
      {next ? <PagerLink item={next} direction="next" /> : <div className="hidden flex-1 sm:block" />}
    </nav>
  );
}
