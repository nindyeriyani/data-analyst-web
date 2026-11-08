// Nama cadangan untuk sapaan dan inisial di header, dipakai sampai
// settings.display_name di Supabase termuat atau jika belum pernah diisi.
export const DISPLAY_NAME = "Nindy";

export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

type Meta = Record<string, unknown> | null | undefined;

function firstString(...values: unknown[]): string | null {
  for (const value of values) if (typeof value === "string" && value.trim() !== "") return value.trim();
  return null;
}

/** Bentuk minimal objek pengguna Supabase yang dibaca di sini. */
export interface AuthUserLike {
  user_metadata?: Meta;
  identities?: { provider?: string; identity_data?: Meta }[] | null;
}

/** URL foto profil dari akun yang tersambung (misalnya Google), atau null. */
export function avatarUrlOf(user: AuthUserLike): string | null {
  const meta = user.user_metadata;
  const google = user.identities?.find((identity) => identity.provider === "google")?.identity_data;
  const url = firstString(meta?.avatar_url, meta?.picture, google?.avatar_url, google?.picture);
  return url && url.startsWith("https://") ? url : null;
}

/** Nama depan dari akun yang tersambung (misalnya Google), atau null. */
export function providerFirstNameOf(user: AuthUserLike): string | null {
  const meta = user.user_metadata;
  const google = user.identities?.find((identity) => identity.provider === "google")?.identity_data;
  const name = firstString(
    meta?.given_name,
    google?.given_name,
    meta?.full_name,
    meta?.name,
    google?.full_name,
    google?.name,
  );
  return name ? name.split(/\s+/)[0] : null;
}
