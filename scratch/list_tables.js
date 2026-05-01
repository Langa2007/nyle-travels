import { query } from '../config/db.js';

async function listTables() {
  try {
    const res = await query("SELECT value FROM app_settings WHERE key = 'hero_sections'");
    const slides = res.rows[0]?.value;
    console.log('Hero slides image check:');
    slides.forEach((s, i) => console.log(`Slide ${i+1}: ${s.image ? 'IMAGE PRESENT: ' + s.image.substring(0, 30) + '...' : 'MISSING IMAGE'}`));
  } catch (err) {
    console.error('Error listing tables:', err.message);
  } finally {
    process.exit();
  }
}

listTables();
