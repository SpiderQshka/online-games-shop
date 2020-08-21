import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("discounts").del();
  await knex("discounts").insert([
    {
      id: "245ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      time: 12345,
      duration: 12345,
      amount: "15%",
    },
  ]);
}
