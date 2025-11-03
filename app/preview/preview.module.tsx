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
  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="flex flex-col text-center p-3 gap-2 md:col-span-2">
        {activeSong ? <div>
          <p className="text-lg font-semibold">{activeSong.title} - {(activeSong.artists || ["Unknown Artist"]).join()}</p>
          <PreviewLines song={activeSong} time={time} />
        </div> : <div className="bg-slate-500 rounded-md p-1 w-full">
          <p>Select a song to preview!</p>
        </div>}
      </div>
      {activeSong ? 
        <SongDisplay song={activeSong} changeActive={setActiveSong} setTime={setTime} /> : 
        <SongList songData={songData} changeActive={(song) => setActiveSong(song)} />
      }
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
      {song.synced && <Lrc lrc={song.lyrics} lineRenderer={lineRenderer} currentMillisecond={time * 1000} recoverAutoScrollInterval={3000} />}
    </div>
  );
}

function SongDisplay({ song, changeActive, setTime }: { song: Song, changeActive: Dispatch<SetStateAction<Song | null>>, setTime: Dispatch<SetStateAction<number>> }) {
  return (
    <div className="flex flex-col w-max rounded-lg">
      <div className="flex justify-center items-center">
        <MusicSyncingPlayer song={song} onTimeChange={(newTime) => setTime(newTime)} />
      </div>
    </div>
  )
}