import { CoverArtArchiveApi } from 'musicbrainz-api';
import { type NextRequest, NextResponse } from 'next/server';
import defaultCover from "@/public/defaultCover.jpeg";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const caaAPI = new CoverArtArchiveApi();
  const mbid = req.nextUrl.searchParams.get("mbid");
  let coverImageURL = new URL(defaultCover.src, req.nextUrl.origin).toString();
  try {
    if (mbid) {
      const covers = await caaAPI.getReleaseCover(mbid, "front");
      if (covers.url) coverImageURL = covers.url;
    }
  } catch {}
  const res = await fetch(coverImageURL);
  return new NextResponse(res.body, { status: res.status });
}