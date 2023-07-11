/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("influencers", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.float("subscribers");
    table.string("channel");
    table.string("plataform");
    table.string("category");
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("id").inTable("users");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("influencers");
};