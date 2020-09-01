require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Models.orderedGames.tableName, (table) => {
    table.increments();
    table.integer("orderId").notNullable().references("orders.id");
    table.integer("userId").notNullable().references("users.id");
    table.integer("gameId").notNullable().references("games.id");
    table.bigInteger("price").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists(Models.orderedGames.tableName);
}
