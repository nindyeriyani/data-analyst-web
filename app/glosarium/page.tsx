import type { Metadata } from "next";
import GlossarySearch, { type GlossaryEntry } from "@/components/GlossarySearch";
import { getModule, moduleNumber } from "@/content/course";
import { GLOSSARY } from "@/content/glossary";

export const metadata: Metadata = { title: "Glosarium" };

function moduleLabel(moduleId?: string): string | undefined {
  const mod = moduleId ? getModule(moduleId) : undefined;
  if (!mod) return undefined;
  const n = moduleNumber(mod);
  return n === null ? mod.title : `Modul ${n}: ${mod.title}`;
}

export default function GlossaryPage() {
  const entries: GlossaryEntry[] = [...GLOSSARY]
    .sort((a, b) => a.term.localeCompare(b.term, "id", { sensitivity: "base" }))
    .map((term) => ({ ...term, moduleLabel: moduleLabel(term.moduleId) }));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Glosarium</h1>
      <p className="mt-2 text-muted">Istilah yang sering muncul selama kursus, dengan definisi singkat.</p>
      <div className="mt-4">
        <GlossarySearch entries={entries} />
      </div>
    </div>
  );
}
