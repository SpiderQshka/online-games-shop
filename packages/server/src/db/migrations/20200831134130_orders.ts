require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Models.orders.tableName, (table) => {
    table.increments();
    table.date("createdAt").notNullable();
    table.bigInteger("price").notNullable();
    table.string("status").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists(Models.orders.tableName);
}
