import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let database: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!database) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    database = drizzle(pool);
  }
  return database;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    const actualDb = getDb();
    return (actualDb as any)[prop];
  }
});

export { pool };
