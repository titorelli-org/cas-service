import { Knex } from "knex";

export type KnexRun<TRecord extends {}, TResult extends any[]> = {
  run<R>(callback: (knex: Knex<TRecord, TResult>) => Promise<R>): Promise<R>;
};
