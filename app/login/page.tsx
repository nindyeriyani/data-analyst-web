import type { Metadata } from "next";
import { Suspense } from "react";
import Logo from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2 font-semibold text-text">
          <Logo />
          <span>Kursus Data Analyst</span>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h1 className="text-xl font-bold text-text">Masuk</h1>
          <p className="mt-1 mb-5 text-sm text-muted">Masuk dengan akun Google, atau dengan tautan yang dikirim ke email. Tanpa kata sandi.</p>

          {configured ? (
            <Suspense>
              <LoginForm />
            </Suspense>
          ) : (
            <p role="alert" className="rounded-xl bg-late/10 px-4 py-3 text-sm leading-relaxed text-late">
              Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, dan
              ALLOWED_EMAIL di .env.local (lokal) atau Environment Variables (Vercel), lalu jalankan ulang aplikasi.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
