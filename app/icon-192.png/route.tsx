import { appIconResponse } from "@/lib/app-icon";

// Ikon PNG 192×192 untuk manifest (layar utama Android).
export function GET() {
  return appIconResponse(192);
}
