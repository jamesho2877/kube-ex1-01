import { readFile, writeFile } from "node:fs";
import { getTimeAndHash } from "./functions.mjs";

export function writeLogFile(filePath) {
  const data = getTimeAndHash();
  writeDataToFile(filePath, data, "timeAndHash");
}

function writeDataToFile(filePath, data, type) {
  try {
    let newContentArr = [];
    readFile(filePath, "utf8", (err, fileContent) => {
      if (err) {
        console.error(err);
        writeFile(filePath, "", (err) => {
          if (err) throw err;
          console.log("Init empty file!");
        });
        return;
      }
      
      const fileContentArr = fileContent.split("\n");

      if (fileContentArr.length === 1) {
        newContentArr = type === "view"
          ? fileContentArr[0].length > 50 ? fileContentArr.concat(data) : [data]
          : fileContentArr[0].length > 50 ? [data] : [data, fileContentArr[0]];
      } else {
        newContentArr = fileContentArr.slice(0, 2);
        newContentArr[type === "view" ? 1 : 0] = data;
      }

      const newContent = new Uint8Array(Buffer.from(newContentArr.join("\n")));
      writeFile(filePath, newContent, (err) => {
        if (err) throw err;
        console.log("Data was written to file!");
      });
    });
  } catch(err) {
    console.error("Could not write to file", err);
  }
}