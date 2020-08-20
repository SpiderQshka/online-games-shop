import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      login: "Leo",
      password: "password",
      boughtGames: null,
      achievements: null,
    },
  ]);
  // await User.query().del();
  // await User.query().insert({
  //   id: 1,
  //   login: "Leo",
  //   password: "password",
  //   boughtGames: null,
  //   achievements: null,
  // });
}
