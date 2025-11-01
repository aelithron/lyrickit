"use client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

export default function LyricFinder() {
  const songData = useLiveQuery(() => db.songs.toArray());
  const missingLyrics = songData?.filter((song) => song.lyrics === "");
  const unsyncedLyrics = songData?.filter((song) => (song.lyrics !== "" && !song.synced));
  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 gap-4">
      <div className="flex flex-col text-center p-3 gap-2">
        <h1 className="text-xl font-semibold">Missing</h1>
        {missingLyrics?.map((song) => (
          <div key={song.title}>
            <p>{song.title} - {song.album || "Unknown Album"} (by {(song.artists || ["Unknown Artist"]).join()})</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col text-center p-3 gap-2">
        <h1 className="text-xl font-semibold">Unsynced</h1>
        {unsyncedLyrics?.map((song) => (
          <div key={song.title}>
            <p>{song.title} - {song.album || "Unknown Album"} (by {(song.artists || ["Unknown Artist"]).join()})</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-slate-500 rounded-lg text-center p-3 gap-2 h-min">
        <h1 className="text-xl font-semibold">Settings</h1>
        <h2 className="text-lg text-start">Platforms</h2>
        <form className="flex flex-col text-start">
          <div>
            <input id="lrclib" type="checkbox" />
            <label htmlFor="lrclib" className="ml-1">LRCLIB</label>
          </div>
          <div>
            <input id="musixmatch" type="checkbox" />
            <label htmlFor="musixmatch" className="ml-1">Musixmatch</label>
          </div>
          <div>
            <input id="genius" type="checkbox" />
            <label htmlFor="genius" className="ml-1">Genius</label>
          </div>
        </form>
        <button type="button"><FontAwesomeIcon icon={faSearch} /> Search</button>
      </div>
    </div>
  )
}