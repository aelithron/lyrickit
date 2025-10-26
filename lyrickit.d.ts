export type Song = {
  id?: number;
  title: string;
  album?: string;
  artists?: string[];
  cover: Blob | null;
  lyrics: string;
  synced: boolean;
  audioHandle: FileSystemFileHandle | null;
};