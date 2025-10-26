export type Song = {
  id?: number;
  title: string;
  album?: string;
  artists?: string[];
  cover: Blob | null;
  lyrics: string | null;
  synced: boolean;
  audioHandle: FileSystemFileHandle | null;
};