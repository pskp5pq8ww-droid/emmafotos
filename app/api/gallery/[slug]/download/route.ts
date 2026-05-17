import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getUploadsDir, readDB } from "@/lib/db";
import { prepareZip, streamZip } from "@/lib/files/zip";
import { resolveGalleryAccess } from "@/lib/galleries/access";
import { hasGallerySession } from "@/lib/gallery-auth/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const db = await readDB();
  const access = resolveGalleryAccess(db, slug);

  if (
    access.state !== "ready" ||
    !(await hasGallerySession(access.canonicalSlug, access.gallery.clientId))
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gallery = access.gallery;
  const images = db.galleryImages.filter((image) => image.galleryId === gallery.id);

  if (!images.length) {
    return NextResponse.json({ error: "No images" }, { status: 404 });
  }

  const zip = await prepareZip(
    images.map((image) => ({
      absolutePath: path.join(getUploadsDir(), image.originalPath ?? image.path),
      filename: image.filename,
    })),
  );

  if (!zip.files.length) {
    return NextResponse.json({ error: "No downloadable images" }, { status: 404 });
  }

  const stream = Readable.toWeb(Readable.from(streamZip(zip.files)));

  return new NextResponse(stream as ReadableStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${gallery.slug}.zip"`,
      "Content-Length": String(zip.byteLength),
      "Cache-Control": "private, no-store",
    },
  });
}
