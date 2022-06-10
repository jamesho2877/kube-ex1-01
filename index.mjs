import path from "path";
import express from "express";
// import { readLogFile } from "./src/reader.mjs";
// import { writeLogFile } from "./src/writer.mjs";
import Database from "./src/database.mjs";

const {
  PORT = 3400,
  WRITER = "false",
  PRODUCTION = "true",
  GREETING_WORD,
  FIRST_NAME,
  LAST_NAME,
} = process.env;

const database = new Database();
const filePath = PRODUCTION === "false" ? path.resolve(process.cwd(), "log.txt") : "/usr/src/app/files/log.txt";

console.log("filePath", filePath);
console.log("param", { WRITER, PRODUCTION });

if (WRITER === "true") {
  const scheduleDataLogging = async () => {
    // writeLogFile(filePath);
    await database.writeCounterContent();
    setTimeout(scheduleDataLogging, 5000);
  };

  scheduleDataLogging();
} else {
  const app = express();
  const router = express.Router();
  
  router.get("/", async (req, res) => {
    const greeting = `${GREETING_WORD}, ${FIRST_NAME} ${LAST_NAME}!<br/>`
    // const fileContent = readLogFile(filePath).replace("\n", ".<br/> Ping / Pongs: ");
    const rawContent = await database.readCounterContent();
    const fileContent = rawContent.replace("\n", ".<br/> Ping / Pongs: ");
    res.send(greeting + fileContent);
  });
  
  app.use(router);
  
  app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
  });
}