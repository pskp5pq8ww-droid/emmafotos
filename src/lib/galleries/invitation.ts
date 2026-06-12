import type { ExternalInvitation } from "@/lib/db/types";

/**
 * Returns true if the invitation has an expiry date that is strictly in the past.
 * Expiry is compared at day granularity in the server's local timezone.
 */
export function isInvitationExpired(invitation: ExternalInvitation): boolean {
  if (!invitation.expiresAt) return false;
  // Treat the expiry as end-of-day: available through the whole expiry date.
  const expiry = new Date(`${invitation.expiresAt}T23:59:59`);
  if (isNaN(expiry.getTime())) return false;
  return Date.now() > expiry.getTime();
}

/** An invitation is available only when it is active AND not expired. */
export function isInvitationAvailable(invitation: ExternalInvitation): boolean {
  return invitation.isActive && !isInvitationExpired(invitation);
}
