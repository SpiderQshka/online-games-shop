require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Models.discounts.tableName, (table) => {
    table.increments();
    table.date("startDate").notNullable();
    table.string("amount").notNullable();
    table.string("type").notNullable();
    table.date("endDate").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists(Models.discounts.tableName);
}
