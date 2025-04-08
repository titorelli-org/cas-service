import path from "node:path";
import { DatabaseFactory } from "../knex-database";
import { logger } from "../logger";

const dbFactory = new DatabaseFactory(logger);

export const db = dbFactory.create(
  path.join(__dirname, "migrations"),
  path.join(process.cwd(), "data/db.sqlite3"),
);
