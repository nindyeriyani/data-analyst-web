import type { Metadata } from "next";
import { Suspense } from "react";
import DataFlowIllustration from "@/components/DataFlowIllustration";
import Logo from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
      <div className="grid w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface shadow-sm md:max-w-4xl md:grid-cols-2">
        {/* Panel kiri: identitas aplikasi. Di HP hanya logo dan judul yang tampil. */}
        <div className="flex flex-col bg-primary-soft px-6 py-7 sm:px-8 md:py-10">
          <div className="flex items-center gap-3 text-text">
            <Logo size={36} />
            <span className="font-semibold">Data Analyst</span>
          </div>
          <p className="mt-6 text-2xl font-extrabold leading-tight tracking-tight text-text sm:text-3xl">
            Belajar jadi data analyst, satu minggu demi satu minggu.
          </p>
          <p className="mt-3 text-muted">
            Progres, kuis, dan catatan tersimpan di akun Anda, sama di laptop maupun HP.
          </p>
          <DataFlowIllustration className="mt-auto hidden w-full max-w-xs self-center pt-10 md:block" />
        </div>

        {/* Panel kanan: form masuk */}
        <div className="px-6 py-7 sm:px-8 md:flex md:flex-col md:justify-center md:py-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl">Masuk</h1>
          <p className="mt-2 mb-6 text-muted">
            Pakai akun Google, atau minta tautan masuk lewat email. Tanpa kata sandi.
          </p>

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
