export type Client = {
  id: string;
  name: string;
  email: string;
  username?: string;
  pinHash: string;
  createdAt: string;
};

export type Gallery = {
  id: string;
  clientId: string;
  title: string;
  slug: string;
  eventDate?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
};

export type GalleryImage = {
  id: string;
  galleryId: string;
  filename: string;
  /** Legacy original path (clients/{clientId}/{slug}/<file>). New uploads use originalPath. */
  path: string;
  /** Legacy JPEG thumbnail path. New uploads use previewPath (.webp) instead. */
  thumbPath?: string;
  /** New optimized WebP preview for in-browser display. */
  previewPath?: string;
  /** Canonical original-file path. Mirrors `path` for new uploads; absent on legacy rows. */
  originalPath?: string;
  size: number;
  width: number;
  height: number;
  createdAt: string;
};

export type Favorite = {
  galleryId: string;
  imageId: string;
  createdAt: string;
};

export type Review = {
  id: string;
  /** Optional — standalone invite reviews may not be tied to a gallery. */
  galleryId?: string;
  clientName: string;
  email?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  message: string;
  approved: boolean;
  allowPublicDisplay: boolean;
  createdAt: string;
  /** Admin-assigned gallery image ID shown in the public marquee. */
  imageId?: string;
  /** Admin-uploaded profile photo path (relative to uploadsDir). Low-res 180×180 JPEG. */
  profilePhotoPath?: string;
};

/** One-use invite link for collecting a client review. */
export type ReviewInvite = {
  id: string;
  /** URL-safe token — used in /review/[token] */
  token: string;
  /** Optional gallery association shown to the reviewer. */
  galleryId?: string;
  /** Admin note (not shown publicly). */
  note?: string;
  createdAt: string;
  /** Set when the invite has been used. */
  usedAt?: string;
};

/**
 * External download invitation — a private page linking to a heavy gallery
 * stored on an external service (Google Drive, Dropbox, OneDrive, etc.).
 * Completely separate from local `Gallery` records: no clientId, no PIN, no uploads.
 */
export type ExternalInvitation = {
  id: string;
  /** Unique, hard-to-guess token used in /gallery-invitation/[slug] */
  slug: string;
  clientName: string;
  title: string;
  /** Personal message written by admin, shown on the public page. */
  customMessage?: string;
  /** The real external download URL — never rendered in public HTML. */
  externalDownloadLink: string;
  /** Optional external image URL used as the page background. */
  coverImageUrl?: string;
  /** Admin-only note, never shown publicly. */
  internalNotes?: string;
  isActive: boolean;
  /** Optional expiry date ("YYYY-MM-DD"). After this date the invitation is unavailable. */
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type StudioSettings = {
  studioName: string;
  contactEmail: string;
  instagram: string;
  phone: string;
  emailTemplate: string;
  adminPinHash?: string;
};

export type Database = {
  clients: Client[];
  galleries: Gallery[];
  galleryImages: GalleryImage[];
  favorites: Favorite[];
  reviews: Review[];
  reviewInvites: ReviewInvite[];
  externalInvitations: ExternalInvitation[];
  settings?: StudioSettings;
};

export const defaultSettings: StudioSettings = {
  studioName: "Emmanuel Rojas Studio",
  contactEmail: "hello@emmanuelrojas.studio",
  instagram: "@emmanuelrojas.studio",
  phone: "Available on request",
  emailTemplate:
    "Your private gallery is ready. Open {{link}} and use your personal PIN to access it.",
};

export const emptyDatabase: Database = {
  clients: [],
  galleries: [],
  galleryImages: [],
  favorites: [],
  reviews: [],
  reviewInvites: [],
  externalInvitations: [],
  settings: defaultSettings,
};
