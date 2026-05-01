import { query } from '../config/db.js';

async function checkVideoSetting() {
  try {
    const res = await query("SELECT * FROM app_settings WHERE key = 'showcase_video_section'");
    console.log('Video Setting in DB:', JSON.stringify(res.rows[0], null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

checkVideoSetting();
