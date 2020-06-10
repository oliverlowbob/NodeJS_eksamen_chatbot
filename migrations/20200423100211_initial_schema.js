
exports.up = function(knex) {
    return knex.schema
    .createTable("roles", (table) => {
        table.increments("id");
        table.string("role").unique().notNullable();
    })
    .createTable("users", (table) => {
        table.increments("id");
        table.string("username").unique().notNullable();
        table.string("password").notNullable();

        table.integer("role_id").unsigned().notNullable();
        table.foreign("role_id").references("id").inTable("roles");

        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));

        table.string("email");
    })

};  
// DML = MANIPULATE = SELECT, UPDATE, DELETE ROWS
// DDL = DEFINE = CREATE, DROP TABLES
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("roles");

};
