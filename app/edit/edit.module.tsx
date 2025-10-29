"use client";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useState } from "react";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { SongCard } from "../(ui)/display.module";

export default function EditLyrics() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [activeLyrics, setActiveLyrics] = useState<string>("");
  const [saved, setSaved] = useState<"yes" | "no" | "error">("yes");
  async function changeActive(song: Song) {
    if (activeSong !== null) {
      
    }
    setActiveSong(song);
  }

  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="flex flex-col text-center p-3 gap-2 md:col-span-2">
        <p>activeSong: {activeSong ? JSON.stringify(activeSong) : "none"}</p>
        
      </div>
      <SongList songData={songData} changeActive={changeActive} />
    </div>
  );
}

function SongList({ songData, changeActive }: { songData: Song[] | undefined, changeActive: (song: Song) => void }) {
  return (
    <div className="flex flex-col bg-slate-500 rounded-lg text-center p-3 gap-2">
      <h1 className="text-xl font-semibold mb-2">Selected Songs</h1>
      <p>Click a song to edit the lyrics!</p>
      {songData?.map((song) => <button key={song.title} type="button" onClick={() => changeActive(song)}><SongCard song={song} /></button>)}
      {songData?.length === 0 && <div className="flex flex-col gap-2">
        <p>You haven't added any songs yet!</p>
        <Link href={"/select"} className="p-2 rounded-lg bg-violet-300 text-black">Pick Songs</Link>
      </div>}
      {songData === undefined && <p>Loading songs...</p>}
    </div>
  );
}