import { query } from '../config/db.js';
import fs from 'fs';

async function populateHotels() {
  try {
    const dumpContent = fs.readFileSync('database/schema/nyle_dump.sql', 'utf8');
    
    // Find INSERT INTO public.hotels
    // The dump usually has COPY public.hotels (...) FROM stdin;
    // or INSERT INTO public.hotels (...) VALUES (...);
    
    // Let's check for COPY first
    const copyMatch = dumpContent.match(/COPY public\.hotels \([^)]+\) FROM stdin;([\s\S]+?)\\\./);
    if (copyMatch) {
      console.log('Found COPY data for hotels. Parsing...');
      const columns = dumpContent.match(/COPY public\.hotels \(([^)]+)\) FROM stdin;/)[1].split(', ').map(c => c.trim());
      const dataRows = copyMatch[1].trim().split('\n');
      
      for (const row of dataRows) {
        const values = row.split('\t').map(v => v === '\\N' ? null : v);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const sql = `INSERT INTO public.hotels (${columns.join(', ')}) VALUES (${placeholders})`;
        console.log(`Inserting hotel: ${values[2]}...`);
        try {
          await query(sql, values);
        } catch (e) {
          console.error(`Failed to insert hotel ${values[2]}: ${e.message}`);
        }
      }
    } else {
      console.warn('Could not find COPY data for hotels.');
    }

    console.log('Population complete!');
  } catch (err) {
    console.error('Population failed:', err.message);
  } finally {
    process.exit();
  }
}

populateHotels();
