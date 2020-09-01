import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("genres").insert([
    {
      id: 1,
      name: "RPG",
    },
  ]);
}
