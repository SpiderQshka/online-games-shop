import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("unlocked_achievements").insert([
    {
      id: 1,
      userId: 1,
      achievementId: 1,
    },
  ]);
}
