import Knex from "knex";
import faker from "faker";
import { hashPassword } from "models/helpers";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").insert([
    {
      id: 1,
      login: "login",
      password: await hashPassword("password"),
      isAdmin: true,
    },
    {
      id: 2,
      login: "login1",
      password: await hashPassword("password1"),
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
