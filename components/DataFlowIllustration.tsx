/** Ilustrasi alur data: tabel, lembar kerja, lalu grafik. Hanya dekorasi. */
export default function DataFlowIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 220"
      className={`h-auto ${className}`}
    >
      <circle cx="292" cy="58" r="58" fill="var(--phase-1-to)" opacity="0.25" />
      <circle cx="118" cy="62" r="17" fill="var(--accent-coral)" />
      <circle cx="210" cy="40" r="9" fill="var(--type-teal)" />

      {/* Garis penghubung */}
      <rect x="60" y="160" width="250" height="8" rx="4" fill="var(--text-muted)" opacity="0.7" />

      {/* Tabel database */}
      <rect x="20" y="112" width="76" height="98" rx="12" fill="var(--phase-1)" />
      <ellipse cx="58" cy="114" rx="38" ry="12" fill="var(--phase-1-to)" />

      {/* Lembar kerja */}
      <rect x="138" y="122" width="84" height="88" rx="14" fill="var(--accent-amber)" />
      <rect x="156" y="146" width="48" height="8" rx="4" fill="var(--surface)" />
      <rect x="156" y="162" width="36" height="8" rx="4" fill="var(--surface)" />
      <rect x="156" y="178" width="48" height="8" rx="4" fill="var(--surface)" />

      {/* Grafik batang */}
      <rect x="264" y="104" width="76" height="106" rx="12" fill="var(--phase-2)" />
      <rect x="280" y="160" width="10" height="34" rx="5" fill="var(--surface)" />
      <rect x="297" y="140" width="10" height="54" rx="5" fill="var(--surface)" />
      <rect x="314" y="120" width="10" height="74" rx="5" fill="var(--surface)" />
    </svg>
  );
}
