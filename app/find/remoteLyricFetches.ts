import type { Song } from "@/lyrickit";

export type LyricSearchResult = {
  synced: boolean;
  lyrics: string;
  provider: "lrclib"; // add genius when it is ready
}

export async function lrcLibFetch(song: Song): Promise<LyricSearchResult[]> {
  // note: am using undefined because i've seen it on lrclib before
  const res = await fetch(`https://lrclib.net/api/get?track_name=${song.title.replaceAll(" ", "+")}&artist_name=${(song.artists || ["undefined"]).join(" ").replaceAll(" ", "+")}&album_name=${(song.album || "undefined").replaceAll(" ", "+")}&duration=${song.duration}`, { headers: {"User-Agent": `LyricKit/${process.env.IMAGE_TAG || "Unknown"} (https://github.com/aelithron/LyricKit)`} });
  if (!res.ok) return [];
  const lyricJSON = await res.json();
  if (lyricJSON.instrumental as boolean) return [];
  const results: LyricSearchResult[] = [];
  if (lyricJSON.syncedLyrics) results.push({ synced: true, lyrics: lyricJSON.syncedLyrics as string, provider: "lrclib" });
  if (lyricJSON.plainLyrics) results.push({ synced: false, lyrics: lyricJSON.plainLyrics as string, provider: "lrclib" });
  return results;
}

// todo: add Genius provider