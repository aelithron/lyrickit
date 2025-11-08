export type Song = {
  id?: number;
  title: string;
  album?: string;
  artists?: string[];
  cover: Blob | null;
  lyricSource: "lrclib" | "genius" | "musixmatch" | "user" | null
  lyrics: string;
  synced: boolean;
  audioHandle: FileSystemFileHandle | null;
  lyricFileName: string;
  fileID: string | null;
};