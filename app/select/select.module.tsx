"use client"
import { type Dispatch, type SetStateAction, useState } from "react";
import type { Song } from "@/lyrickit";

export default function SelectDisplay() {
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
        {songData.map((song) => (
          <div key={song.title} className="flex gap-2">
            {/** biome-ignore lint/performance/noImgElement: cover is from filesystem, doesn't have a defined source */}
            {song.cover && <img src={song.cover} alt="Song Cover" />}
            <div className="flex flex-col gap-1">
              <p>{song.title}</p>
              <p>by {song.artists.join()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadSongs({ data, setData }: { data: Song[], setData: Dispatch<SetStateAction<Song[]>> }) {
  const [songFiles, setSongFiles] = useState<File[]>([]);
  return (
    <form>

    </form>
  )
}