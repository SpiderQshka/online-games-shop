require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";
import { IGame } from "models/types";

export async function up(knex: Knex): Promise<void> {
  const games: IGame[] = await knex.select().from(Models.games.tableName);
  return knex.transaction((trx) => {
    return knex.schema
      .table(Models.games.tableName, (table) =>
        table.string("physicalCopyPrice").notNullable()
      )
      .then(() =>
        Promise.all(
          games.map((game) =>
            knex(Models.games.tableName)
              .update({ physicalCopyPrice: game.price })
              .where("id", game.id)
              .transacting(trx)
          )
        )
      )
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

export async function down(knex: Knex): Promise<void> {
  //   return await knex.schema.dropTableIfExists(Models.games.tableName);
}
