import Knex from "knex";
import { Achievement } from "models/Achievement";

export const achievementsArray = [
  {
    id: 1,
    name: "Buy 1 game",
    discount: 1,
  },
  {
    id: 2,
    name: "Buy 2 games",
    discount: 3,
  },
  {
    id: 3,
    name: "Buy 10 games",
    discount: 5,
  },
] as Achievement[];

export async function seed(knex: Knex): Promise<void> {
  await knex("achievements").insert(achievementsArray);
}
