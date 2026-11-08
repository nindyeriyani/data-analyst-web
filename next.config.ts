import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  // Header keamanan dasar untuk semua halaman.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Aplikasi tidak boleh ditampilkan di dalam iframe situs lain.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          // Saat membuka tautan sumber, situs tujuan hanya melihat domain, bukan alamat halaman.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    // Ada package-lock.json lain di folder home; kunci root ke proyek ini.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
