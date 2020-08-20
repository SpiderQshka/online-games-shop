import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("login").defaultTo("username");
    table.string("password").notNullable();
    table.specificType("boughtGames", "INT[]");
    table.specificType("achievements", "INT[]");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
