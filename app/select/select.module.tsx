"use client";
import { parseBlob } from "music-metadata";
import { showOpenFilePicker } from "show-open-file-picker";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faSearch } from "@fortawesome/free-solid-svg-icons";
import { MusicBrainzApi } from "musicbrainz-api";

export function UploadSongs() {
  async function processFiles() {
    try {
      const handles: FileSystemFileHandle[] = await showOpenFilePicker({
        multiple: true,
        types: [{
          description: "Song files",
          accept: { "audio/*": [".flac", ".mp3", ".ogg", ".aac", ".m4a", ".wav"] }
        }]
      });
      const newSongs: Song[] = [];
      for (const handle of handles) {
        const file = await handle.getFile();
        const metadata = await parseBlob(file);

        const picture = metadata.common.picture;
        let coverBlob: Blob | null = null;
        if (picture) {
          const uint8 = new Uint8Array(picture[0].data);
          coverBlob = new Blob([uint8], { type: picture[0].format });
        }
        newSongs.push({
          title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
          album: metadata.common.album,
          artists: metadata.common.artists,
          cover: coverBlob,
          fromUser: true,
          lyrics: "",
          synced: false,
          audioHandle: handle,
          lyricFileName: `${file.name.split(/\.[^/.]+$/)[0]}.lrc`,
          duration: metadata.format.duration || 0,
          fileID: `${file.name}-${file.size}-${file.lastModified}`
        });
      }
      await db.songs.bulkAdd(newSongs);
    } catch (err) {
      if (!(err as DOMException).message.includes("The user aborted a request.")) console.error(err);
    }
  }
  return <button type="button" onClick={processFiles} className="p-2 rounded-lg bg-violet-300 text-black mt-2 hover:text-sky-500"><FontAwesomeIcon icon={faMusic} /> Select Songs</button>
}

export function SearchSongs() {
  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const mbApi = new MusicBrainzApi({
    appName: 'LyricKit',
    appVersion: process.env.IMAGE_TAG || "Unknown",
    appContactInfo: 'https://github.com/aelithron/lyrickit',
  });
  async function searchSongs() {
    
  }
  return (
    <form onSubmit={searchSongs} className="flex flex-col mt-2 gap-1">
      <label htmlFor="title" className="text-sm font-semibold">Title</label>
      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-500 rounded-lg p-1" placeholder="Enter a title..." />
      <label htmlFor="artist">Artist</label>
      <input type="text" id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} className="bg-slate-500 rounded-lg p-1" placeholder="Enter an artist..." />
      <label htmlFor="album">Album</label>
      <input type="text" id="album" value={album} onChange={(e) => setAlbum(e.target.value)} className="bg-slate-500 rounded-lg p-1" placeholder="Enter an album..." />
      <button type="submit" className="bg-violet-300 p-2 rounded-lg text-black mt-3"><FontAwesomeIcon icon={faSearch} /> Search</button>
    </form>
  )
}