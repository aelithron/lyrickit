import Dexie, { type EntityTable } from 'dexie';
import type { Song } from '@/lyrickit';

const db = new Dexie('SongsDatabase') as Dexie & { songs: EntityTable<Song, 'id'> };
db.version(1).stores({ songs: '++id, title, album, artists, cover, lyrics, synced, audioHandle' });
export { db };