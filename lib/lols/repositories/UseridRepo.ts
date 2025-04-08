import { BaseRepository } from "../../knex-database";
import type { UseridRecord } from "../types";
import { knexUnwrapCount } from "../../misc";

export class UseridRepo extends BaseRepository<UseridRecord, UseridRecord[]> {
  add(tgUserId: number) {
    return this.run(async (knex) => {
      const [{ id }] = await knex
        .insert<UseridRecord>({
          tgUserId,
          createdAt: new Date().toISOString(),
        })
        .into("lolsUserids")
        .returning<{ id: number }[]>(["id"]);

      return id;
    });
  }

  remove(tgUserId: number) {
    return this.run(async (knex) => {
      return knex.delete().from("lolsUserids").where("tgUserId", tgUserId);
    });
  }

  contains(tgUserId: number) {
    return this.run(async (knex) => {
      const result = await knex
        .count("id")
        .from("lolsUserids")
        .where("tgUserId", tgUserId)
        .first();

      return knexUnwrapCount(result) > 0;
    });
  }

  async bulkInsert(tgUserIds: number[]) {
    const now = new Date();

    for (const tgUserId of tgUserIds) {
      await this.upsert(tgUserId, now);
    }
  }

  async upsert(tgUserId: number, now: Date) {
    await this.run(async (knex) => {
      const record = await knex
        .select("id")
        .from("lolsUserids")
        .where("tgUserId", tgUserId)
        .first<Pick<UseridRecord, "id">>();

      if (record) {
        await knex("lolsUserids")
          .update({ tgUserId, updatedAt: now.toISOString() })
          .where("id", record.id);
      } else {
        await knex
          .insert({ tgUserId, createdAt: now.toISOString() })
          .into("lolsUserids");
      }
    });
  }
}
