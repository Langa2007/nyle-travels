import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new pkg.Pool({
  connectionString: process.env.DATABASE_URL_NEON || process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

const applySecurityTriggers = async () => {
  try {
    console.log('Applying database security triggers...');

    // 1. Row-Level Safeguard: Prevent DELETE on app_settings
    console.log('Creating prevent_delete trigger on app_settings...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION prevent_app_settings_delete()
      RETURNS trigger AS $$
      BEGIN
          RAISE EXCEPTION 'DELETE operation on app_settings is prohibited. Only UPDATE operations are allowed.';
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      
      DROP TRIGGER IF EXISTS prevent_delete_trigger ON app_settings;
      CREATE TRIGGER prevent_delete_trigger
      BEFORE DELETE ON app_settings
      FOR EACH ROW
      EXECUTE FUNCTION prevent_app_settings_delete();
    `);

    // 2. DDL Event Trigger: Block DROP TABLE for critical tables
    console.log('Creating event trigger for SQL DROP operations...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION protect_critical_tables()
      RETURNS event_trigger AS $$
      DECLARE
          obj record;
      BEGIN
          FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
          LOOP
              IF obj.object_identity IN (
                'public.app_settings', 
                'public.subscribers', 
                'public.destinations'
              ) THEN
                  RAISE EXCEPTION 'CRITICAL DROP BLOCKED: Table % is protected by an event trigger. Dropping is strictly prohibited without DBA override.', obj.object_identity;
              END IF;
          END LOOP;
      END;
      $$ LANGUAGE plpgsql;

      DROP EVENT TRIGGER IF EXISTS protect_critical_tables_trigger;
      CREATE EVENT TRIGGER protect_critical_tables_trigger
      ON sql_drop
      EXECUTE FUNCTION protect_critical_tables();
    `);

    console.log('Database security constraints successfully applied.');

  } catch (err) {
    if (err.message && err.message.includes('permission denied')) {
        console.error('ERROR: Missing SUPERUSER privileges required to create an EVENT TRIGGER on Neon DB.');
        console.error('Recommendation: You may only rely on the Row-Level triggers for now.');
    } else {
        console.error('Database security setup error:', err);
    }
  } finally {
    await pool.end();
  }
};

applySecurityTriggers();
