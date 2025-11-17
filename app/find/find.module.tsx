"use client";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { db } from "@/utils/db";
import { SongCard } from "../(ui)/display.module";

export default function LyricFinder() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const missingLyrics = songData?.filter((song) => song.lyrics === "");
  const unsyncedLyrics = songData?.filter((song) => (song.lyrics !== "" && !song.synced));
  return (
    <div className="flex flex-col mt-6 gap-4">
      <div className="flex flex-col text-center p-3 gap-2">
        <h1 className="text-xl font-semibold">Missing</h1>
        <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1">
          {missingLyrics?.map((song) => (
            <Link href={`/find/${song.id}`} key={song.id} className="flex gap-3 bg-slate-500 p-2 rounded-lg">
              <SongCard song={song} />
            </Link>
          ))}
          {!missingLyrics && <p className="flex flex-col text-center md:col-span-3">Loading...</p>}
        </div>
      </div>
      <div className="flex flex-col text-center p-3 gap-2">
        <h1 className="text-xl font-semibold">Unsynced</h1>
        <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1">
          {unsyncedLyrics?.map((song) => (
            <Link href={`/find/${song.id}`} key={song.id} className="flex gap-3 bg-slate-500 p-2 rounded-lg">
              <SongCard song={song} />
            </Link>
          ))}
          {!unsyncedLyrics && <p className="flex flex-col text-center md:col-span-3">Loading...</p>}
        </div>
      </div>
    </div>
  )
}