/**
 * One-off (re-runnable) optimizer for public/assets.
 * - JPEG: resize to max 2400px wide, mozjpeg q80, progressive.
 * - PNG:  lossless-ish palette compression (keeps alpha).
 * Files are only rewritten when the optimized version is ≥10% smaller,
 * so re-running is a no-op. Originals are recoverable via git.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "assets");
const MAX_WIDTH = 2400;
const MIN_SAVINGS = 0.1; // only rewrite if ≥10% smaller

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let before = 0;
let after = 0;
let touched = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

  const input = await readFile(file);
  const meta = await sharp(input).metadata();
  let pipeline = sharp(input);

  if (meta.width && meta.width > MAX_WIDTH && ext !== ".png") {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const output =
    ext === ".png"
      ? await pipeline.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
      : await pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer();

  before += input.length;
  if (output.length < input.length * (1 - MIN_SAVINGS)) {
    await writeFile(file, output);
    after += output.length;
    touched++;
    console.log(
      `✓ ${path.relative(ROOT, file)}  ${(input.length / 1e6).toFixed(1)}MB → ${(output.length / 1e6).toFixed(1)}MB`,
    );
  } else {
    after += input.length;
  }
}

console.log(
  `\nDone. ${touched} files rewritten. Total: ${(before / 1e6).toFixed(0)}MB → ${(after / 1e6).toFixed(0)}MB`,
);
