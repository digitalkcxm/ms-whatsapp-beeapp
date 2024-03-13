const up = (knex) =>
  knex.schema.createTable("company_settings", (table) => {
    table.increments();
    table.string("token").notNullable().unique();
    table.boolean("activated").defaultTo(true);
    table.timestamps(true, true);
  });

const down = (knex) => knex.schema.dropTableIfExists("company_settings");

export { up, down };
