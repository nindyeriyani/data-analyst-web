"use client";

// Menghubungkan status lulus kuis dengan tombol "Berikutnya" di halaman kuis.
// Di tahap 8, status lulus diambil dari progres yang tersimpan di Supabase.

import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";

interface QuizGateValue {
  passed: boolean;
  setPassed: (passed: boolean) => void;
}

const QuizGateContext = createContext<QuizGateValue | null>(null);

export function QuizGateProvider({ children }: { children: ReactNode }) {
  const [passed, setPassed] = useState(false);
  return <QuizGateContext value={{ passed, setPassed }}>{children}</QuizGateContext>;
}

/** Null jika tidak berada di dalam halaman kuis. */
export function useQuizGate(): QuizGateValue | null {
  return useContext(QuizGateContext);
}

/** Tautan yang terkunci selama kuis di halaman ini belum lulus. */
export function GatedLink({
  href,
  rel,
  className,
  lockedClassName,
  children,
  lockedChildren,
}: {
  href: string;
  rel?: string;
  className: string;
  lockedClassName: string;
  children: ReactNode;
  lockedChildren: ReactNode;
}) {
  const gate = useQuizGate();
  if (gate && !gate.passed) {
    return (
      <div aria-disabled="true" className={lockedClassName}>
        {lockedChildren}
      </div>
    );
  }
  return (
    <Link href={href} rel={rel} className={className}>
      {children}
    </Link>
  );
}
