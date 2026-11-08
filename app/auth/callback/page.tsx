import type { Metadata } from "next";
import { Suspense } from "react";
import AuthCallback from "./AuthCallback";

export const metadata: Metadata = { title: "Masuk" };

export default function AuthCallbackPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <p role="status" className="text-sm text-muted">
        Sedang masuk…
      </p>
      <Suspense>
        <AuthCallback />
      </Suspense>
    </main>
  );
}
