import type { Metadata } from "next";
import ScheduleSettings from "@/components/ScheduleSettings";
import SettingsForm from "@/components/SettingsForm";
import { signOut } from "@/app/login/actions";

export const metadata: Metadata = { title: "Pengaturan" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Pengaturan</h1>
      <div className="mt-6 space-y-6">
        <SettingsForm />
        <ScheduleSettings />
        <form action={signOut} className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-semibold text-text">Keluar</p>
          <p className="mt-1 text-sm text-muted">Progres tetap tersimpan dan bisa dibuka lagi setelah masuk kembali.</p>
          <button
            type="submit"
            className="mt-3 rounded-lg border border-line px-4 py-2 text-sm font-medium text-text hover:border-late hover:text-late"
          >
            Keluar
          </button>
        </form>
      </div>
    </div>
  );
}
