"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { SongCard } from "../(ui)/display.module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSave, faSync } from "@fortawesome/free-solid-svg-icons";

export default function EditLyrics() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [activeLyrics, setActiveLyrics] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(true);
  async function changeActive(song: Song) {
    if (activeSong !== null && !saved) {
      await saveSong();
      setSaved(true);
    }
    setActiveSong(song);
    setActiveLyrics(song.lyrics);
  }
  async function saveSong() {
    if (!activeSong || !activeLyrics || activeLyrics === "") return;
    activeSong.lyrics = activeLyrics;
    setActiveSong(activeSong);
    await db.songs.update(activeSong.id, activeSong);
  }
  function changeLyrics(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setActiveLyrics(e.target.value);
    setSaved(false);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveSong();
    setSaved(true);
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!activeSong || !activeLyrics || activeLyrics === "") return;
      activeSong.lyrics = activeLyrics;
      setActiveSong(activeSong);
      db.songs.update(activeSong.id, activeSong);
      setSaved(true);
    }, 750);
    return () => clearTimeout(timeout);
  }, [activeLyrics, activeSong]);

  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="flex flex-col text-center p-3 gap-2 md:col-span-2">
        {activeSong ? <form className="flex flex-col gap-2 p-2 items-center" onSubmit={handleSubmit}>
          <textarea className="bg-slate-500 rounded-md p-1 w-full" placeholder="Write lyrics here..." value={activeLyrics} onChange={changeLyrics} rows={6} />
          <div className="flex gap-2 items-center">
            <button type="submit" className="bg-violet-300 rounded-lg text-black p-1"><FontAwesomeIcon icon={faSave} /> Save</button>
            <p className="bg-slate-500 rounded-lg p-1 text-sm">Status: {saved ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faSync} />}</p>
          </div>
        </form> :
        <p className="bg-slate-500 rounded-md p-1 w-full">Select a song from the menu to edit the lyrics!</p>}
      </div>
      <SongList songData={songData} changeActive={changeActive} />
    </div>
  );
}

function SongList({ songData, changeActive }: { songData: Song[] | undefined, changeActive: (song: Song) => void }) {
  return (
    <div className="flex flex-col bg-slate-500 rounded-lg text-center p-3 gap-2">
      <h1 className="text-xl font-semibold mb-2">Selected Songs</h1>
      {songData?.map((song) => <button key={song.title} type="button" onClick={() => changeActive(song)}><SongCard song={song} /></button>)}
      {songData?.length === 0 && <div className="flex flex-col gap-2">
        <p>You haven't added any songs yet!</p>
        <Link href={"/select"} className="p-2 rounded-lg bg-violet-300 text-black">Pick Songs</Link>
      </div>}
      {songData === undefined && <p>Loading songs...</p>}
    </div>
  );
}