const up = (knex) =>
  knex.schema.createTable("messages", (table) => {
    table.increments();
    table.integer("id_company_settings").notNullable().unsigned().references("id").inTable("company_settings");
    table.integer("id_instance").notNullable().unsigned().references("id").inTable("instances");
    table.integer("id_protocol").notNullable().unsigned().references("id").inTable("protocols");
    table.string("id_message_whatsapp");
    table.string("id_message_core");
    table.jsonb("content").notNullable();
    table.string("type").notNullable();
    table.string("content_type").notNullable();
    table.string("status").notNullable();
    table.string("error_reason");
    table.string("source").notNullable();
    table.timestamps(true, true);
  });

const down = (knex) => knex.schema.dropTableIfExists("messages");

export { up, down };
