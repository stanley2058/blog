import { copyFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const skillDirectory =
  process.env.QUIRE_SKILL_DIR || join(homedir(), ".agents/skills/quire");
const assetDirectory = join(skillDirectory, "assets");
const bundleDirectory = "public/quire/v1";

await mkdir(assetDirectory, { recursive: true });
await Promise.all(
  ["quire.css", "quire.js", "THIRD_PARTY_LICENSES.txt"].map((file) =>
    copyFile(join(bundleDirectory, file), join(assetDirectory, file)),
  ),
);

console.log(`Synced standalone assets to ${assetDirectory}`);
