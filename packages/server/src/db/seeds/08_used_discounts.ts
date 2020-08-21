import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("used_discounts").del();
  await knex("used_discounts").insert([
    {
      id: "895ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      discount_id: "245ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      game_id: "745ae4d0-f2c3-4342-91a2-5b45cb8db57f",
    },
  ]);
}
