"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { GlossaryTerm } from "@/content/glossary";

export interface GlossaryEntry extends GlossaryTerm {
  moduleLabel?: string; // misalnya "Modul 2: SQL untuk analisis"
}

/** Huruf kecil tanpa tanda diakritik, agar pencarian tidak peka huruf besar-kecil. */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function matches(entry: GlossaryEntry, query: string): boolean {
  if (!query) return true;
  const haystack = normalize([entry.term, ...(entry.aliases ?? []), entry.definition].join(" "));
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export default function GlossarySearch({ entries }: { entries: GlossaryEntry[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const trimmed = query.trim();
  const results = entries.filter((entry) => matches(entry, trimmed));

  // Kelompokkan per huruf awal, urutan sudah alfabetis dari server.
  const groups = new Map<string, GlossaryEntry[]>();
  for (const entry of results) {
    const letter = entry.term.charAt(0).toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), entry]);
  }

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-4 bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <label htmlFor={inputId} className="sr-only">
          Cari istilah
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          >
            <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5" />
          </svg>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah, misalnya JOIN atau median"
            autoComplete="off"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-3 text-text placeholder:text-muted focus:border-primary"
          />
        </div>
        <p aria-live="polite" className="mt-2 text-sm text-muted">
          {trimmed ? `${results.length} istilah ditemukan` : `${entries.length} istilah`}
        </p>
      </div>

      {results.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line px-5 py-6 text-center text-muted">
          Tidak ada istilah yang cocok dengan “{trimmed}”. Coba kata lain atau istilah dalam bahasa Inggris.
        </p>
      ) : (
        <div className="mt-4 space-y-6">
          {[...groups].map(([letter, items]) => (
            <section key={letter} aria-labelledby={`huruf-${letter}`}>
              <h2 id={`huruf-${letter}`} className="mb-2 text-sm font-semibold text-muted">
                {letter}
              </h2>
              <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                {items.map((entry) => (
                  <div key={entry.term} className="px-5 py-4">
                    <dt className="font-semibold text-text">
                      {entry.term}
                      {entry.aliases && entry.aliases.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-muted">{entry.aliases.join(", ")}</span>
                      )}
                    </dt>
                    <dd className="mt-1 leading-relaxed text-text">{entry.definition}</dd>
                    {entry.moduleId && entry.moduleLabel && (
                      <dd className="mt-2 text-sm">
                        <Link href={`/modul/${entry.moduleId}`} className="text-primary hover:underline">
                          Dipelajari di {entry.moduleLabel}
                        </Link>
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
