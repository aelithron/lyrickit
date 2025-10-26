import type { Metadata } from "next";
import SongSelector from "./select.module";

export const metadata: Metadata = {
  title: "Select"
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Select Songs</h1>
      <SongSelector />
    </main>
  );
}