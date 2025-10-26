import type { Metadata } from "next";
import SongDisplay from "../(ui)/display.module";

export const metadata: Metadata = {
  title: "Find"
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Find Lyrics</h1>
      <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
        <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 md:col-span-2">
          
        </div>
        <SongDisplay />
      </div>
    </main>
  );
}