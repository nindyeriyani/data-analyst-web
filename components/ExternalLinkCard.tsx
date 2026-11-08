import type { ItemType } from "@/content/course";

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ExternalLinkCard({
  url,
  note,
  type,
}: {
  url: string;
  note?: string;
  type: ItemType;
}) {
  const label = type === "course" ? "Buka kursus" : "Buka sumber";

  return (
    <section
      aria-label="Tautan keluar"
      className="my-8 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{hostname(url)}</p>
        {note && <p className="mt-1 leading-relaxed text-text">{note}</p>}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
      >
        {label}
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
          <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
        </svg>
        <span className="sr-only">(membuka tab baru)</span>
      </a>
    </section>
  );
}
