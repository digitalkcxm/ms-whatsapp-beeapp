const up = (knex) => knex.raw(`ALTER TABLE instances ADD COLUMN IF NOT EXISTS id_config INTEGER REFERENCES configs(id)`)

const down = (knex) => knex.raw(`ALTER TABLE instances DROP COLUMN IF EXISTS id_config`)

export { up, down }
