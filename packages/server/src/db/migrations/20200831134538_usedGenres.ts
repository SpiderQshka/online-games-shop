require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Models.usedGenres.tableName, (table) => {
    table.increments();
    table.integer("genreId").notNullable().references("genres.id");
    table.integer("gameId").notNullable().references("games.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists(Models.usedGenres.tableName);
}
