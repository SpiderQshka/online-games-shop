require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Models.games.tableName, (table) => {
    table.increments();
    table.string("name").notNullable();
    table.string("logo").nullable();
    table.text("description").nullable();
    table.bigInteger("ageRating").nullable();
    table.bigInteger("price").notNullable();
    table.bigInteger("numberOfPhysicalCopies").notNullable();
    table.integer("gameCreatorId").notNullable().references("game_creators.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists(Models.games.tableName);
}
