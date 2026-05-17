import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.log("[postbuild] no standalone output — skipping copy.");
  process.exit(0);
}

await mkdir(join(standalone, ".next"), { recursive: true });
await cp(join(root, ".next", "static"), join(standalone, ".next", "static"), { recursive: true });
if (existsSync(join(root, "public"))) {
  await cp(join(root, "public"), join(standalone, "public"), { recursive: true });
}
console.log("[postbuild] copied .next/static and public/ into standalone.");
