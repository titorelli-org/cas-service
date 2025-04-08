import { type Logger } from "pino";
import { type KnexRun } from "./types";
import { type Knex } from "knex";

export class BaseRepository<TRecord extends {}, TResult extends any[]>
  implements KnexRun<TRecord, TResult>
{
  constructor(private _db: KnexRun<TRecord, TResult>, private logger: Logger) {}

  run<R>(callback: (knex: Knex<TRecord, TResult>) => Promise<R>): Promise<R> {
    return this._db.run(callback);
  }
}
