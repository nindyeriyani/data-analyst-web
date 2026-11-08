"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { LOCKS_ENABLED } from "@/lib/progress-rules";

/** Tautan yang terkunci selama item `requiresItemId` (misalnya kuis) belum selesai. */
export function GatedLink({
  requiresItemId,
  href,
  rel,
  className,
  lockedClassName,
  children,
  lockedChildren,
}: {
  requiresItemId: string;
  href: string;
  rel?: string;
  className: string;
  lockedClassName: string;
  children: ReactNode;
  lockedChildren: ReactNode;
}) {
  const { isCompleted } = useProgress();
  if (LOCKS_ENABLED && !isCompleted(requiresItemId)) {
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
