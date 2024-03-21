const up = (knex) =>
  knex.schema.createTable('configs', (table) => {
    table.increments()
    table.integer('id_company_settings').notNullable().unsigned().references('id').inTable('company_settings')
    table.string('name').notNullable()
    table.string('token').unique().notNullable()
    table.integer('start_department_id').notNullable()
    table.boolean('activated').defaultTo(true)
    table.timestamps(true, true)
  })

const down = (knex) => knex.schema.dropTableIfExists('configs')

export { up, down }
