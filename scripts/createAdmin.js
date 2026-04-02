import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredVars = ['ADMIN_FIRST_NAME', 'ADMIN_LAST_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'].filter(
  (key) => !process.env[key]
);

if (requiredVars.length) {
  console.error(`Missing required env vars: ${requiredVars.join(', ')}`);
  process.exit(1);
}

const connectionString =
  process.env.DATABASE_URL_NEON ||
  process.env.DATABASE_URL_LOCAL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('neon.tech')
    ? {
        require: true,
        rejectUnauthorized: false,
      }
    : false,
});

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const plainPassword = process.argv[3] || process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME;
  const lastName = process.env.ADMIN_LAST_NAME;

  try {
    const checkUser = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
    if (checkUser.rows.length > 0) {
      console.log(`Admin user with email ${email} already exists.`);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, passwordHash, firstName, lastName, 'admin']
    );

    console.log('Admin user created successfully.');
    console.log(`Email: ${email}`);
    console.log('Role: admin');
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    pool.end();
  }
}

main();
