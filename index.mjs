import express from "express";
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

console.log("param", { WRITER, PRODUCTION });

if (WRITER === "true") {
  const scheduleDataLogging = async () => {
    await database.writeCounterContent();
    setTimeout(scheduleDataLogging, 5000);
  };

  scheduleDataLogging();
} else {
  const app = express();
  const router = express.Router();
  
  router.get("/", async (req, res) => {
    const greeting = `${GREETING_WORD}, ${FIRST_NAME} ${LAST_NAME}!<br/>`;
    const { hashstr = "", pingpong = 0 } = await database.readCounterContent();
    res.send(`${greeting}<br/>${hashstr}.<br/>Ping / Pongs: ${pingpong}`);
  });
  
  app.use(router);
  
  app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
  });
}