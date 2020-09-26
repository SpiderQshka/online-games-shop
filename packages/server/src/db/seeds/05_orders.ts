import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("orders").insert([
    {
      id: 1,
      createdAt: faker.date.past(),
      price: faker.random.number(),
      status: "pending",
    },
  ]);
}
