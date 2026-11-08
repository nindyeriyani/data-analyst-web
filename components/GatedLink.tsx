"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useProgress } from "@/components/ProgressProvider";

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
  if (!isCompleted(requiresItemId)) {
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
