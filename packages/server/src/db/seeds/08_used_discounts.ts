import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("used_discounts").insert([
    {
      id: 1,
      discountId: 1,
      gameId: 1,
    },
  ]);
}
