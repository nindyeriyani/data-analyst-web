/** Logo sederhana: tiga batang grafik di dalam kotak berwarna aksi utama. */
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className="shrink-0"
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <rect x="8" y="17" width="4" height="8" rx="1" fill="var(--on-primary)" />
      <rect x="14" y="12" width="4" height="13" rx="1" fill="var(--on-primary)" />
      <rect x="20" y="7" width="4" height="18" rx="1" fill="var(--on-primary)" />
    </svg>
  );
}
