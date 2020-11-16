import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("genres").insert([
    {
      id: 1,
      name: "RPG",
    },
    {
      id: 2,
      name: "Action",
    },
    {
      id: 3,
      name: "Strategy",
    },
    {
      id: 4,
      name: "Quest",
    },
    {
      id: 5,
      name: "Simulator",
    },
  ]);
}
