import newKnex, { Knex } from "knex";
import { Logger } from "pino";
import { KnexDatabase } from "./KnexDatabase";

export class SqliteDatabase<
  TRecord extends {},
  TResult extends any[],
> extends KnexDatabase<TRecord, TResult> {
  constructor(
    private dbFilename: string,
    migrationsDirname: string,
    logger: Logger,
  ) {
    super(migrationsDirname, logger, { dbFilename });
  }

  createKnex(logger: Logger): Knex<TRecord, TResult> {
    return newKnex({
      client: "sqlite3",
      connection: {
        filename: this.dbFilename,
      },
      useNullAsDefault: true,
      // log: logger,
    });
  }
}
