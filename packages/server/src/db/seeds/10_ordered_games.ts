import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("ordered_games").insert([]);
}
