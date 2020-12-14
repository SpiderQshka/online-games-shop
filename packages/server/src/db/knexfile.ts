import "ts-node/register";
import { config } from "dotenv";
config({ path: "../../.env" });

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
      tableName: "table_migrations_production",
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
      tableName: "table_migrations_production",
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds",
    },
  },
};
