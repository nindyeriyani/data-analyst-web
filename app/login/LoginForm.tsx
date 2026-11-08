"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

const ERRORS: Record<string, string> = {
  tautan: "Tautan masuk tidak valid atau sudah kedaluwarsa. Minta tautan baru di bawah.",
  akses: "Email ini tidak punya akses ke aplikasi ini.",
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
            className="w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-text hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Mengirim…" : remaining > 0 ? `Kirim ulang dalam ${remaining} detik` : "Kirim ulang tautan"}
          </button>
        </form>
      </div>
    );
  }

  const error = state.status === "error" ? state.message : urlError ? ERRORS[urlError] : undefined;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor={emailId} className="mb-1.5 block text-sm font-medium text-text">
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
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-base text-text placeholder:text-muted focus:border-primary"
        />
      </div>

      {error && (
        <p id={`${emailId}-error`} role="alert" className="rounded-xl bg-late/10 px-4 py-3 text-sm leading-relaxed text-late">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? "Mengirim…" : "Kirim tautan masuk"}
      </button>
    </form>
  );
}
