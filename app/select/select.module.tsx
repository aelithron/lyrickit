"use client"
// biome-ignore assist/source/organizeImports: idk what this is asking me to change
import { useEffect } from "react";
import type { Song } from "@/lyrickit";
import { parseBlob } from "music-metadata";
import defaultCover from "@/public/defaultCover.jpeg"
import Image from "next/image";
import { db } from "@/utils/db";
import { useLiveQuery } from "dexie-react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SongSelector() {
  const songData = useLiveQuery(() => db.songs.toArray());

  return (
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
      <div className="flex flex-col bg-slate-500 rounded-lg text-center p-3 gap-2">
        <h1 className="text-xl font-semibold mb-2">Selected Songs</h1>
        {songData?.map((song) => <SongDisplay song={song} key={song.title} />)}
      </div>
    </div>
  );
}

function SongDisplay({ song }: { song: Song }) {
  const url = song.cover ? URL.createObjectURL(song.cover) : null;
  useEffect(() => {
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [url]);
  return (
    <div className="flex gap-3 items-center">
      <Image src={url ? url : defaultCover} alt="Song Cover" width={256} height={256} className="h-32 w-32 rounded-md" />
      <div className="flex flex-col text-start">
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

function UploadSongs() {
  async function processFiles() {
    try {
      // @ts-expect-error - api exists despite not having a type :3
      const handles: FileSystemFileHandle[] = await window.showOpenFilePicker({
        multiple: true,
        types: [{
          description: "Song files",
          accept: { "audio/*": [".flac", ".mp3", ".ogg", ".aac", ".m4a", ".wav"] }
        }]
      });
      const newSongs: Song[] = [];
      for (const handle of handles) {
        const file = await handle.getFile();
        const metadata = await parseBlob(file);

        const picture = metadata.common.picture;
        let coverBlob: Blob | null = null;
        if (picture) {
          const uint8 = new Uint8Array(picture[0].data);
          coverBlob = new Blob([uint8], { type: picture[0].format });
        }
        newSongs.push({
          title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
          album: metadata.common.album,
          artists: metadata.common.artists,
          cover: coverBlob,
          lyrics: null,
          synced: false,
          audioHandle: handle
        });
      }
      await db.songs.bulkAdd(newSongs);
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") console.error(err);
    }
  }
  return <button type="button" onClick={processFiles} className="p-2 rounded-lg bg-violet-300 text-black mt-2">Select Songs</button>
}