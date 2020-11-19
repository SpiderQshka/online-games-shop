import Knex from "knex";
const env = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[env];
export default Knex(config);
