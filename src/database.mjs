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
  #config;

  constructor() {
    this.#config = {
      host: `postgres-svc.${NS}.svc.cluster.local`,
      port: 5432,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      max: 10,
    };

    this.#pool = new pg.Pool(this.#config);

    this.#pool.on("error", async (err) => {
      console.error("Unexpected error on idle client", err);
    });
  }

  testConnection() {
    const client = new pg.Client(this.#config);
    return new Promise(resolve => {
      client.connect(err => {
        if (err) {
          console.log("testConnection - error", err);
          resolve({ err });
        } else {
          client.end();
          resolve({});
        }
      });
    });
  }

  async readCounterContent() {
    let data = {};

    try {
      const rs = await this.#pool.query("SELECT * FROM counter WHERE id = 1");
      data = rs.rows?.[0] || {};
    } catch (err) {
      console.error(err);
    } finally {
      console.log("data", data);
      return data;
    }
  }
  
  async writeCounterContent() {
    const newData = getTimeAndHash();

    const rs = await this.#pool.query({
      text: "INSERT INTO counter VALUES (1,$1,DEFAULT) ON CONFLICT (id) DO UPDATE SET hashstr = $1 RETURNING *",
      values: [newData],
    });

    return rs.rows?.[0]?.hashstr || "";
  }
}