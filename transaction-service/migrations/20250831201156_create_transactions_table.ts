import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transactions", (transactions) => {
    transactions.increments("id");
    transactions.string("transaction_name");
    transactions.string("location");
    transactions.integer("transaction_amt");
    transactions.float("fraud_score");
    transactions.string("status");
    transactions.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}
