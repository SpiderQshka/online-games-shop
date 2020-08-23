import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("gameCreators").del();
  await knex("gameCreators").insert([
    {
      id: "145ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      name: "name",
      logo: "path/to/logo",
      yearOfFoundation: 1999,
    },
  ]);
}
