import type { Metadata } from "next";
import SongDisplay from "../(ui)/display.module";
import { UploadSongs } from "./select.module";

export const metadata: Metadata = {
  title: "Select"
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Select Songs</h1>
      <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
        <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 md:col-span-2">
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-semibold">Upload Songs</h1>
            <UploadSongs />
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-center align-middle">OR</p>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-semibold">Search for Songs</h1>
            <p>Coming Soon...</p>
          </div>
        </div>
        <SongDisplay />
      </div>
    </main>
  );
}