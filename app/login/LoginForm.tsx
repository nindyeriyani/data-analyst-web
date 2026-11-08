"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useId } from "react";
import { sendMagicLink, type LoginState } from "./actions";

const ERRORS: Record<string, string> = {
  tautan: "Tautan masuk tidak valid atau sudah kedaluwarsa. Minta tautan baru di bawah.",
  akses: "Email ini tidak punya akses ke aplikasi ini.",
};

export default function LoginForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<LoginState, FormData>(sendMagicLink, { status: "idle" });
  const emailId = useId();
  const urlError = params.get("error");

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-xl bg-done/10 px-4 py-3 text-sm leading-relaxed text-text">
        <p className="mb-1 font-semibold text-done">Cek email Anda</p>
        {state.message}
      </div>
    );
  }

  const error = state.status === "error" ? state.message : urlError ? ERRORS[urlError] : undefined;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={params.get("next") ?? "/"} />
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
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-text placeholder:text-muted focus:border-primary"
        />
      </div>

      {error && (
        <p id={`${emailId}-error`} role="alert" className="rounded-xl bg-late/10 px-4 py-3 text-sm text-late">
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
