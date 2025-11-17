import type { Metadata } from "next";
import LyricSearch from "./search.module";

export const metadata: Metadata = {
  title: "Finding..."
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold mb-2">Find Lyrics</h1>
      <LyricSearch id={(await params).id} />
    </main>
  );
}