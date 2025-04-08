import { BaseRepository } from "../../knex-database";
import type { TotemRecord } from "../types";
import { knexUnwrapCount } from "../../misc";

export class TotemsRepo extends BaseRepository<TotemRecord, TotemRecord[]> {
  add(tgUserId: number) {
    return this.run(async (knex) => {
      const [{ id }] = await knex
        .insert<TotemRecord>({
          tgUserId,
          createdAt: new Date().toISOString(),
        })
        .into("totems")
        .returning<{ id: number }[]>(["id"]);

      return id;
    });
  }

  remove(tgUserId: number) {
    return this.run(async (knex) => {
      return knex.delete().from("totems").where("tgUserId", tgUserId);
    });
  }

  contains(tgUserId: number) {
    return this.run(async (knex) => {
      const result = await knex
        .count("id")
        .from("totems")
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
        .from("totems")
        .where("tgUserId", tgUserId)
        .first<Pick<TotemRecord, "id">>();

      if (record) {
        await knex("totems")
          .update({ tgUserId, updatedAt: now.toISOString() })
          .where("id", record.id);
      } else {
        await knex
          .insert({ tgUserId, createdAt: now.toISOString() })
          .into("totems");
      }
    });
  }
}
