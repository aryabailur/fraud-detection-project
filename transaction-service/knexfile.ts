import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "aws-1-ap-south-1.pooler.supabase.com",
      port: 5432,
      user: "postgres.dzaihsvdrcvmmiazobhe",
      password: "ARU48u%WYj#mj/Q",
      database: "postgres",
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: "./migrations",
    },
  },
};

export default config;
