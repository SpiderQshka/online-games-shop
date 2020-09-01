import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("discounts").insert([
    {
      id: 1,
      startDate: faker.date.future(),
      duration: faker.random.number(),
      amount: 15,
      type: "%",
    },
  ]);
}
