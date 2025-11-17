import type { Song } from "@/lyrickit";

export async function lrcLibFetch(song: Song) {
  // note: am using undefined because i've seen it on lrclib before
  const result = await fetch(`https://lrclib.net/api/get?track-name=${song.title.replaceAll(" ", "+")}&album-name=${(song.artists || ["undefined"]).join(" ").replaceAll(" ", "+")}&album-name=${(song.album || "undefined").replaceAll(" ", "+")}&duration=${song.duration}`);
  console.log(await result.json());
}