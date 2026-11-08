"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeNextPath } from "@/lib/safe-next";
import { sendMagicLink, type LoginState } from "./actions";

const ERRORS: Record<string, string> = {
  tautan: "Tautan masuk tidak valid atau sudah kedaluwarsa. Minta tautan baru di bawah.",
  akses: "Akun ini tidak punya akses ke aplikasi ini.",
  google: "Gagal membuka login Google. Coba lagi, atau masuk dengan tautan email.",
};

const RESEND_SECONDS = 60;

/** Detik tersisa sebelum tautan baru boleh diminta. */
function useCountdown(sentAt: number | undefined): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!sentAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [sentAt]);
  if (!sentAt) return 0;
  const elapsed = Math.max(0, Math.floor((now - sentAt) / 1000));
  return Math.max(0, RESEND_SECONDS - elapsed);
}

export default function LoginForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<LoginState, FormData>(sendMagicLink, { status: "idle" });
  const emailId = useId();
  const urlError = params.get("error");
  const next = params.get("next") ?? "/";
  const remaining = useCountdown(state.status === "sent" ? state.sentAt : undefined);

  if (state.status === "sent") {
    return (
      <div className="space-y-4">
        <div role="status" className="rounded-xl bg-done/10 px-4 py-3 text-sm leading-relaxed text-text">
          <p className="mb-1 font-semibold text-done">Cek email Anda</p>
          {state.message} Subjek emailnya “Your sign-in link”; periksa juga folder spam.
        </div>
        <form action={action}>
          <input type="hidden" name="email" value={state.email ?? ""} />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            disabled={pending || remaining > 0}
            className="w-full rounded-full border border-line bg-surface px-5 py-3 text-base font-semibold text-text hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Mengirim…" : remaining > 0 ? `Kirim ulang dalam ${remaining} detik` : "Kirim ulang tautan"}
          </button>
        </form>
      </div>
    );
  }

  const error = state.status === "error" ? state.message : urlError ? ERRORS[urlError] : undefined;

  return (
    <div className="space-y-5">
      <GoogleButton next={safeNextPath(next)} />
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />
        atau dengan tautan email
        <span className="h-px flex-1 bg-line" />
      </div>
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor={emailId} className="mb-2 block text-sm font-semibold text-text">
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="nama@contoh.com"
            aria-describedby={error ? `${emailId}-error` : undefined}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-base text-text placeholder:text-muted transition-colors focus:border-primary focus:bg-surface"
          />
        </div>

        {error && (
          <p
            id={`${emailId}-error`}
            role="alert"
            className="rounded-xl bg-late/10 px-4 py-3 text-sm leading-relaxed text-late"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-primary px-5 py-3 text-base font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? "Mengirim…" : "Kirim tautan masuk"}
        </button>
      </form>
    </div>
  );
}

/** Masuk dengan Google. Hanya akun dengan email yang sama dengan ALLOWED_EMAIL yang diterima. */
function GoogleButton({ next }: { next: string }) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signIn() {
    setPending(true);
    setFailed(false);
    const { error } = await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    // Jika berhasil, browser sudah diarahkan ke Google. Sampai sini berarti gagal.
    if (error) {
      setPending(false);
      setFailed(true);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={pending}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-line bg-surface px-5 py-3 text-base font-semibold text-text transition-colors hover:border-primary hover:bg-primary-soft disabled:opacity-60"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"
          />
          <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
          <path
            fill="#EA4335"
            d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"
          />
        </svg>
        {pending ? "Membuka Google…" : "Masuk dengan Google"}
      </button>
      {failed && (
        <p role="alert" className="mt-2 text-sm text-late">
          {ERRORS.google}
        </p>
      )}
    </div>
  );
}
