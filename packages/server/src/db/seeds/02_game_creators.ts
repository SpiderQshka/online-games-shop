import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("game_creators").del();
  await knex("game_creators").insert([
    {
      id: "145ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      name: faker.internet.userName(),
      logo: faker.system.filePath(),
      yearOfFoundation: faker.random.number(),
    },
  ]);
}
