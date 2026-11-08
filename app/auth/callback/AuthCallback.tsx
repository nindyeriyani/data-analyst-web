"use client";

// Menukar tautan magic link menjadi sesi, di browser.
// - Alur utama (implicit): email bawaan Supabase mengarah ke sini dengan
//   #access_token=...&refresh_token=... di URL. Bagian "#" tidak pernah dikirim ke
//   server, jadi harus dibaca di browser. Berfungsi di perangkat mana pun.
// - Cadangan: ?token_hash=...&type=email (template kustom) dan ?code=... (PKCE).
// Sesi disimpan di cookie oleh @supabase/ssr, lalu halaman dimuat ulang penuh agar
// proxy membaca cookie baru.

import { createBrowserClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { safeNextPath } from "@/lib/safe-next";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

export default function AuthCallback() {
  const params = useSearchParams();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const next = safeNextPath(params.get("next"));
    const fail = () => window.location.replace("/login?error=tautan");
    const done = () => window.location.replace(next);

    const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { detectSessionInUrl: false },
    });
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const tokenHash = params.get("token_hash");
    const type = params.get("type") as EmailOtpType | null;
    const code = params.get("code");
    // Galat dari penyedia login, misalnya akun Google yang tidak punya akses.
    const providerError = params.get("error") ?? hash.get("error");
    if (providerError) {
      window.history.replaceState(null, "", window.location.pathname);
      window.location.replace("/login?error=akses");
      return;
    }

    (async () => {
      let ok = false;
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        ok = !error;
      } else if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        ok = !error;
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        ok = !error;
      }
      // Hapus token dari riwayat browser sebelum pindah halaman.
      window.history.replaceState(null, "", window.location.pathname);
      if (ok) done();
      else fail();
    })();
  }, [params]);

  return null;
}
