"use client";
import type { IRecordingMatch } from "musicbrainz-api";
import { useState } from "react";
import { SearchSongs, SelectFromSearch, UploadSongs } from "./select.module";

export default function SelectStateManager() {
  const [searchedSongs, setSearchedSongs] = useState<IRecordingMatch[] | null>(null);
  return (
    <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 mt-6 md:col-span-2">
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Upload Songs</h1>
        <UploadSongs />
      </div>
      <p className="text-slate-700 dark:text-slate-300 text-center align-middle">OR</p>
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Search for Songs</h1>
        <SearchSongs setSearchedSongs={setSearchedSongs} />
      </div>
      {searchedSongs && <SelectFromSearch searchedSongs={searchedSongs} />}
    </div>
  )
}