import type { Knex } from "knex";
import { Logger } from "pino";
import { KnexRun } from "./types";

export abstract class KnexDatabase<TRecord extends {}, TResult extends any[]>
  implements KnexRun<TRecord, TResult>
{
  private knex: Knex<TRecord, TResult>;
  private ready: Promise<void>;

  constructor(
    private migrationsDirname: string,
    private logger: Logger,
    rest: Record<string, unknown> = {},
  ) {
    Object.assign(this, rest);

    this.knex = this.createKnex(logger);

    this.ready = this.applyMigrations();
  }

  async run<R>(
    callback: (knex: Knex<TRecord, TResult>) => Promise<R>,
  ): Promise<R> {
    await this.ready;

    return callback(this.knex);
  }

  abstract createKnex(logger: Logger): Knex<TRecord, TResult>;

  private async applyMigrations() {
    await this.knex.migrate.latest({
      directory: this.migrationsDirname,
      sortDirsSeparately: true,
      name: `foo-${Math.round(Math.random() * 0xffffff).toString(36)}`,
    });
  }
}
