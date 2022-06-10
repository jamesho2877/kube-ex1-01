import pg from "pg";
import { getTimeAndHash } from "./functions.mjs";

const {
  NS,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

export default class Database {
  #pool;

  constructor() {
    this.#pool = new pg.Pool({
      host: `postgres-svc.${NS}.svc.cluster.local`,
      port: 5432,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      max: 10,
    });

    this.#pool.on("error", async (err) => {
      console.error("Unexpected error on idle client", err);
    });
  }

  async readCounterContent() {
    let data;
    try {
      const rs = await this.#pool.query("SELECT * FROM counter");
      data = rs.rows[0]?.content || "";
    } catch (err) {
      console.error(err);
    } finally {
      return data;
    }
  }
  
  async writeCounterContent() {
    const newData = getTimeAndHash();
    const rs = await this.#pool.query({
      text: "INSERT INTO counter VALUES (1,$1) ON CONFLICT (id) DO UPDATE SET content = $1 RETURNING *",
      values: [newData],
    });
    return rs.rows[0]?.content || "";
  }
}