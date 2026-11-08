// Nama pengguna untuk sapaan dan inisial di header.
// Sementara ditulis tetap; di tahap 8 diambil dari settings.display_name di Supabase.
export const DISPLAY_NAME = "Nindy";

export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}
