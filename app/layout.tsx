import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kursus Data Analyst",
    template: "%s · Kursus Data Analyst",
  },
  description: "Pelacak belajar 12 minggu menjadi data analyst.",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Kursus DA", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#F3F6F6",
  colorScheme: "light",
  // Konten boleh memakai area notch; jaraknya diatur dengan env(safe-area-inset-*).
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-text">
        {children}
      </body>
    </html>
  );
}
