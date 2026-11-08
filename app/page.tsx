export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <h1 className="text-2xl font-bold">Halo!</h1>
        <p className="mt-2 text-muted">
          Kursus dimulai Senin, 9 November 2026. Dashboard lengkap menyusul di
          tahap berikutnya.
        </p>
      </section>

      {/* Contoh sementara untuk memeriksa warna fase dan font kode. */}
      <section aria-label="Contoh warna fase" className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Fase 1, fondasi", className: "bg-phase-1" },
          { label: "Fase 2, analisis dan visualisasi", className: "bg-phase-2" },
          { label: "Fase 3, portofolio dan karier", className: "bg-phase-3" },
        ].map((phase) => (
          <div
            key={phase.label}
            className="overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <div className={`${phase.className} px-4 py-3 text-sm font-semibold text-on-phase`}>
              {phase.label}
            </div>
            <p className="px-4 py-3 text-sm text-muted">
              Contoh kode: <code className="font-mono text-text">SELECT * FROM orders;</code>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
