import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const foreignKeys = await knex("pg_constraint")
    .select("*")
    .where("contype", "=", "f");

  const queries = foreignKeys.map(async (foreignKey) => {
    const [keyData] = await knex("pg_class")
      .select("relname")
      .where("oid", "=", foreignKey.conrelid);

    const tableName = keyData.relname;

    return knex.schema.raw(`
      ALTER TABLE "${tableName}"
      ALTER CONSTRAINT ${foreignKey.conname}
      DEFERRABLE INITIALLY DEFERRED;
    `);
  });

  await Promise.all(queries);
}

export async function down(knex: Knex): Promise<void> {}
