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
      creationDate: faker.date.past(),
    },
    {
      id: 2,
      name: "Mount and blade Bannerlord",
      logo: faker.system.filePath(),
      description: faker.lorem.text(1),
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: +faker.random.number({ min: 0 }),
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 1,
      creationDate: faker.date.past(),
    },
    {
      id: 3,
      name: "Battle Brothers",
      logo: faker.system.filePath(),
      description: faker.lorem.text(1),
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: +faker.random.number({ min: 0 }),
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 2,
      creationDate: faker.date.past(),
    },
    {
      id: 4,
      name: "Total War Rome ||",
      logo: faker.system.filePath(),
      description: faker.lorem.text(1),
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: +faker.random.number({ min: 0 }),
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 2,
      creationDate: faker.date.past(),
    },
  ]);
}
