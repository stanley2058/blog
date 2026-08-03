import { mkdir, readFile, writeFile } from "node:fs/promises";
import { build } from "esbuild";

const outdir = "public/prismatic/v2";
await mkdir(outdir, { recursive: true });

const shared = {
  bundle: true,
  legalComments: "eof",
  minify: true,
  target: ["es2022"],
};

await Promise.all([
  build({
    ...shared,
    entryPoints: ["src/prismatic/prismatic.js"],
    format: "iife",
    outfile: `${outdir}/prismatic.js`,
  }),
  build({
    ...shared,
    entryPoints: ["src/prismatic/prismatic.css"],
    outfile: `${outdir}/prismatic.css`,
  }),
]);

const licenses = await Promise.all([
  readFile("node_modules/marked/LICENSE", "utf8"),
  readFile("node_modules/dompurify/LICENSE", "utf8"),
]);

await writeFile(
  `${outdir}/THIRD_PARTY_LICENSES.txt`,
  ["marked", licenses[0], "DOMPurify", licenses[1]].join("\n\n"),
);

console.log(`Built ${outdir}/prismatic.{css,js}`);
