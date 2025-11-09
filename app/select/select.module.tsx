"use client";
import { parseBlob } from "music-metadata";
import { showOpenFilePicker } from "show-open-file-picker";
import type { Song } from "@/lyrickit";
import { db } from "@/utils/db";

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
          lyricSource: null,
          lyrics: "",
          synced: false,
          audioHandle: handle,
          lyricFileName: `${file.name.split( /\.[^/.]+$/)[0]}.lrc`,
          fileID: `${file.name}-${file.size}-${file.lastModified}`
        });
      }
      await db.songs.bulkAdd(newSongs);
    } catch (err) {
      if (!(err as DOMException).message.includes("The user aborted a request.")) console.error(err);
    }
  }
  return <button type="button" onClick={processFiles} className="p-2 rounded-lg bg-violet-300 text-black mt-2 hover:text-sky-500">Select Songs</button>
}