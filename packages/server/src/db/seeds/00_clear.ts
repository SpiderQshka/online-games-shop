require("tsconfig-paths/register");
import Knex from "knex";
import { Models } from "models";

export async function seed(knex: Knex): Promise<void> {
  await knex(Models.unlockedAchievements.tableName).del();
  await knex(Models.orderedGames.tableName).del();
  await knex(Models.usedGenres.tableName).del();
  await knex(Models.usedDiscounts.tableName).del();
  await knex(Models.games.tableName).del();
  await knex(Models.achievements.tableName).del();
  await knex(Models.orders.tableName).del();
  await knex(Models.genres.tableName).del();
  await knex(Models.discounts.tableName).del();
  await knex(Models.gameCreators.tableName).del();
  await knex(Models.users.tableName).del();
}
