import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("discounts").insert([
    {
      id: 1,
      startDate: "2019-05-01T21:00:00.000Z",
      endDate: "2586-05-01T21:00:00.000Z",
      amount: 15,
      type: "%",
    },
  ]);
}
