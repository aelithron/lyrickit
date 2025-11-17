"use client";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SongCard } from "@/app/(ui)/display.module";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";

export default function LyricSearch({ id }: { id: string }) {
  const [songData, setSongData] = useState<Song | null | false>(null);
  async function loadSong(id: string) {
    const song = await db.songs.get(Number.parseInt(id, 10));
    if (!song) {
      setSongData(false);
      return;
    }
    setSongData(song);
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: only method that makes sense here
  useEffect(() => { loadSong(id) }, [id]);
  return (
    <div className="flex flex-col gap-4">
      {songData === null && <p className="text-lg">Loading...</p>}
      {songData === false && <div className="flex flex-col gap-2">
        <p className="text-lg">Unknown song!</p>
        <Link href={"/find"} className="bg-violet-300 text-black p-1 rounded-lg text-lg w-fit"><FontAwesomeIcon icon={faArrowLeft} /> Go Back</Link>
      </div>}
      {songData && <div>
        <SongCard song={songData} />
      </div>}
    </div>
  );
}