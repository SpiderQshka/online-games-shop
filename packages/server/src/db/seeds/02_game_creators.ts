import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("game_creators").insert([
    {
      id: 1,
      name: faker.internet.userName(),
      logo: faker.system.filePath(),
      yearOfFoundation: faker.random.number(),
    },
  ]);
}
