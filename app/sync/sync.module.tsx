"use client";
// biome-ignore assist/source/organizeImports: idk how to sort these properly
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight, faArrowUp, faPlay, faSync } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState, memo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";
import { SongCard } from "../(ui)/display.module";
import type { Song } from "@/lyrickit";
import { Space_Mono } from "next/font/google";
import { showOpenFilePicker } from "show-open-file-picker";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: "400" });

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

export const SongList = memo(function SongList({ songData, changeActive }: { songData: Song[] | undefined, changeActive: (song: Song) => void }) {
  const syncedData = songData?.filter((songItem) => songItem.lyrics !== "");
  return (
    <div className="flex flex-col bg-slate-500 rounded-lg text-center p-3 gap-2 h-min">
      <h1 className="text-xl font-semibold mb-2">Songs with Lyrics</h1>
  {syncedData?.map((song) => <button key={song.id} type="button" onClick={() => changeActive(song)}><SongCard song={song} /></button>)}
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
});

function LyricDisplay({ song }: { song: Song }) {
  const [lyricLines, setLyricLines] = useState<string[]>(() => song.lyrics.split(/\n/));
  const [cursorPosition, setPosition] = useState<number>(0);
  const [time, setTime] = useState(0);
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
    if (newLines[pos].match(/^\[\d{2}:\d{2}\.\d{2}\]/)) {
      newLines[pos] = `${lrcTimeFormatter(time)} ${newLines[pos].split(/^\[\d{2}:\d{2}\.\d{2}\]/)[1].trim()}`
    } else newLines[pos] = `${lrcTimeFormatter(time)} ${newLines[pos]}`;
    const updatedLyrics = newLines.join("\n");
    let syncedStatus: boolean = newLines.length >= 1;
    for (const line of newLines) if (!line.match(/^\[\d{2}:\d{2}\.\d{2}\]/)) syncedStatus = false;
    await db.songs.update(song.id, { lyrics: updatedLyrics, lyricSource: "user", synced: syncedStatus });
    setLyricLines(newLines);
    const nextPos = Math.min(pos + 1, newLines.length - 1);
    setPosition(nextPos);
  }, [song.id, lyricLines, time]);
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
      <div className="flex flex-col md:flex-row gap-2 sticky top-4 justify-center md:justify-between">
        <MusicSyncingPlayer song={song} onTimeChange={setTime} />
        <div className="flex gap-2">
          <button type="button" onClick={syncLine} className="p-1 gap-2 text-lg bg-violet-300 text-black rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faSync} /> Sync</button>
          <button type="button" onClick={() => setPosition((prev) => Math.max(prev - 1, 0))} className="p-1 text-lg bg-violet-300 text-black rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faArrowUp} /></button>
          <button type="button" onClick={() => setPosition((prev) => Math.min(prev + 1, lyricLines.length - 1))} className="p-1 text-lg bg-violet-300 text-black rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faArrowDown} /></button>
        </div>
      </div>
      <div ref={containerRef} className="overflow-y-auto">
        {/** biome-ignore lint/suspicious/noArrayIndexKey: index-based key is the only thing that makes sense here */}
        {lyricLines.map((line, index) => <div key={index} data-index={index} className="flex">
          <div className="w-32">
            {index === cursorPosition && <div className="flex items-center">
              <p className={spaceMono.className}>{lrcTimeFormatter(time)}</p>
              <FontAwesomeIcon className="mx-1" icon={faArrowRight} />
            </div>}
          </div>
          {line}
        </div>)}
      </div>
    </div>
  );
}

export function MusicSyncingPlayer({ song, onTimeChange }: { song: Song, onTimeChange: Dispatch<SetStateAction<number>> }) {
  const [songFile, setSongFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    let objectUrl: string | null = null;
    if (songFile) {
      objectUrl = URL.createObjectURL(songFile);
      setUrl(objectUrl);
    } else {
      setUrl(null);
    }
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [songFile]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: this is the only way i can figure out making the music player reload on song change
  useEffect(() => setSongFile(null), [song.id]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: only way to make this change when song is selected
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let frame: number;
    const update = () => {
      if (!audio.paused) onTimeChange(audio.currentTime);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [songFile, onTimeChange]);
  async function loadSong() {
    if (song.audioHandle) {
      try {
        const file = await song.audioHandle.getFile();
        if (song.fileID !== `${file.name}-${file.size}-${file.lastModified}`) {
          const value = confirm(`The file you selected, "${file.name}", doesn't match the one you originally selected! Still import it?`);
          if (!value) return;
        }
        setSongFile(file);
        return;
      } catch { }
    }
    try {
      const handles: FileSystemFileHandle[] = await showOpenFilePicker({
        multiple: false,
        types: [{
          description: `Song file (for "${song.title}"${song.artists && ` - ${(song.artists || ["Unknown Artist"]).join()}`})`,
          accept: { "audio/*": [".flac", ".mp3", ".ogg", ".aac", ".m4a", ".wav"] }
        }]
      });
      if (!handles || !handles[0]) return;
      const file = await handles[0].getFile();
      if (song.fileID !== `${file.name}-${file.size}-${file.lastModified}`) {
        const value = confirm(`The file you selected, "${file.name}", doesn't match the one you originally selected! Still import it?`);
        if (!value) return;
      }
      song.audioHandle = handles[0];
      await db.songs.update(song.id, song);
      setSongFile(file);
    } catch (err) {
      if (!(err as DOMException).message.includes("The user aborted a request.")) console.error(err);
    }
  }
  return (
    <div>
      {!songFile && <button type="button" onClick={loadSong} className="bg-violet-300 rounded-lg p-1 text-black hover:text-sky-500"><FontAwesomeIcon icon={faPlay} /> Start</button>}
      {/** biome-ignore lint/a11y/useMediaCaption: content is variable, can't caption beforehand! */}
      {songFile && <audio ref={audioRef} src={url || undefined} controls={true} autoPlay={true} />}
    </div>
  );
}
function lrcTimeFormatter(time: number) {
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(Math.floor(time % 60)).padStart(2, "0");
  const xx = String(Math.floor((time - Math.floor(time)) * 100)).padStart(2, "0");
  return `[${mm}:${ss}.${xx}]`;
}