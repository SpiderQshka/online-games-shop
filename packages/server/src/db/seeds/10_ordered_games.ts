import Knex from "knex";
// import faker from "faker";
// {
//   id: 1,
//   orderId: 1,
//   userId: 1,
//   gameId: 1,
//   price: faker.random.number({ min: 0 }),
//   isPhysical: false,
// },
export async function seed(knex: Knex): Promise<void> {
  await knex("ordered_games").insert([]);
}
