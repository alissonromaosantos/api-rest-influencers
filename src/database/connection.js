require("dotenv").config({  
  path: process.env.NODE_ENV.trim() == "test" ? ".env.test" : ".env"
})

const { knex } = require("knex");
const knexfile = require("../../knexfile");

const environment =  process.env.NODE_ENV.trim() ?? "development"
const configDb = knexfile[environment]

module.exports = knex(configDb);