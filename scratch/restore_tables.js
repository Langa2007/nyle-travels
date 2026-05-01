import { query } from '../config/db.js';
import fs from 'fs';
import path from 'path';

async function restoreMissingTables() {
  try {
    const dumpContent = fs.readFileSync('database/schema/nyle_dump.sql', 'utf8');
    
    // List of tables we know are missing
    const missingTables = [
      'hotels', 'bookings', 'payments', 'reviews', 'tour_availability', 
      'tour_itineraries', 'booking_participants', 'guide_assignments', 
      'guides', 'notifications', 'wishlists', 'email_logs'
    ];

    console.log('Missing tables to restore:', missingTables.join(', '));

    // We'll split the dump by "CREATE TABLE" and find the ones we need
    const sections = dumpContent.split('CREATE TABLE');
    
    for (const table of missingTables) {
      const section = sections.find(s => s.includes(`public.${table} (`));
      if (section) {
        // Extract the full CREATE TABLE statement
        // It ends at the next major section or semicolon+newline
        const statement = 'CREATE TABLE' + section.split(';')[0] + ';';
        console.log(`Creating table: ${table}...`);
        await query(statement);
        
        // Also find ALTER TABLE and constraints if any
        // (This is a bit complex for a script, but we'll try to find the constraints for these tables)
      } else {
        console.warn(`Could not find definition for ${table} in dump.`);
      }
    }

    // Now let's try to find and run constraints (ALTER TABLE ONLY public.table ADD CONSTRAINT ...)
    const alterSections = dumpContent.split('ALTER TABLE ONLY public.');
    for (const table of missingTables) {
      const relevantAlters = alterSections.filter(s => s.startsWith(table + '\n') || s.startsWith(table + ' '));
      for (const alter of relevantAlters) {
        const statement = 'ALTER TABLE ONLY public.' + alter.split(';')[0] + ';';
        console.log(`Adding constraint/owner for ${table}...`);
        try {
          await query(statement);
        } catch (e) {
          console.warn(`Failed to add constraint/owner for ${table}: ${e.message}`);
        }
      }
    }

    console.log('Restoration complete!');
  } catch (err) {
    console.error('Restoration failed:', err.message);
  } finally {
    process.exit();
  }
}

restoreMissingTables();
