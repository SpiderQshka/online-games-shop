import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("ordered_games").del();
  await knex("ordered_games").insert([
    {
      id: "295ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      order_id: "545ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      user_id: "345ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      game_id: "745ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      price: 1234,
    },
  ]);
}
