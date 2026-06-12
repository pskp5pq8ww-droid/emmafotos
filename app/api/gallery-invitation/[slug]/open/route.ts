import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { isInvitationAvailable } from "@/lib/galleries/invitation";
import { isSafeExternalUrl } from "@/lib/galleries/slug";
import { getRequestOrigin } from "@/lib/security/request-origin";

/**
 * GET /api/gallery-invitation/[slug]/open
 *
 * Validates the invitation exists, is active and not expired, then 302-redirects
 * to the external download link. The real link is never exposed in the public
 * page HTML — it only lives server-side and is surfaced here on demand.
 *
 * If unavailable, redirects back to the public page which shows a friendly notice.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const origin = getRequestOrigin(request);

  const db = await readDB();
  const invitation = db.externalInvitations.find((inv) => inv.slug === slug);

  // Not found, inactive, expired, or an unsafe stored link → bounce to the page.
  if (
    !invitation ||
    !isInvitationAvailable(invitation) ||
    !isSafeExternalUrl(invitation.externalDownloadLink)
  ) {
    return NextResponse.redirect(
      new URL(`/gallery-invitation/${slug}`, origin),
      302,
    );
  }

  return NextResponse.redirect(invitation.externalDownloadLink, 302);
}
