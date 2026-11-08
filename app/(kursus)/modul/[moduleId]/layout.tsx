import { MobileModuleMenu, ModuleSidebar } from "@/components/ModuleSidebar";

// Layout dua kolom untuk halaman modul dan halaman item: sidebar penuh setinggi layar
// di kiri, konten di kanan. Margin negatif membatalkan padding <main> agar sidebar
// menempel ke tepi. Di layar kecil, sidebar diganti tombol "Daftar modul".
export default async function ModuleLayout({ children, params }: LayoutProps<"/modul/[moduleId]">) {
  const { moduleId } = await params;

  return (
    <div className="lg:-mx-6 lg:-mt-6 lg:-mb-10 lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]">
      <ModuleSidebar activeModuleId={moduleId} />
      <div className="min-w-0 lg:px-10 lg:pb-12 lg:pt-8">
        <MobileModuleMenu activeModuleId={moduleId} />
        {children}
      </div>
    </div>
  );
}
