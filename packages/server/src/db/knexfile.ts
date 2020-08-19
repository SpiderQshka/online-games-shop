require("ts-node/register");

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "73732121",
    },
    migrations: {
      tableName: "table_migrations",
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "73732121",
    },
    migrations: {
      tableName: "table_migrations",
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds",
    },
  },
};
