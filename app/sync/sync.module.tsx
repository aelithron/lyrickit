"use client";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useState } from "react";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { SongCard } from "../(ui)/display.module";

export default function SyncLyrics() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [activeLyrics, setActiveLyrics] = useState<string>("");
  async function changeActive(newSong: Song) {
    setActiveSong(newSong);
    setActiveLyrics(newSong.lyrics);
  }
  async function saveSong() {
    if (!activeSong) return;
    activeSong.lyrics = activeLyrics;
    setActiveSong(activeSong);
    await db.songs.update(activeSong.id, activeSong);
  }
  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="flex flex-col text-center p-3 gap-2 md:col-span-2">
        
      </div>
      <SongList songData={songData} changeActive={changeActive} />
    </div>
  );
}

function SongList({ songData, changeActive }: { songData: Song[] | undefined, changeActive: (song: Song) => void }) {
  const syncedData = songData?.filter((songItem) => songItem.lyrics !== "");
  return (
    <div className="flex flex-col bg-slate-500 rounded-lg text-center p-3 gap-2">
      <h1 className="text-xl font-semibold mb-2">Songs with Lyrics</h1>
      {syncedData?.map((song) => <button key={song.title} type="button" onClick={() => changeActive(song)}><SongCard song={song} /></button>)}
      {syncedData?.length === 0 && <div className="flex flex-col gap-2">
        <p>You don't have any songs with lyrics yet!</p>
        <div className="flex gap-2 justify-center">
          <Link href={"/find"} className="p-2 rounded-lg bg-violet-300 text-black">Search Lyrics</Link>
          <Link href={"/edit"} className="p-2 rounded-lg bg-violet-300 text-black">Edit Lyrics</Link>
        </div>
      </div>}
      {songData === undefined && <p>Loading songs...</p>}
    </div>
  );
}