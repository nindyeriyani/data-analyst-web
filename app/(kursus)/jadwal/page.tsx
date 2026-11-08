import type { Metadata } from "next";
import ScheduleList from "@/components/ScheduleList";

export const metadata: Metadata = { title: "Jadwal" };

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Jadwal</h1>
      <ScheduleList />
    </div>
  );
}
