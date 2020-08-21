import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("orders").del();
  await knex("orders").insert([
    {
      id: "545ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      created_at: 4321,
      price: 12345,
    },
  ]);
}
