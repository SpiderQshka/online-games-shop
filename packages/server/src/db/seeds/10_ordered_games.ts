import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("ordered_games").del();
  await knex("ordered_games").insert([
    {
      id: "295ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      orderId: "295ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      userId: "345ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      gameId: "745ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      price: faker.random.number({ min: 0 }),
    },
  ]);
}
