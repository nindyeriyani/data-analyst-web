// Konfigurasi Supabase dari variabel lingkungan. Nilai NEXT_PUBLIC_* aman untuk browser
// (publishable key dilindungi Row Level Security). Jangan pernah memakai secret key di sini.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL !== "" && SUPABASE_PUBLISHABLE_KEY !== "";
}

/** Email satu-satunya pemilik. Hanya tersedia di server (tanpa awalan NEXT_PUBLIC). */
export function allowedEmail(): string {
  return (process.env.ALLOWED_EMAIL ?? "").trim().toLowerCase();
}
