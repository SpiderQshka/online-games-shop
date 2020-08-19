import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      login: "Leo",
      password: "password",
      boughtGames: [],
      achievements: [],
    },
  ]);
}
