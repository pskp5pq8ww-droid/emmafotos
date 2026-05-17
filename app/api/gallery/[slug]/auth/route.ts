import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { createGallerySession } from "@/lib/gallery-auth/session";
import { getRequestOrigin } from "@/lib/security/request-origin";
import { verifyPin } from "@/lib/security/pin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const formData = await request.formData();
  const pin = String(formData.get("pin") ?? "");
  const db = await readDB();
  const gallery = db.galleries.find((item) => item.slug === slug && item.isActive);
  const client = gallery
    ? db.clients.find((item) => item.id === gallery.clientId)
    : undefined;
  const origin = getRequestOrigin(request);

  if (!gallery || !client || !(await verifyPin(pin, client.pinHash))) {
    return NextResponse.redirect(new URL(`/gallery/${slug}?error=1`, origin), 303);
  }

  await createGallerySession(slug, client.id);
  return NextResponse.redirect(new URL(`/gallery/${slug}/view`, origin), 303);
}
