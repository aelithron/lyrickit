"use client"
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import type { Song } from "@/lyrickit";
import { parseBlob } from "music-metadata";

export default function SongSelector() {
  const [songData, setSongData] = useState<Song[]>([]);

  return (
    <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 md:col-span-2">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold">Upload Songs</h1>
          <UploadSongs data={songData} setData={setSongData} />
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-center align-middle">OR</p>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold">Search for Songs</h1>
          <p>Coming Soon...</p>
        </div>
      </div>
      <div className="flex flex-col bg-slate-500 rounded-lg text-center p-2">
        <h1 className="text-xl font-semibold">Selected Songs</h1>
        <SongDisplay data={songData} />
      </div>
    </div>
  );
}

function SongDisplay({ data }: { data: Song[] }) {
  return (
    <div>
      {data.map((song) => (
        <div key={song.title} className="flex gap-2">
          {/** biome-ignore lint/performance/noImgElement: cover is from filesystem, doesn't have a defined source */}
          {song.cover && <img src={song.cover} alt="Song Cover" />}
          <div className="flex flex-col gap-1">
            <p>{song.title}</p>
            <p>on {song.album || "Unknown Album"}</p>
            <p>by {(song.artists || ["Unknown Artist"]).join()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function UploadSongs({ data, setData }: { data: Song[], setData: Dispatch<SetStateAction<Song[]>> }) {
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

        const picture = metadata.common.picture?.[0];
        let coverBlob: Blob | null = null;
        if (picture) {
          const uint8 = new Uint8Array(picture.data);
          coverBlob = new Blob([uint8], { type: picture.format });
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
      setData([...data, ...newSongs]);
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") {
        console.error(err);
      }
    }
  }
  return <button type="button" onClick={processFiles} className="p-2 rounded-lg bg-violet-300 text-black mt-2">Select Songs</button>
}