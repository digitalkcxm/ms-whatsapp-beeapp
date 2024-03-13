const up = (knex) =>
  knex.schema.createTable("instances", (table) => {
    table.increments();
    table.integer("id_company_settings").notNullable().unsigned().references("id").inTable("company_settings");
    table.string("token").notNullable().unique();
    table.string("number").notNullable();
    table.string("whatsapp_uri").notNullable();
    table.string("name").notNullable();
    table.string("api_key").notNullable().unique();
    table.boolean("activated").defaultTo(true);
    table.timestamps(true, true);
  });

const down = (knex) => knex.schema.dropTableIfExists("instances");

export { up, down };
