import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("used_genres").del();
  await knex("used_genres").insert([
    {
      id: "248ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      genre_id: "445ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      game_id: "745ae4d0-f2c3-4342-91a2-5b45cb8db57f",
    },
  ]);
}
