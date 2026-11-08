// Ikon aplikasi (PNG) untuk layar utama HP, dibuat dari kode agar sama dengan app/icon.svg:
// tiga batang grafik putih di atas warna aksi utama. Latar penuh tanpa sudut membulat,
// karena iOS dan Android memotong sudutnya sendiri.

import { ImageResponse } from "next/og";

const PRIMARY = "#0D6B62";

export function appIconResponse(size: number): ImageResponse {
  // Batang berada di tengah 60% ikon agar aman untuk ikon "maskable" Android.
  const unit = (size * 0.6) / 16;
  const bar = (height: number) => (
    <div style={{ width: unit * 2.4, height: unit * height, background: "#FFFFFF", borderRadius: unit * 0.6 }} />
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: unit * 1.2,
          paddingBottom: size * 0.24,
          background: PRIMARY,
        }}
      >
        {bar(5)}
        {bar(8.5)}
        {bar(12)}
      </div>
    ),
    { width: size, height: size },
  );
}
