"use client";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { SongCard } from "../(ui)/display.module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight, faArrowUp, faSync } from "@fortawesome/free-solid-svg-icons";

export default function SyncLyrics() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="flex flex-col text-center p-3 gap-2 md:col-span-2">
        {activeSong ? <div>
          <p className="text-lg font-semibold">{activeSong.title} - {(activeSong.artists || ["Unknown Artist"]).join()}</p>
          <LyricDisplay song={activeSong} />
        </div> : <div className="bg-slate-500 rounded-md p-1 w-full">
          <p>Select a song from the menu to sync the lyrics!</p>
          <p>Tip: You can use the arrows and spacebar to sync on desktop.</p>
        </div>}
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
  const [lyricLines, setLyricLines] = useState<string[]>(() => song.lyrics.split(/\n/));
  const [cursorPosition, setPosition] = useState<number>(0);
  const cursorRef = useRef<number>(cursorPosition);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { cursorRef.current = cursorPosition }, [cursorPosition]);
  useEffect(() => {
    setLyricLines(song.lyrics.split(/\n/));
    setPosition(0);
  }, [song.lyrics]);
  const syncLine = useCallback(async () => {
    const pos = cursorRef.current;
    const newLines = [...lyricLines];
    if (!newLines[pos].match(/^\[\d{2}:\d{2}\.\d{2}\]/)) newLines[pos] = `[00:00.00] ${newLines[pos]}`; // using time placeholder until i add play-tracking :3
    const updatedLyrics = newLines.join("\n");
    let syncedStatus: boolean = newLines.length >= 1;
    for (const line of newLines) if (!line.match(/^\[\d{2}:\d{2}\.\d{2}\]/)) syncedStatus = false;
    await db.songs.update(song.id, { lyrics: updatedLyrics, lyricSource: "user", synced: syncedStatus });
    setLyricLines(newLines);
    const nextPos = Math.min(pos + 1, newLines.length - 1);
    setPosition(nextPos);
  }, [song.id, lyricLines]);
  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        await syncLine();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setPosition((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPosition((prev) => Math.min(prev + 1, lyricLines.length - 1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lyricLines.length, syncLine]);
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLElement>(`[data-index="${cursorPosition}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [cursorPosition]);
  return (
    <div className="text-start mt-2 flex flex-col gap-2">
      <div className="flex sticky top-4 justify-end gap-2">
        <button type="button" onClick={syncLine} className="p-1 gap-2 text-lg bg-violet-300 text-black rounded-lg"><FontAwesomeIcon icon={faSync} /> Sync</button>
        <button type="button" onClick={() => setPosition((prev) => Math.max(prev - 1, 0))} className="p-1 text-lg bg-violet-300 text-black rounded-lg"><FontAwesomeIcon icon={faArrowUp} /></button>
        <button type="button" onClick={() => setPosition((prev) => Math.min(prev + 1, lyricLines.length - 1))} className="p-1 text-lg bg-violet-300 text-black rounded-lg"><FontAwesomeIcon icon={faArrowDown} /></button>
      </div>
      <div ref={containerRef} className="overflow-y-auto">
        {/** biome-ignore lint/suspicious/noArrayIndexKey: index-based key is the only thing that makes sense here */}
        {lyricLines.map((line, index) => <div key={index} data-index={index}>
          {index === cursorPosition && <FontAwesomeIcon className="mr-1" icon={faArrowRight} />}
          {line}
        </div>)}
      </div>
    </div>
  );
}