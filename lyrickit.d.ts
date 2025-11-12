export type Song = {
  id?: number;
  title: string;
  album?: string;
  artists?: string[];
  cover: Blob | null;
  fromUser: boolean;
  lyrics: string;
  synced: boolean;
  audioHandle: FileSystemFileHandle | null;
  lyricFileName: string;
  duration: number;
  fileID: string | null;
};