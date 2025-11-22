"use client";
import type { IRecordingMatch } from "musicbrainz-api";
import { useState } from "react";
import { SearchSongs, SelectFromSearch, UploadSongs } from "./select.module";

export default function SelectStateManager() {
  const [searchedSongs, setSearchedSongs] = useState<IRecordingMatch[] | null>(null);
  return (
    <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 md:grid-rows-1 mt-6 md:col-span-2">
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Upload Songs</h1>
        <UploadSongs />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Search for Songs</h1>
        <SearchSongs setSearchedSongs={setSearchedSongs} />
      </div>
      {searchedSongs && <SelectFromSearch searchedSongs={searchedSongs} setSearchedSongs={setSearchedSongs} />}
    </div>
  )
}