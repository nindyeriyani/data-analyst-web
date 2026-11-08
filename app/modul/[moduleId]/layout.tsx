import { MobileModuleMenu, ModuleSidebar } from "@/components/ModuleSidebar";

// Layout dua kolom untuk halaman modul dan halaman item: sidebar modul di kiri,
// konten di kanan. Di layar kecil, sidebar diganti tombol "Daftar modul".
export default async function ModuleLayout({ children, params }: LayoutProps<"/modul/[moduleId]">) {
  const { moduleId } = await params;

  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
      <aside>
        <ModuleSidebar activeModuleId={moduleId} />
        <MobileModuleMenu activeModuleId={moduleId} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
