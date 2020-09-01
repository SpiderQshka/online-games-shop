require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Models.gameCreators.tableName, (table) => {
    table.increments();
    table.string("name").notNullable().unique();
    table.string("logo").nullable();
    table.bigInteger("yearOfFoundation").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists(Models.gameCreators.tableName);
}
