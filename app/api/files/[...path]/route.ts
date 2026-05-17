import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getUploadsDir } from "@/lib/db";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;

  if (!parts.length || parts.some((part) => part === ".." || part.includes("\0"))) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const uploadsRoot = path.resolve(getUploadsDir());
  const filePath = path.resolve(uploadsRoot, ...parts);

  if (!filePath.startsWith(`${uploadsRoot}${path.sep}`)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const extension = path.extname(filePath).toLowerCase();
    const headers = new Headers({
      "Content-Type": contentTypes[extension] ?? "application/octet-stream",
      "Content-Length": String(fileStat.size),
      "Cache-Control": "private, max-age=31536000, immutable",
    });

    if (new URL(request.url).searchParams.get("download") === "1") {
      headers.set(
        "Content-Disposition",
        `attachment; filename="${path.basename(filePath)}"`,
      );
    }

    const stream = Readable.toWeb(createReadStream(filePath));
    return new NextResponse(stream as ReadableStream, { headers });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
