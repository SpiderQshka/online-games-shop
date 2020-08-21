import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("games").del();
  await knex("games").insert([
    {
      id: "745ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      name: "Mount and blade Warband",
      logo: "path/to/logo",
      description: "Lorem ipsum sir amet",
      age_rating: 16,
      price: 12345,
      number_of_physical_copies: 1,
      game_creator_id: "145ae4d0-f2c3-4342-91a2-5b45cb8db57f",
    },
  ]);
}
