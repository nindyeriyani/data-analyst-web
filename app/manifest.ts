import type { MetadataRoute } from "next";

// Manifest agar aplikasi bisa ditambahkan ke layar utama HP dan dibuka tanpa bilah alamat.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kursus Data Analyst",
    short_name: "Kursus DA",
    description: "Pelacak belajar menjadi data analyst, dengan jadwal yang Anda atur sendiri.",
    lang: "id",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F3F6F6",
    theme_color: "#F3F6F6",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
