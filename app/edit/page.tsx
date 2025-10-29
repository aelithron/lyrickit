import type { Metadata } from "next";
import EditLyrics from "./edit.module";

export const metadata: Metadata = {
  title: "Edit"
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Edit Lyrics</h1>
      <EditLyrics />
    </main>
  );
}