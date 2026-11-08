import { appIconResponse } from "@/lib/app-icon";

// Ikon PNG 512×512 untuk manifest (layar utama Android).
export function GET() {
  return appIconResponse(512);
}
