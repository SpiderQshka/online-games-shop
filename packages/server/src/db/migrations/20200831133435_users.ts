require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Models.users.tableName, (table) => {
    table.increments();
    table.string("login").notNullable().unique();
    table.string("password").notNullable();
    table.boolean("isAdmin").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists(Models.users.tableName);
}
