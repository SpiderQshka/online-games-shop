import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("used_genres").insert([
    {
      id: 1,
      genreId: 1,
      gameId: 1,
    },
    {
      id: 2,
      genreId: 2,
      gameId: 2,
    },
    {
      id: 3,
      genreId: 1,
      gameId: 2,
    },
    {
      id: 4,
      genreId: 2,
      gameId: 3,
    },
    {
      id: 5,
      genreId: 1,
      gameId: 4,
    },
  ]);
}
