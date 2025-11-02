"use client";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useState } from "react";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { SongCard } from "../(ui)/display.module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSync } from "@fortawesome/free-solid-svg-icons";

export default function SyncLyrics() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="flex flex-col text-center p-3 gap-2 md:col-span-2">
        {activeSong ? <div>
          <p className="text-lg font-semibold">{activeSong.title} - {(activeSong.artists || ["Unknown Artist"]).join()}</p>
          <LyricDisplay song={activeSong} />
        </div> : <p className="bg-slate-500 rounded-md p-1 w-full">Select a song from the menu to sync the lyrics!</p>}
      </div>
      <SongList songData={songData} changeActive={(song) => setActiveSong(song)} />
    </div>
  );
}

function SongList({ songData, changeActive }: { songData: Song[] | undefined, changeActive: (song: Song) => void }) {
  const syncedData = songData?.filter((songItem) => songItem.lyrics !== "");
  return (
    <div className="flex flex-col bg-slate-500 rounded-lg text-center p-3 gap-2 h-min">
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

function LyricDisplay({ song }: { song: Song }) {
  const [lyricLines, setLyricLines] = useState<string[]>(song.lyrics.split(/\n/));
  const [cursorPosition, setPosition] = useState<number>(0);
  async function syncLine() {
    // using time placeholder until i add play-tracking :3
    lyricLines[cursorPosition] = `[00:00.00] ${lyricLines[cursorPosition]}`;
    setLyricLines(lyricLines);
    setPosition(Math.min(cursorPosition + 1, lyricLines.length - 1));
    song.lyrics = lyricLines.join("\n");
    await db.songs.update(song.id, song);
  }
  // TODO: event listener for listening to space button and triggering syncLine
  // TODO: listen to up and down arrows to change position
  return (
    <div className="text-start mt-2 flex flex-col gap-2">
      <button type="button" onClick={syncLine} className="flex justify-center items-middle p-1 gap-2 sticky top-2 bg-violet-300 text-black rounded-lg"><FontAwesomeIcon icon={faSync} /> Sync</button>
      {/** biome-ignore lint/suspicious/noArrayIndexKey: index key is the only thing that makes sense here */}
      {lyricLines.map((line, index) => <div key={index}>
        {index === cursorPosition && <FontAwesomeIcon className="mr-1" icon={faArrowRight} />}
        {line}
      </div>)}
    </div>
  );
}