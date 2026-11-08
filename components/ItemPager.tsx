import Link from "next/link";
import { adjacentItems, getModuleOfItem, type Item } from "@/content/course";

function itemHref(item: Item): string {
  return `/modul/${getModuleOfItem(item.id)?.id}/${item.id}`;
}

const BASE = "flex min-w-0 flex-1 flex-col gap-1 rounded-xl border p-4";
const ACTIVE = `group ${BASE} border-line bg-surface transition-colors hover:border-primary`;

function PagerContent({ item, direction }: { item: Item; direction: "prev" | "next" }) {
  return (
    <>
      <span className="text-sm text-muted">{direction === "next" ? "Berikutnya →" : "← Sebelumnya"}</span>
      <span className="font-semibold text-text group-hover:text-primary">{item.title}</span>
    </>
  );
}

export default function ItemPager({ itemId }: { itemId: string }) {
  const { prev, next } = adjacentItems(itemId);
  if (!prev && !next) return null;

  const nextClass = `${ACTIVE} items-end text-right`;

  return (
    <nav aria-label="Navigasi item" className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row">
      {prev ? (
        <Link href={itemHref(prev)} rel="prev" className={`${ACTIVE} items-start`}>
          <PagerContent item={prev} direction="prev" />
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}

      {next && (
        <Link href={itemHref(next)} rel="next" className={nextClass}>
          <PagerContent item={next} direction="next" />
        </Link>
      )}

      {!next && <div className="hidden flex-1 sm:block" />}
    </nav>
  );
}
