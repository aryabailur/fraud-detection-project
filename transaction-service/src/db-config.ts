import knex from "knex";
import config from "../knexfile";

const dbconfig = config.development;
const dbClient = knex(dbconfig);
export default dbClient;
