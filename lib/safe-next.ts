/** Jalur tujuan setelah login. Hanya jalur internal ("/..."), bukan URL luar atau "//domain". */
export function safeNextPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  return value;
}
