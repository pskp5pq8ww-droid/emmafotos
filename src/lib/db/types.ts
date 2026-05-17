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
  path: string;
  thumbPath?: string;
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
  settings: defaultSettings,
};
