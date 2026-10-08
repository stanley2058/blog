import { mkdir, readFile, writeFile } from "node:fs/promises";
import { build } from "esbuild";

const outdir = "public/quire/v2";
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
    entryPoints: ["src/quire/quire.js"],
    format: "iife",
    outfile: `${outdir}/quire.js`,
  }),
  build({
    ...shared,
    entryPoints: ["src/quire/quire.css"],
    outfile: `${outdir}/quire.css`,
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

console.log(`Built ${outdir}/quire.{css,js}`);
