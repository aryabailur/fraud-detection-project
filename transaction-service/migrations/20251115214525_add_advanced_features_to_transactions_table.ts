import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("transactions", function (table) {
    table.renameColumn("transaction_name", "Customer_name");
    table.dropColumn("location");
    table.float("transaction_amt").alter();
    table.renameColumn("transaction_amt", "TX_AMT");

    table.renameColumn("fraud_score", "risk_score");
    table.integer("CUSTOMER_ID");
    table.timestamp("TX_DATETIME");
    table.float("latitude");
    table.float("longitude");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("transactions", function (table) {
    table.renameColumn("Customer_name", "transaction_name");
    table.renameColumn("TX_AMT", "transaction_amt");
    table.renameColumn("risk_score", "fraud_score");
    table.dropColumn("CUSTOMER_ID");
    table.dropColumn("TX_DATETIME");
    table.dropColumn("latitude");
    table.dropColumn("longitude");
  });
}
