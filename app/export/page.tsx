import type { Metadata } from "next";
import ExportLyrics from "./export.module";

export const metadata: Metadata = {
  title: "Save"
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Download Lyrics</h1>
      <ExportLyrics />
    </main>
  );
}