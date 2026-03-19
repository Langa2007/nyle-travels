import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function main() {
  const email = process.argv[2] || 'admin@nyle.com';
  const plainPassword = process.argv[3] || 'adminpassword';
  
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
