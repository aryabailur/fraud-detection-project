// knexfile.ts
import dotenv from "dotenv";
dotenv.config({ path: require("path").resolve(__dirname, "..", ".env") });

const useDatabaseUrl = !!process.env.DATABASE_URL;

const connection = useDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: String(process.env.DB_HOST ?? "127.0.0.1"),
      port: Number(process.env.DB_PORT ?? 5432),
      user: String(process.env.DB_USER ?? "postgres"),
      password: String(process.env.DB_PASS ?? ""),
      database: String(process.env.DB_NAME ?? "postgres"),
      ssl: { rejectUnauthorized: false },
    };

const config = {
  development: {
    client: "pg",
    connection,
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    pool: { min: 0, max: 10 },
  },
};

export default config;
