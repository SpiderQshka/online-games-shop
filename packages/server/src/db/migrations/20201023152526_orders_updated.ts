require("tsconfig-paths/register");
import * as Knex from "knex";
import { Models } from "models";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return knex.schema
      .table(Models.orders.tableName, (table) => table.dropColumn("price"))
      .then(() =>
        knex.schema.table(Models.orders.tableName, (table) =>
          table.decimal("price").notNullable()
        )
      )
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

export async function down(knex: Knex): Promise<void> {}
