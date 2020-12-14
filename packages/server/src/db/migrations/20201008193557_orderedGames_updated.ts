require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return knex.schema
      .table(Models.orderedGames.tableName, (table) =>
        table.boolean("isPhysical").defaultTo(false).notNullable()
      )
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

export async function down(knex: Knex): Promise<void> {}
