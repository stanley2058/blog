import { copyFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const skillDirectory =
  process.env.PRISMATIC_SKILL_DIR ||
  join(homedir(), ".agents/skills/prismatic-terminal-ui");
const assetDirectory = join(skillDirectory, "assets");
const bundleDirectory = "public/prismatic/v2";

await mkdir(assetDirectory, { recursive: true });
await Promise.all(
  ["prismatic.css", "prismatic.js", "THIRD_PARTY_LICENSES.txt"].map((file) =>
    copyFile(join(bundleDirectory, file), join(assetDirectory, file)),
  ),
);

console.log(`Synced standalone assets to ${assetDirectory}`);
