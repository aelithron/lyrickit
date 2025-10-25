import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sync"
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Time-sync Lyrics</h1>
    </main>
  );
}