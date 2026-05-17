/**
 * Ensures persistent directories exist before starting the server.
 * Hostinger wipes nodejs/ on every redeploy, so DATA_DIR and UPLOAD_DIR
 * must live in the home folder and be recreated if missing.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

const uploadsDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "uploads");

await mkdir(dataDir, { recursive: true });
await mkdir(uploadsDir, { recursive: true });
// local fallback in case env vars not yet injected
await mkdir(path.join(process.cwd(), "data"), { recursive: true });

console.log(`[startup] data:    ${dataDir}`);
console.log(`[startup] uploads: ${uploadsDir}`);
