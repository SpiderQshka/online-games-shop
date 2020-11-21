import "ts-node/register";
import { config } from "dotenv";
config({ path: "../../.env" });

const fileExt = __filename.split(".")[1];

const migrationsTableName =
  fileExt === "js" ? "table_migrations_production" : "table_migrations";

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: migrationsTableName,
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds",
    },
  },

  production: {
    client: "postgres",
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: migrationsTableName,
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds",
    },
  },
};
