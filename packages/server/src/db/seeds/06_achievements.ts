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
  {
    id: 4,
    name: "Make 1 order",
    discount: 1,
  },
  {
    id: 5,
    name: "Make 2 orders",
    discount: 5,
  },
  {
    id: 6,
    name: "Make 10 orders",
    discount: 7,
  },
  {
    id: 7,
    name: "Order 1 physical copy",
    discount: 2,
  },
  {
    id: 8,
    name: "Order 2 physical copies",
    discount: 6,
  },
  {
    id: 9,
    name: "Order 10 physical copies",
    discount: 9,
  },
] as Achievement[];

export async function seed(knex: Knex): Promise<void> {
  await knex("achievements").insert(achievementsArray);
}
