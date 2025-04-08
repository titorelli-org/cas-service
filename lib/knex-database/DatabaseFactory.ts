import { Logger } from "pino";
import { KnexDatabase } from "./KnexDatabase";
import { SqliteDatabase } from "./SqliteDatabase";

export class DatabaseFactory {
  constructor(private logger: Logger) {}

  create<TRecord extends {}, TResult extends any[]>(
    migrationsDir: string,
    connection: string,
  ): KnexDatabase<TRecord, TResult> {
    if (this.isSqliteConnection(connection)) {
      return new SqliteDatabase<TRecord, TResult>(
        connection,
        migrationsDir,
        this.logger,
      );
    }

    throw new Error(
      `Cannot create database instance from string: "${connection}"`,
    );
  }

  private isSqliteConnection(_filename: string) {
    return true;
  }
}
