import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("orders").del();
  await knex("orders").insert([
    {
      id: "295ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      createdAt: faker.date.past(),
      price: faker.random.number(),
    },
  ]);
}
