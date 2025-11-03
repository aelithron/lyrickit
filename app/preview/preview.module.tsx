"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { type Dispatch, type SetStateAction, useCallback, useState } from "react";
import Image from "next/image";
import { Lrc, type LrcLine } from "react-lrc";
import defaultCover from "@/public/defaultCover.jpeg";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { MusicSyncingPlayer, SongList } from "../sync/sync.module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function PreviewSong() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [time, setTime] = useState(0);
  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className={activeSong ? "hidden absolute" : ""}><SongList songData={songData} changeActive={(song) => setActiveSong(song)} /></div>
      {activeSong && <SongDisplay song={activeSong} changeActive={setActiveSong} setTime={setTime} />}
      <div className="flex flex-col text-center p-3 gap-2 md:col-span-2">
        {activeSong ? <PreviewLines song={activeSong} time={time} /> : <p className="bg-slate-500 rounded-md p-1 w-full">Select a song to preview!</p>}
      </div>
    </div>
  );
}

function PreviewLines({ song, time }: { song: Song, time: number }) {
  const lineRenderer = useCallback(
    ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
      <div className={`min-h-2 p-2 text-lg text-center ${active ? "text-violet-300" : "text-white"}`}>{content}</div>
    ),
    []
  );

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

function SongDisplay({ song, changeActive, setTime }: { song: Song, changeActive: Dispatch<SetStateAction<Song | null>>, setTime: Dispatch<SetStateAction<number>> }) {
  const url = song.cover ? URL.createObjectURL(song.cover) : null;
  function closeDisplay() {
    changeActive(null);
    setTime(0);
  }
  return (
    <div className="flex flex-col bg-slate-500 rounded-lg text-center justify-center items-center p-3 gap-1 h-min">
      <Image src={url ? url : defaultCover} alt="Song Cover" width={256} height={256} className="h-64 w-64 rounded-md" />
      <h1 className="text-lg font-semibold">{song.title}</h1>
      <h2>by {(song.artists || ["Unknown Artist"]).join()}</h2>
      <h2>on {song.album}</h2>
      <MusicSyncingPlayer song={song} onTimeChange={(newTime) => setTime(newTime)} />
      <button type="button" className="bg-violet-300 rounded-lg p-1 text-black" onClick={closeDisplay}><FontAwesomeIcon icon={faArrowLeft} /> Go Back</button>
    </div>
  )
}