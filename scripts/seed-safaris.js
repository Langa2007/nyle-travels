import { query } from '../config/db.js';

const safaris = [
  { name: 'Great Migration Spectacle', days: 7, dest: 'Maasai Mara National Reserve' },
  { name: 'Amboseli Elephant Trek', days: 5, dest: 'Amboseli National Park' },
  { name: 'Tsavo Red Elephant Safari', days: 4, dest: 'Tsavo National Park' },
  { name: 'Samburu Special 5 Safari', days: 6, dest: 'Samburu' },
  { name: 'Mara River Crossing Expedition', days: 8, dest: 'Maasai Mara National Reserve' },
  { name: 'Kilimanjaro View Safari', days: 3, dest: 'Amboseli National Park' },
  { name: 'Tsavo East & West Explorer', days: 6, dest: 'Tsavo National Park' },
  { name: 'Northern Frontier Safari', days: 7, dest: 'Samburu' },
  { name: 'Big Five Discovery Safari', days: 5, dest: 'Maasai Mara National Reserve' },
  { name: 'Amboseli Photography Tour', days: 4, dest: 'Amboseli National Park' },
  { name: 'Tsavo Wilderness Adventure', days: 5, dest: 'Tsavo National Park' },
  { name: 'Samburu Cultural Safari', days: 4, dest: 'Samburu' },
  { name: 'Mara Conservancies Luxury Safari', days: 6, dest: 'Maasai Mara National Reserve' },
  { name: 'Amboseli Family Safari', days: 5, dest: 'Amboseli National Park' },
  { name: 'Tsavo Bird Watching Safari', days: 4, dest: 'Tsavo National Park' },
  { name: 'Samburu Leopard Tracking', days: 5, dest: 'Samburu' },
  { name: 'Maasai Mara Balloon Safari', days: 4, dest: 'Maasai Mara National Reserve' },
  { name: 'Amboseli Walking Safari', days: 3, dest: 'Amboseli National Park' },
  { name: 'Tsavo Night Game Drive Safari', days: 4, dest: 'Tsavo National Park' },
  { name: 'Samburu Riverside Safari', days: 5, dest: 'Samburu' },
  { name: 'Ultimate Mara Experience', days: 9, dest: 'Maasai Mara National Reserve' },
  { name: 'Amboseli Conservation Tour', days: 6, dest: 'Amboseli National Park' },
  { name: 'Tsavo Historical Safari', days: 5, dest: 'Tsavo National Park' },
  { name: 'Samburu Reticulated Giraffe Tour', days: 4, dest: 'Samburu' },
  { name: 'Maasai Mara Cheetah Tracking', days: 5, dest: 'Maasai Mara National Reserve' },
  { name: 'Amboseli Eco-Safari', days: 4, dest: 'Amboseli National Park' },
  { name: 'Tsavo Man-Eaters Trail Safari', days: 5, dest: 'Tsavo National Park' },
  { name: 'Samburu Rugged Terrain Safari', days: 6, dest: 'Samburu' },
  { name: 'Mara Triangle Explorer', days: 4, dest: 'Maasai Mara National Reserve' },
  { name: 'Amboseli Sunrise Safari', days: 3, dest: 'Amboseli National Park' }
];

async function seedSafaris() {
  try {
    const destRes = await query('SELECT id, name FROM destinations');
    const destinations = destRes.rows;
    
    for (let i = 0; i < safaris.length; i++) {
      const safari = safaris[i];
      const dest = destinations.find(d => d.name === safari.dest);
      if (!dest) continue;

      const slug = safari.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      const code = 'SAF-' + Math.floor(Math.random() * 10000);
      const price = 1500 + Math.floor(Math.random() * 3000);
      const nights = safari.days - 1;

      await query(
        `INSERT INTO tour_packages (
          destination_id, name, slug, package_code, duration_days, duration_nights,
          difficulty_level, group_size_min, group_size_max, private_tour_available,
          private_tour_price, description, short_description, highlights,
          base_price, price_currency, is_active, type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          dest.id, safari.name, slug, code, safari.days, nights,
          'moderate', 2, 12, true,
          price + 1000, `Enjoy the ultimate ${safari.name} with Nyle Travels.`, `Experience the ${safari.name}.`, ['Game drives', 'Luxury lodges'],
          price, 'USD', true, 'safari'
        ]
      );
      console.log(`Inserted ${safari.name}`);
    }
    console.log('Successfully seeded 30 safaris!');
  } catch (error) {
    console.error('Error seeding safaris:', error);
  } finally {
    process.exit(0);
  }
}

seedSafaris();
