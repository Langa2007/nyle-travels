import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = 
  process.env.DATABASE_URL_NEON || 
  process.env.DATABASE_URL_LOCAL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('neon.tech') ? {
    require: true,
    rejectUnauthorized: false
  } : false
});

async function main() {
  const email = process.argv[2] || 'fidellanga67@gmail.com';
  const plainPassword = process.argv[3] || 'Stephanie@2007';
  
  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      console.log(`Admin user with email ${email} already exists.`);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(plainPassword, salt);

    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5)`,
      [email, password_hash, 'Super', 'Admin', 'admin']
    );

    console.log(`\n✅ Admin user created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${plainPassword}`);
    console.log(`Role: admin`);
    console.log(`\nYou can now log in at the admin-frontend using these credentials.`);
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    pool.end();
  }
}

main();
