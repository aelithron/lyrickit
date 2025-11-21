import { CoverArtArchiveApi } from 'musicbrainz-api';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const caaAPI = new CoverArtArchiveApi();
  const mbid = req.nextUrl.searchParams.get("mbid");
  if (!mbid) return NextResponse.json({ error: "No MusicBrainz ID provided!" }, { status: 400 });
  let covers;
  try {
    covers = caaAPI.getReleaseCovers(mbid);
  }
}