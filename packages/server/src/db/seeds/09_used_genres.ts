import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("used_genres").insert([
    {
      id: 1,
      genreId: 1,
      gameId: 1,
    },
  ]);
}
