import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.log("[postbuild] no standalone output — skipping.");
  process.exit(0);
}

await mkdir(join(standalone, ".next"), { recursive: true });
await cp(join(root, ".next", "static"), join(standalone, ".next", "static"), { recursive: true });
if (existsSync(join(root, "public"))) {
  await cp(join(root, "public"), join(standalone, "public"), { recursive: true });
}
console.log("[postbuild] copied .next/static and public/ into standalone.");

// Inject directory-bootstrap code at the top of server.js so Hostinger
// never crashes due to missing data/ or uploads/ directories.
const serverPath = join(standalone, "server.js");
if (existsSync(serverPath)) {
  const original = await readFile(serverPath, "utf8");
  const bootstrap = `
// ── Startup bootstrap (injected by postbuild) ──
const { mkdirSync } = require("fs");
const _path = require("path");
const _dataDir  = process.env.DATA_DIR   ? _path.resolve(process.env.DATA_DIR)   : _path.join(__dirname, "data");
const _uploadsDir = process.env.UPLOAD_DIR ? _path.resolve(process.env.UPLOAD_DIR) : _path.join(__dirname, "uploads");
try { mkdirSync(_dataDir,    { recursive: true }); } catch(_){}
try { mkdirSync(_uploadsDir, { recursive: true }); } catch(_){}
try { mkdirSync(_path.join(__dirname, "data"), { recursive: true }); } catch(_){}
// ── End bootstrap ──
`;
  if (!original.includes("End bootstrap")) {
    await writeFile(serverPath, bootstrap + original, "utf8");
    console.log("[postbuild] injected startup bootstrap into server.js.");
  }
}
