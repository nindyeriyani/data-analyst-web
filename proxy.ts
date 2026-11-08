// Proxy (pengganti middleware di Next.js 16). Berjalan sebelum setiap halaman:
// 1. memperbarui sesi Supabase di cookie,
// 2. mengarahkan pengunjung tanpa sesi ke /login,
// 3. menolak sesi dengan email selain ALLOWED_EMAIL,
// 4. mengembalikan status 404 untuk URL modul atau item yang tidak ada.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getModule } from "@/content/course";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, allowedEmail, isSupabaseConfigured } from "@/lib/supabase/env";

const PUBLIC_PATHS = ["/login", "/auth/"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

/** /modul/<id> atau /modul/<id>/<itemId> yang tidak terdaftar di course.ts. */
function isUnknownCoursePath(pathname: string): boolean {
  const match = /^\/modul\/([^/]+)(?:\/([^/]+))?\/?$/.exec(pathname);
  if (!match) return false;
  const mod = getModule(decodeURIComponent(match[1]));
  if (!mod) return true;
  return match[2] !== undefined && !mod.items.some((item) => item.id === decodeURIComponent(match[2]));
}

function redirectTo(request: NextRequest, pathname: string, params: Record<string, string> = {}) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isSupabaseConfigured()) {
    // Tanpa konfigurasi, semua halaman diarahkan ke /login yang menampilkan petunjuk.
    return isPublic(pathname) ? NextResponse.next() : redirectTo(request, "/login");
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  // getClaims memverifikasi JWT, jangan diganti getSession (isi cookie tidak bisa dipercaya).
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims.email === "string" ? data.claims.email.toLowerCase() : null;
  const allowed = email !== null && email === allowedEmail();

  if (email !== null && !allowed) {
    await supabase.auth.signOut();
    const denied = redirectTo(request, "/login", { error: "akses" });
    for (const cookie of response.cookies.getAll()) denied.cookies.set(cookie);
    return denied;
  }

  if (isPublic(pathname)) {
    // Sudah login lalu membuka /login: langsung ke dashboard.
    return allowed && pathname === "/login" ? redirectTo(request, "/") : response;
  }

  if (!allowed) {
    return redirectTo(request, "/login", { next: pathname + search });
  }

  if (isUnknownCoursePath(pathname)) {
    const notFound = NextResponse.rewrite(new URL("/tidak-ditemukan", request.url), { status: 404 });
    for (const cookie of response.cookies.getAll()) notFound.cookies.set(cookie);
    return notFound;
  }

  return response;
}

export const config = {
  // Semua halaman kecuali file statis dan gambar.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
