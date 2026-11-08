// Nama cadangan untuk sapaan dan inisial di header, dipakai sampai
// settings.display_name di Supabase termuat atau jika belum pernah diisi.
export const DISPLAY_NAME = "Nindy";

export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}
