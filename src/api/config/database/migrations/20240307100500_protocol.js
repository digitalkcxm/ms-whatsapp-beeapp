const up = (knex) =>
  knex.schema.createTable("protocols", (table) => {
    table.increments();
    table.integer("id_company_settings").notNullable().unsigned().references("id").inTable("company_settings");
    table.integer("id_instance").notNullable().unsigned().references("id").inTable("instances");
    table.string("phone").notNullable();
    table.string("status").notNullable();
    table.string("originator");
    table.datetime("started_at");
    table.datetime("finished_at");
    table.boolean("activated").defaultTo(true);
    table.timestamps(true, true);
  });

const down = (knex) => knex.schema.dropTableIfExists("protocols");

export { up, down };
