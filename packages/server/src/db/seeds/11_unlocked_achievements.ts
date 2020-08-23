import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("unlocked_achievements").del();
  await knex("unlocked_achievements").insert([
    {
      id: "240ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      userId: "345ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      achievementId: "645ae4d0-f2c3-4342-91a2-5b45cb8db57f",
    },
  ]);
}
