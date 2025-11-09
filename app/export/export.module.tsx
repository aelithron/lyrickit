"use client";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLiveQuery } from "dexie-react-hooks";
import JSZip from "jszip";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { SongCard } from "../(ui)/display.module";
import Link from "next/link";

export default function ExportLyrics() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const lyricSongs = songData?.filter((songItem) => songItem.lyrics !== "");
  function downloadLRC(song: Song) {
    const url = URL.createObjectURL(new Blob([song.lyrics], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', song.lyricFileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    URL.revokeObjectURL(url);
  }
  async function downloadAllLRCs() {
    const zip = new JSZip();
    for (const song of songData ?? []) zip.file(song.lyricFileName, song.lyrics);
    const url = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'lyrics.zip');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return (
    <div className="flex flex-col gap-2">
      <button type="button" className="text-lg mt-2 p-1 px-2 bg-violet-300 text-black rounded-lg w-fit hover:text-sky-500" onClick={() => downloadAllLRCs()}><FontAwesomeIcon icon={faDownload} /> Download All</button>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-4">
        {lyricSongs?.map((song) => <div className="flex bg-slate-500 p-2 rounded-lg justify-between" key={song.id}>
          <SongCard song={song} />
          <button type="button" className="hover:text-sky-500" onClick={() => downloadLRC(song)}><FontAwesomeIcon icon={faDownload} size="xl" /></button>
        </div>)}
        {lyricSongs?.length === 0 && <div className="flex flex-col gap-2">
          <p>You don't have any songs with lyrics yet!</p>
          <div className="flex gap-2">
            <Link href={"/find"} className="p-2 rounded-lg bg-violet-300 text-black">Search Lyrics</Link>
            <Link href={"/edit"} className="p-2 rounded-lg bg-violet-300 text-black">Edit Lyrics</Link>
          </div>
        </div>}
        {songData === undefined && <p>Loading songs...</p>}
      </div>
    </div>
  );
}