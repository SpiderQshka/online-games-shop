import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("games").insert([
    {
      id: 1,
      name: "Mount and blade Warband",
      logo: "https://www.linkpicture.com/q/mnb-warband.jpg",
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
      logo: "https://www.linkpicture.com/q/5ae658ecb8c06024_1200xH.jpg",
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
      logo:
        "https://www.linkpicture.com/q/battle-brothers-poluchit-krupnejshie-dlc-blazing-deserts.jpg",
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
      logo: "https://www.linkpicture.com/q/Total_War_Rome_2.jpg",
      description: faker.lorem.text(1),
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: +faker.random.number({ min: 0 }),
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 2,
      creationDate: faker.date.past(),
    },
  ]);
}
