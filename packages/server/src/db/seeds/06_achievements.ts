import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("achievements").del();
  await knex("achievements").insert([
    {
      id: "645ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      name: "Seed db",
    },
  ]);
}
