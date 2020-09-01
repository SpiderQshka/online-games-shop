import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("achievements").insert([
    {
      id: 1,
      name: "Seed db",
    },
  ]);
}
