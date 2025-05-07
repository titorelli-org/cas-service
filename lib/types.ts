export { DatabaseFactory, BaseRepository, type KnexRun } from "./knex-database";

export type UserFilter = {
  has(tgUserId: number): Promise<[boolean, string]>;

  add(tgUserId: number): Promise<void>;

  delete(tgUserId: number): Promise<void>;
};

export interface Startable {
  start(): Promise<void>;

  stop(): Promise<void>;
}
