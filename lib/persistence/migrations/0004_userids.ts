import { Knex } from "knex";

export const up = (knex: Knex) =>
  knex.schema.createTable("genericUserids", (table) => {
    table.increments("id");

    table.bigInteger("tgUserId");

    table.dateTime("createdAt");
    table.dateTime("updatedAt").nullable();

    table.index("tgUserId");
  });

export const down = (knex: Knex) => knex.schema.dropTable("genericUserids");
