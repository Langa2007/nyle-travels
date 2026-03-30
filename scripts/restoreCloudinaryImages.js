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

const cloudinaryImages = [
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774787263/nyle-travel/settings/dmrc2yxgfnqmyji6bgjn.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774787209/nyle-travel/settings/uajtbsbgz3651pt3dvob.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774787116/nyle-travel/settings/trgheimybdckjldiun3u.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774787097/nyle-travel/settings/dvetzwpvnvcch60ikrnq.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774786980/nyle-travel/settings/ovfm9vttxuxw6fiftovl.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774786925/nyle-travel/settings/bssukwxgaryhm5bcdqbd.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774786895/nyle-travel/settings/d7gnf5c49nndz3mjrjxm.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774786868/nyle-travel/settings/nfwzslzoxwg5o0sltoky.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774786842/nyle-travel/settings/xellsfr325w7uezyp0no.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774786814/nyle-travel/settings/rxhems39kn5vmtywbnkc.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774694857/nyle-travel/settings/dctibcevvd6s1kehimq4.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774694531/nyle-travel/settings/snyerhj4qbyflunbf6lt.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774694500/nyle-travel/settings/r92scuzkyufsbj2uekd6.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774694400/nyle-travel/settings/m4rqbhvs4muel1vyxbjg.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774693971/nyle-travel/settings/barfcvko6w21j1cwodxu.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774693914/nyle-travel/settings/hh21grqeiseykhwzygl5.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774693839/nyle-travel/settings/wbs0pl0zjyefyrzwqhei.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774693822/nyle-travel/settings/jxfic0pueiotrugv7zwk.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774693791/nyle-travel/settings/dfqgujvymlsau7xsmuxj.jpg",
  "https://res.cloudinary.com/dfj4qmznz/image/upload/v1774693717/nyle-travel/settings/mlcqnttm5alwsdtqrltf.jpg"
];

async function replaceImages() {
  try {
    const result = await pool.query('SELECT key, value FROM app_settings');
    let cloudinaryIndex = 0;

    for (const row of result.rows) {
      let isUpdated = false;
      const data = row.value;

      // Helper to traverse and replace images
      const traverseAndReplace = (obj) => {
        if (Array.isArray(obj)) {
          obj.forEach(item => traverseAndReplace(item));
        } else if (obj !== null && typeof obj === 'object') {
          // If object has an image property and we still have cloudinary images
          if (obj.image && typeof obj.image === 'string' && obj.image.includes('images.unsplash.com') && cloudinaryIndex < cloudinaryImages.length) {
            obj.image = cloudinaryImages[cloudinaryIndex++];
            isUpdated = true;
          }
          if (obj.thumbnail && typeof obj.thumbnail === 'string' && obj.thumbnail.includes('images.unsplash.com') && cloudinaryIndex < cloudinaryImages.length) {
            obj.thumbnail = cloudinaryImages[cloudinaryIndex++];
            isUpdated = true;
          }
          Object.values(obj).forEach(val => traverseAndReplace(val));
        }
      };

      traverseAndReplace(data);

      if (isUpdated) {
        await pool.query('UPDATE app_settings SET value = $1 WHERE key = $2', [JSON.stringify(data), row.key]);
        console.log(`Updated images in section: ${row.key}`);
      }
    }

    console.log('Finished restoring Cloudinary images to settings.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

replaceImages();
