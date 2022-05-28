import express from "express";
import { getTimeAndHash } from "./src/functions.mjs";

const PORT = process.env.PORT || 3400;
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  const timeAndHash = getTimeAndHash();
  res.send(timeAndHash);
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});

// setTimeout(getTimeAndHash, 5000);