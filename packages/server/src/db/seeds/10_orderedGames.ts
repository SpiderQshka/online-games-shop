import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("orderedGames").del();
  await knex("orderedGames").insert([
    {
      id: "295ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      orderId: "545ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      userId: "345ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      gameId: "745ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      price: 1234,
    },
  ]);
}
