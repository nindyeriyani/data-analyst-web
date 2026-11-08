import type { Metadata } from "next";
import ScheduleList from "@/components/ScheduleList";

export const metadata: Metadata = { title: "Jadwal" };

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">Jadwal</h1>
      <ScheduleList />
    </div>
  );
}
