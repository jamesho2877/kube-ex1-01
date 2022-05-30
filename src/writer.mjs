import { writeFileSync } from "node:fs";
import { getTimeAndHash } from "./functions.mjs";

export function writeLogFile(filePath) {
  const data = getTimeAndHash();
  writeFileSync(filePath, data);
  console.log("write new data", data);
}