import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("game_creators").insert([
    {
      id: 1,
      name: faker.internet.userName(),
      logo: "https://www.linkpicture.com/q/1200x630wa.png",
      yearOfFoundation: faker.random.number(),
    },
    {
      id: 2,
      name: faker.internet.userName(),
      logo: "https://www.linkpicture.com/q/Total-logo-earth.png",
      yearOfFoundation: faker.random.number(),
    },
  ]);
}
