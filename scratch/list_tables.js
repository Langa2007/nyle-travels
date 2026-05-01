import { query } from '../config/db.js';

async function listTables() {
  try {
    const res = await query("SELECT h.*, d.name as destination_name FROM public.hotels h LEFT JOIN public.destinations d ON h.destination_id = d.id LEFT JOIN public.reviews r ON h.id = r.hotel_id WHERE h.is_active = TRUE GROUP BY h.id, d.id LIMIT 1");
    console.log('Hotel query success, rows:', res.rows.length);
  } catch (err) {
    console.error('Error listing tables:', err.message);
  } finally {
    process.exit();
  }
}

listTables();
