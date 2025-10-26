"use client"
// biome-ignore assist/source/organizeImports: idk how to fix this order
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLiveQuery } from "dexie-react-hooks";
import Image from "next/image";
import { useEffect } from "react";
import { db } from "@/utils/db";
import defaultCover from "@/public/defaultCover.jpeg";
import type { Song } from "@/lyrickit";
import Link from "next/link";

export default function SongDisplay() {
  const songData = useLiveQuery(() => db.songs.toArray());
  return (
    <div className="flex flex-col bg-slate-500 rounded-lg text-center p-3 gap-2">
      <h1 className="text-xl font-semibold mb-2">Selected Songs</h1>
      {songData?.map((song) => <SongCard song={song} key={song.title} />)}
      {songData?.length === 0 && <div className="flex flex-col gap-2">
        <p>You haven't added any songs yet!</p>  
        <Link href={"/select"} className="p-2 rounded-lg bg-violet-300 text-black">Pick Songs</Link>
      </div>}
      {songData === undefined && <p>Loading songs...</p>}
    </div>
  );
}

function SongCard({ song }: { song: Song }) {
  const url = song.cover ? URL.createObjectURL(song.cover) : null;
  useEffect(() => {
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [url]);
  return (
    <div className="flex gap-3 items-center">
      <Image src={url ? url : defaultCover} alt="Song Cover" width={256} height={256} className="h-32 w-32 rounded-md" />
      <div className="flex flex-col text-start">
        <div className="flex gap-2">
          {song.lyrics !== "" && <FontAwesomeIcon icon={faMicrophone} />}
          {(song.lyrics !== "" && song.synced === true) && <FontAwesomeIcon icon={faSync} />}
        </div>
        <div className="flex gap-2">
          <p className="text-lg font-semibold">{song.title}</p>
          <button type="button" onClick={async () => (await db.songs.delete(song.id))}><FontAwesomeIcon icon={faTrash} /></button>
        </div>
        <p>by {(song.artists || ["Unknown Artist"]).join()}</p>
        <p>on {song.album || "Unknown Album"}</p>
      </div>
    </div>
  );
}