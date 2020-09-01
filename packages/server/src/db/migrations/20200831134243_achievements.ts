require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Models.achievements.tableName, (table) => {
    table.increments();
    table.string("name").notNullable().unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists(Models.achievements.tableName);
}
