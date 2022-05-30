import { existsSync, readFileSync } from "node:fs";

export function readLogFile(filePath) {
  if (existsSync(filePath)) {
    return readFileSync(filePath, "utf8");
  } else {
    return `Given file "${filePath}" does not exist`;
  }
}