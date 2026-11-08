import type { Metadata } from "next";
import { RESOURCE_GROUPS } from "@/content/resources";

export const metadata: Metadata = { title: "Sumber" };

function hostname(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Sumber belajar</h1>
      <p className="mt-2 text-muted">Semua gratis. Tautan dibuka di tab baru.</p>

      <nav aria-label="Kelompok sumber" className="mt-5">
        <ul className="flex flex-wrap gap-2">
          {RESOURCE_GROUPS.map((group) => (
            <li key={group.id}>
              <a
                href={`#${group.id}`}
                className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-text transition-colors hover:border-primary hover:text-primary"
              >
                {group.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 space-y-10">
        {RESOURCE_GROUPS.map((group) => (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-judul`} className="scroll-mt-20">
            <h2 id={`${group.id}-judul`} className="mb-3 text-lg font-semibold text-text">
              {group.title}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {group.resources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-primary"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold leading-snug text-text group-hover:text-primary">
                        {resource.title}
                      </span>
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
                        className="mt-1 shrink-0 text-muted group-hover:text-primary"
                      >
                        <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
                      </svg>
                    </span>
                    <span className="mt-1 flex-1 text-sm leading-relaxed text-text">{resource.description}</span>
                    <span className="mt-3 text-xs text-muted">{hostname(resource.url)}</span>
                    <span className="sr-only">(membuka tab baru)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
