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
      gameId: 1,
    },
    {
      id: 3,
      genreId: 1,
      gameId: 2,
    },
    {
      id: 4,
      genreId: 2,
      gameId: 2,
    },
    {
      id: 5,
      genreId: 1,
      gameId: 3,
    },
    {
      id: 6,
      genreId: 2,
      gameId: 3,
    },
    {
      id: 7,
      genreId: 5,
      gameId: 3,
    },
    {
      id: 8,
      genreId: 2,
      gameId: 4,
    },
    {
      id: 9,
      genreId: 2,
      gameId: 5,
    },
    {
      id: 10,
      genreId: 2,
      gameId: 6,
    },
    {
      id: 11,
      genreId: 5,
      gameId: 6,
    },
    {
      id: 12,
      genreId: 1,
      gameId: 7,
    },
    {
      id: 13,
      genreId: 2,
      gameId: 8,
    },
    {
      id: 14,
      genreId: 5,
      gameId: 8,
    },
    {
      id: 15,
      genreId: 3,
      gameId: 9,
    },
    {
      id: 16,
      genreId: 2,
      gameId: 10,
    },
    {
      id: 17,
      genreId: 4,
      gameId: 11,
    },
    {
      id: 18,
      genreId: 5,
      gameId: 11,
    },
  ]);
}
