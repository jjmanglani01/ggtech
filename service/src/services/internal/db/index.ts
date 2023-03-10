import { Knex, knex } from "knex";
import { Model } from "objection";
import { join, resolve } from "path";

let _knex: Knex;

// Provides a knex config with the appropriate configuration variables retrieved for the environment
export const getKnexConfig = async (): Promise<Knex.Config> => ({
  client: "postgres",
  version: "12",
  connection: process.env.DB_URL,
  pool: { min: 1, max: 3 },
});

export const getDb = async () => {
  if (_knex) {
    return _knex;
  }
  _knex = knex(await getKnexConfig());

  // Initialize Objection
  Model.knex(_knex);
  return _knex;
};

export const canConnect = async () => {
  try {
    await getKnexConfig();
    return true;
  } catch (e) {
    console.error("An error occurred getting config", { e });
    return false;
  }
};

export const migrate = async () => {
  const knex = await getDb();
  const migrationsDirectory = resolve(join(__dirname, "migrations"));
  try {
    const migrationsConfig: Knex.MigratorConfig = {
      directory: migrationsDirectory,
      tableName: "_knex_migrations",
    };
    const migrations = await knex.migrate.latest(migrationsConfig);
    console.info("DB Migration finished.", { migrationsApplied: migrations });
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Unable to perform DB Migration: ${e.message}`, { error: e });
    } else {
      console.error("Unable to perform DB Migration", { error: e });
    }
  }
};
