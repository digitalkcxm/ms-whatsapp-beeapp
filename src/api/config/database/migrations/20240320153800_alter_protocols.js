const up = (knex) => knex.raw(`ALTER TABLE protocols ADD COLUMN id_config INTEGER NOT NULL REFERENCES configs(id)`)

const down = (knex) => knex.raw(`ALTER TABLE protocols DROP COLUMN id_config`)

export { up, down }
