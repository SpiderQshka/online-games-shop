import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("games").insert([
    {
      id: 1,
      name: "Mount and blade Warband",
      logo: faker.system.filePath(),
      description: faker.lorem.text(1),
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: +faker.random.number({ min: 0 }),
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 1,
    },
  ]);
}
