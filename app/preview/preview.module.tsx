"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { type Dispatch, type SetStateAction, useCallback, useState } from "react";
import { Lrc, type LrcLine } from "react-lrc";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { MusicSyncingPlayer, SongList } from "../sync/sync.module";

export default function PreviewSong() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [time, setTime] = useState(0);
  const changeActive = useCallback((song: Song) => setActiveSong(song), []);
  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="flex flex-col gap-2">
        <SongList songData={songData} changeActive={changeActive} />
        {activeSong && <SongDisplay song={activeSong} setTime={setTime} />}
      </div>
      <div className="flex flex-col text-center p-3 gap-2 md:col-span-2">
        {activeSong ? <PreviewLines song={activeSong} time={time} /> : <p className="bg-slate-500 rounded-md p-1 w-full">Select a song to preview!</p>}
      </div>
    </div>
  );
}

function PreviewLines({ song, time }: { song: Song, time: number }) {
  const lineRenderer = useCallback(({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
    <div className={`min-h-2 p-2 text-lg text-center ${active ? "text-violet-300" : "text-white"}`}>{content}</div>
  ), []);
  return (
    <div>
      {song.synced ?
        <Lrc lrc={song.lyrics} lineRenderer={lineRenderer} currentMillisecond={time * 1000} recoverAutoScrollInterval={3000} /> :
        // biome-ignore lint/suspicious/noArrayIndexKey: best key method i can use here that is unique
        <div>{song.lyrics.split(/\n/).map((line, index) => <p key={index}>{line}</p>)}</div>
      }
    </div>
  );
}

function SongDisplay({ song, setTime }: { song: Song, setTime: Dispatch<SetStateAction<number>> }) {
  return (
    <div className="flex flex-col bg-slate-500 rounded-lg text-center justify-center items-center p-3 gap-1 h-min">
      <h1 className="text-lg font-semibold">{song.title}</h1>
      <h2>by {(song.artists || ["Unknown Artist"]).join()}</h2>
      <h2>on {song.album}</h2>
      <MusicSyncingPlayer song={song} onTimeChange={(newTime) => setTime(newTime)} />
    </div>
  )
}