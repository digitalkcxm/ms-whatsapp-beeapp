const up = (knex) => knex.raw(`ALTER TABLE instances ADD COLUMN id_config INTEGER NOT NULL REFERENCES configs(id)`)

const down = (knex) => knex.raw(`ALTER TABLE instances DROP COLUMN id_config`)

export { up, down }
