import type { Knex } from "knex";
import "dotenv/config";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.db_host,
      port: parseInt(process.env.db_port || "5432"),
      user: process.env.db_user,
      password: process.env.db_password,
      database: process.env.db_database,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: "./migrations",
    },
  },
};

export default config;
