import Knex from "knex";
import faker from "faker";
import { User } from "models/User";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").insert([
    {
      id: 1,
      login: "login",
      password: await User.hashPassword("password"),
      isAdmin: true,
    },
    {
      id: 2,
      login: faker.name.findName(),
      password: faker.internet.password(),
      isAdmin: false,
    },
    {
      id: 3,
      login: faker.name.findName(),
      password: faker.internet.password(),
      isAdmin: false,
    },
  ]);
}
