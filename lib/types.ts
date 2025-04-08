export { DatabaseFactory, BaseRepository, type KnexRun } from "./knex-database";

export type UserFilter = {
  has(tgUserId: number): Promise<boolean>;

  add(tgUserId: number): Promise<void>;

  delete(tgUserId: number): Promise<void>;
};
