"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/safe-next";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, allowedEmail, isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LoginState {
  status: "idle" | "sent" | "error";
  message?: string;
  email?: string; // untuk tombol "Kirim ulang"
  sentAt?: number; // waktu kirim (ms), untuk hitung mundur
}

const SENT_MESSAGE =
  "Jika email ini terdaftar, tautan masuk sudah dikirim. Buka email Anda lalu klik tautannya. Tautan bisa dibuka di perangkat mana pun.";

export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase belum dikonfigurasi. Isi variabel lingkungan terlebih dulu." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Format email belum benar." };
  }

  // Email selain pemilik tidak pernah dikirimi tautan, tetapi pesannya dibuat sama
  // agar halaman ini tidak membocorkan email mana yang terdaftar.
  if (email !== allowedEmail()) return { status: "sent", message: SENT_MESSAGE, email, sentAt: Date.now() };

  const origin = (await headers()).get("origin");
  if (!origin) return { status: "error", message: "Tidak bisa menentukan alamat situs. Muat ulang halaman lalu coba lagi." };

  const next = safeNextPath(formData.get("next"));
  // Alur implicit: template email bawaan Supabase ({{ .ConfirmationURL }}) mengarah ke
  // /auth/callback#access_token=..., yang berfungsi di perangkat mana pun. Alur PKCE
  // hanya berfungsi di browser yang sama, dan template email tidak bisa diubah tanpa
  // custom SMTP. Klien ini hanya mengirim email, tidak menyimpan sesi.
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Akun pemilik dibuat sekali di dashboard Supabase; aplikasi tidak pernah membuat akun.
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    const tooMany = error.status === 429;
    return {
      status: "error",
      message: tooMany
        ? "Batas pengiriman email tercapai. Tautan di email terakhir Anda masih bisa dipakai. Jika perlu tautan baru, tunggu sekitar satu menit (atau lebih lama jika sudah beberapa kali dalam satu jam), lalu coba lagi."
        : "Gagal mengirim tautan. Periksa koneksi lalu coba lagi.",
    };
  }
  return { status: "sent", message: SENT_MESSAGE, email, sentAt: Date.now() };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
