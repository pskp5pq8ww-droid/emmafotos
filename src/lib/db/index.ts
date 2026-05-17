import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { emptyDatabase, type Database } from "./types";

function getStorageRoot() {
  const cwd = process.cwd();
  const standaloneSuffix = path.join(".next", "standalone");
  if (cwd.endsWith(standaloneSuffix)) {
    return path.resolve(cwd, "..", "..");
  }
  return cwd;
}

const storageRoot = getStorageRoot();
// DATA_DIR lets you point db.json to a persistent out-of-tree directory that
// survives redeploys (e.g. on Hostinger: DATA_DIR=/home/u613502604/data).
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(storageRoot, "data");
// UPLOAD_DIR lets you point uploads to an out-of-tree directory (e.g. on Hostinger:
// UPLOAD_DIR=/home/u613502604/storage). Falls back to <project>/uploads.
const uploadsDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(storageRoot, "uploads");
const dbPath = path.join(dataDir, "db.json");

let writeQueue = Promise.resolve();

export function getDataDir() {
  return dataDir;
}

export function getUploadsDir() {
  return uploadsDir;
}

export function getDBPath() {
  return dbPath;
}

export async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });
}

function normalizeDatabase(value: Partial<Database>): Database {
  return {
    clients: Array.isArray(value.clients) ? value.clients : [],
    galleries: Array.isArray(value.galleries) ? value.galleries : [],
    galleryImages: Array.isArray(value.galleryImages) ? value.galleryImages : [],
    favorites: Array.isArray(value.favorites) ? value.favorites : [],
    reviews: Array.isArray(value.reviews) ? value.reviews : [],
    settings: value.settings ?? emptyDatabase.settings,
  };
}

export async function readDB(): Promise<Database> {
  await ensureStorage();

  if (!existsSync(dbPath)) {
    await writeDB(emptyDatabase);
  }

  const raw = await readFile(dbPath, "utf8");
  return normalizeDatabase(JSON.parse(raw) as Partial<Database>);
}

export async function writeDB(database: Database): Promise<void> {
  await ensureStorage();

  const write = async () => {
    const tmpPath = `${dbPath}.${process.pid}.${Date.now()}.tmp`;
    const payload = `${JSON.stringify(normalizeDatabase(database), null, 2)}\n`;
    await writeFile(tmpPath, payload, "utf8");
    await rename(tmpPath, dbPath);
  };

  writeQueue = writeQueue.then(write, write);
  return writeQueue;
}

export async function updateDB(
  updater: (database: Database) => Database | Promise<Database>,
): Promise<Database> {
  const current = await readDB();
  const next = normalizeDatabase(await updater(current));
  await writeDB(next);
  return next;
}
