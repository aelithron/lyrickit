"use client";
import { faArrowLeft, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SongCard } from "@/app/(ui)/display.module";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { lrcLibFetch, type LyricSearchResult } from "../remoteLyricFetches";
import { useRouter } from "next/navigation";

export default function LyricSearch({ id }: { id: string }) {
  const router = useRouter();
  const [songData, setSongData] = useState<Song | null | false>(null);
  const [searchResults, setResults] = useState<LyricSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  async function loadSong(id: string) {
    const song = await db.songs.get(Number.parseInt(id, 10));
    if (!song) {
      setSongData(false);
      return;
    }
    setSongData(song);
    const newResults: LyricSearchResult[] = [];
    newResults.push(...await lrcLibFetch(song));
    // todo: add Genius provider
    setResults(newResults);
    setLoading(false);
  }
  async function selectLyrics(id: number, result: LyricSearchResult) {
    let ok = false;
    if ((songData as Song).lyrics !== "") {
      ok = confirm("This song already has lyrics, overwrite them?");
    } else ok = true;
    if (ok) {
      db.songs.update(id, { lyrics: result.lyrics, synced: result.synced, fromUser: false });
      router.push("/find");
    }
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: only method that makes sense here
  useEffect(() => { loadSong(id) }, [id]);
  return (
    <div className="flex flex-col gap-4">
      {songData === null && <p className="text-lg">Loading...</p>}
      {songData === false && <div className="flex flex-col gap-2">
        <p className="text-lg">Unknown song!</p>
        <Link href={"/find"} className="bg-violet-300 text-black p-1 rounded-lg text-lg w-fit"><FontAwesomeIcon icon={faArrowLeft} /> Go Back</Link>
      </div>}
      {songData && <div className="flex flex-col gap-2">
        <SongCard song={songData} />
        {searchResults.map((result) => <div key={`${result.provider}-${result.synced}`}><ResultCard result={result} callback={() => selectLyrics(Number.parseInt(id, 10), result)} /></div>)}
        {loading && <p>Loading lyrics... (this may take a bit!)</p>}
      </div>}
    </div>
  );
}

function ResultCard({ result, callback }: { result: LyricSearchResult, callback: () => Promise<void> }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="gap-1 bg-slate-500 rounded-lg p-2 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {result.provider === "lrclib" && <p>LRCLIB</p>}
          {result.provider === "genius" && <p>Genius</p>}
          <p>-</p>
          {result.synced ? <p>Synced</p> : <p>Plain</p>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => callback()} className="bg-violet-300 text-black p-1 rounded-lg">Select</button>
          <button type="button" onClick={() => setOpen(!open)}><FontAwesomeIcon icon={open ? faCaretUp : faCaretDown} size="lg" /></button>
        </div>
      </div>
      {open && <div className="bg-slate-700 text-white p-2 rounded-md">
        {/** biome-ignore lint/suspicious/noArrayIndexKey: only sensible key here */}
        {result.lyrics.split(/\n/).map((line, index) => <p key={index}>{line}</p>)}
      </div>}
    </div>
  )
}