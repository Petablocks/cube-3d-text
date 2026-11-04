// Convert a TTF/OTF font into the typeface JSON format the app loads.
// Usage: npx tsx scripts/convert-font.ts <input.ttf> <output.json>
import { readFile, writeFile } from "node:fs/promises";
import { convertTTFtoFaceTypeJson } from "../src/utils/ttfConverter";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
    console.error("Usage: npx tsx scripts/convert-font.ts <input.ttf> <output.json>");
    process.exit(1);
}
const buf = await readFile(input);
const result = await convertTTFtoFaceTypeJson(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
await writeFile(output, result.data);
console.log(`${result.fullName} -> ${output} (${result.data.length} bytes)`);
