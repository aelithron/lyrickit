import type { Metadata } from "next";
import LyricFinder from "./find.module";

export const metadata: Metadata = {
  title: "Find"
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Find Lyrics</h1>
      <p>Select a song from below to search for lyrics!</p>
      <LyricFinder />
    </main>
  );
}