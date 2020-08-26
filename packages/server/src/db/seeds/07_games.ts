import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("games").del();
  await knex("games").insert([
    {
      id: "745ae4d0-f2c3-4342-91a2-5b45cb8db57f",
      name: "Mount and blade Warband",
      logo: faker.system.filePath(),
      description: faker.lorem.text(1),
      ageRating: faker.random.number({ min: 0, max: 18 }),
      price: faker.random.number({ min: 0 }),
      numberOfPhysicalCopies: faker.random.number({ min: 0 }),
      gameCreatorId: "145ae4d0-f2c3-4342-91a2-5b45cb8db57f",
    },
  ]);
}
