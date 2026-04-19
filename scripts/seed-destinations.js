import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const destinations = [
  {
    name: 'Maasai Mara',
    slug: 'maasai-mara',
    country: 'Kenya',
    region: 'Rift Valley',
    description: 'The Maasai Mara is a large game reserve in Narok County, Kenya, which is the northern continuation of the Serengeti National Park in Tanzania. It is famous for its exceptional population of lions, leopards and cheetahs, and the annual migration of zebra and wildebeest from the Serengeti every year from July to October, known as the Great Migration.',
    short_description: 'Famous for the Great Migration and exceptional wildlife populations.',
    latitude: -1.5061,
    longitude: 35.0081,
    best_time_to_visit: 'June to October (dry season) for Great Migration, December to March for green landscapes',
    how_to_get_there: 'Fly to Nairobi, then drive 5-6 hours or take a short flight to Mara Serena Airport',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended. Drink bottled water. Standard safari precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Maasai', 'Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1547471080-7cc8555ca1f4?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1547471080-7cc8555ca1f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Maasai Mara Safari | Kenya Wildlife Reserve',
    meta_description: 'Experience the Maasai Mara, home to the Great Migration and incredible wildlife populations.',
    meta_keywords: ['Maasai Mara', 'Safari', 'Great Migration', 'Kenya', 'Wildlife'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Diani Beach',
    slug: 'diani-beach',
    country: 'Kenya',
    region: 'Coast',
    description: 'Diani Beach is a major beach resort on the Indian Ocean coast of Kenya. It is located 30 km south of Mombasa and is known for its pristine white sand beaches, luxury resorts, and water sports activities.',
    short_description: 'Pristine white sand beaches with luxury resorts and water sports.',
    latitude: -4.3067,
    longitude: 39.5800,
    best_time_to_visit: 'December to March (dry season) for best weather and water activities',
    how_to_get_there: 'Fly to Mombasa (Moi International Airport), then drive 45 minutes south',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended in coastal areas. Standard beach safety precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Diani Beach | Luxury Kenya Beach Resort',
    meta_description: 'Relax on Diani Beach\'s pristine white sands with luxury resorts and water sports.',
    meta_keywords: ['Diani Beach', 'Beach Resort', 'Kenya Coast', 'Water Sports', 'Luxury'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Mount Kenya',
    slug: 'mount-kenya',
    country: 'Kenya',
    region: 'Central Highlands',
    description: 'Mount Kenya is the highest mountain in Kenya and the second-highest in Africa. It is an ancient extinct volcano and a UNESCO World Heritage site, offering challenging trekking routes and stunning alpine scenery.',
    short_description: 'Africa\'s second-highest peak with challenging treks and alpine scenery.',
    latitude: -0.1528,
    longitude: 37.3081,
    best_time_to_visit: 'January to February, July to September (dry seasons)',
    how_to_get_there: 'Fly to Nairobi, then drive 3-4 hours to park gates',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'High altitude trekking requires fitness and acclimatization. Medical clearance recommended.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Mount Kenya Trekking | Africa\'s Second-Highest Peak',
    meta_description: 'Trek Mount Kenya, Africa\'s second-highest peak with stunning alpine scenery.',
    meta_keywords: ['Mount Kenya', 'Trekking', 'Mountaineering', 'Kenya', 'Alpine'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Amboseli National Park',
    slug: 'amboseli-national-park',
    country: 'Kenya',
    region: 'Southern Rift Valley',
    description: 'Amboseli National Park is famous for its large elephant herds and stunning views of Mount Kilimanjaro. The park is located at the base of Africa\'s highest mountain and offers excellent wildlife viewing.',
    short_description: 'Large elephant herds and stunning Kilimanjaro views in southern Kenya.',
    latitude: -2.6437,
    longitude: 37.2519,
    best_time_to_visit: 'June to October (dry season) for best wildlife viewing',
    how_to_get_there: 'Fly to Nairobi, then drive 4-5 hours south',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended. Standard safari precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Maasai', 'Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Amboseli National Park | Elephants & Kilimanjaro Views',
    meta_description: 'Experience Amboseli\'s elephant herds and stunning views of Mount Kilimanjaro.',
    meta_keywords: ['Amboseli', 'Elephants', 'Kilimanjaro', 'Safari', 'Kenya'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Tsavo National Park',
    slug: 'tsavo-national-park',
    country: 'Kenya',
    region: 'Coast',
    description: 'Tsavo National Park is Kenya\'s largest national park, divided into Tsavo East and Tsavo West. It\'s famous for its red elephants, diverse wildlife, and the man-eating lions of Tsavo legend.',
    short_description: 'Kenya\'s largest park with red elephants and legendary man-eating lions.',
    latitude: -3.0000,
    longitude: 38.5000,
    best_time_to_visit: 'June to October (dry season) for wildlife concentration',
    how_to_get_there: 'Fly to Nairobi, then drive 4-6 hours east',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended. Standard safari precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Tsavo National Park | Red Elephants & Legendary Lions',
    meta_description: 'Explore Tsavo, Kenya\'s largest park with red elephants and legendary wildlife.',
    meta_keywords: ['Tsavo', 'Red Elephants', 'Man-Eating Lions', 'Safari', 'Kenya'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Nairobi',
    slug: 'nairobi',
    country: 'Kenya',
    region: 'Central',
    description: 'Nairobi is the capital and largest city of Kenya. It\'s a modern African metropolis with a mix of urban culture, wildlife sanctuaries, and colonial history.',
    short_description: 'Kenya\'s vibrant capital city with urban culture and nearby wildlife.',
    latitude: -1.2864,
    longitude: 36.8172,
    best_time_to_visit: 'January to March, July to September (dry seasons)',
    how_to_get_there: 'Direct international flights to Jomo Kenyatta International Airport',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Standard urban safety precautions. Some areas to avoid at night.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Nairobi City Guide | Kenya\'s Vibrant Capital',
    meta_description: 'Explore Nairobi, Kenya\'s modern capital with urban culture and nearby wildlife.',
    meta_keywords: ['Nairobi', 'City Tour', 'Kenya Capital', 'Urban Safari', 'Culture'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Lake Nakuru',
    slug: 'lake-nakuru',
    country: 'Kenya',
    region: 'Rift Valley',
    description: 'Lake Nakuru National Park is famous for its flamingo populations and white rhino sanctuary. The lake is a UNESCO World Heritage site and offers diverse birdlife and wildlife.',
    short_description: 'Famous flamingo lake and white rhino sanctuary in the Rift Valley.',
    latitude: -0.3667,
    longitude: 36.0833,
    best_time_to_visit: 'October to March for flamingo concentrations',
    how_to_get_there: 'Fly to Nairobi, then drive 2-3 hours northwest',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended. Standard safari precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Lake Nakuru | Flamingos & White Rhino Sanctuary',
    meta_description: 'Visit Lake Nakuru\'s famous flamingo populations and white rhino sanctuary.',
    meta_keywords: ['Lake Nakuru', 'Flamingos', 'White Rhino', 'Safari', 'Kenya'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Laikipia',
    slug: 'laikipia',
    country: 'Kenya',
    region: 'Northern Kenya',
    description: 'Laikipia is a vast conservancy area in northern Kenya known for its wilderness safaris, community conservation, and diverse wildlife in a pristine wilderness setting.',
    short_description: 'Wilderness conservancies with authentic safaris and community conservation.',
    latitude: 0.0833,
    longitude: 36.8333,
    best_time_to_visit: 'June to October (dry season) for wildlife concentration',
    how_to_get_there: 'Fly to Nairobi, then charter flight to Laikipia airstrips',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended. Remote area precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc8555ca1f4?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Laikipia Wilderness | Authentic Kenya Safari Experience',
    meta_description: 'Experience authentic wilderness safaris in Laikipia\'s vast conservancies.',
    meta_keywords: ['Laikipia', 'Wilderness Safari', 'Conservancy', 'Northern Kenya', 'Authentic Safari'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Samburu',
    slug: 'samburu',
    country: 'Kenya',
    region: 'Northern Kenya',
    description: 'Samburu National Reserve is known for its unique wildlife species and Samburu tribal culture. Located in northern Kenya, it offers a different safari experience with desert-adapted animals.',
    short_description: 'Unique northern Kenya wildlife and Samburu tribal culture.',
    latitude: 0.5833,
    longitude: 37.5333,
    best_time_to_visit: 'June to October (dry season) for wildlife viewing',
    how_to_get_there: 'Fly to Nairobi, then drive 6-7 hours north or take a charter flight',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended. Standard safari precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Samburu', 'Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc8555ca1f4?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Samburu National Reserve | Unique Northern Kenya Wildlife',
    meta_description: 'Experience Samburu\'s unique wildlife species and tribal culture in northern Kenya.',
    meta_keywords: ['Samburu', 'Northern Kenya', 'Tribal Culture', 'Safari', 'Unique Wildlife'],
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Watamu',
    slug: 'watamu',
    country: 'Kenya',
    region: 'Coast',
    description: 'Watamu is a marine paradise on Kenya\'s north coast, known for its coral reefs, marine life, and Swahili cultural heritage. It offers excellent snorkeling and diving opportunities.',
    short_description: 'Marine paradise with coral reefs, snorkeling, and Swahili culture.',
    latitude: -3.3500,
    longitude: 40.0167,
    best_time_to_visit: 'December to March (dry season) for best marine conditions',
    how_to_get_there: 'Fly to Malindi Airport, then drive 20 minutes north',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Marine safety precautions. Malaria prophylaxis recommended.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Watamu Marine Paradise | Snorkeling & Swahili Culture',
    meta_description: 'Explore Watamu\'s coral reefs, marine life, and Swahili cultural heritage.',
    meta_keywords: ['Watamu', 'Snorkeling', 'Marine Life', 'Swahili Culture', 'Kenya Coast'],
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Lamu Island',
    slug: 'lamu-island',
    country: 'Kenya',
    region: 'Coast',
    description: 'Lamu Island is a UNESCO World Heritage site known for its well-preserved Swahili architecture, Islamic culture, and tranquil island atmosphere. It\'s car-free and offers a unique cultural experience.',
    short_description: 'UNESCO World Heritage site with Swahili architecture and Islamic culture.',
    latitude: -2.2717,
    longitude: 40.9022,
    best_time_to_visit: 'December to March (dry season) for best weather',
    how_to_get_there: 'Fly to Lamu Airport or take ferry from mainland',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Modest dress required. Malaria prophylaxis recommended.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'Arabic', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Lamu Island | UNESCO World Heritage & Swahili Culture',
    meta_description: 'Experience Lamu Island\'s UNESCO-listed Swahili architecture and Islamic heritage.',
    meta_keywords: ['Lamu Island', 'UNESCO', 'Swahili Architecture', 'Islamic Culture', 'Kenya'],
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Hell\'s Gate National Park',
    slug: 'hells-gate-national-park',
    country: 'Kenya',
    region: 'Rift Valley',
    description: 'Hell\'s Gate is Kenya\'s only walkable national park, famous for its dramatic gorges, geothermal features, and the ability to walk among wildlife. It\'s also where you can cycle through the park.',
    short_description: 'Kenya\'s only walkable national park with gorges, geothermal features, and cycling.',
    latitude: -0.9833,
    longitude: 36.2833,
    best_time_to_visit: 'June to September, December to February (dry seasons)',
    how_to_get_there: 'Fly to Nairobi, then drive 1.5 hours northwest',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Geothermal areas require caution. Standard safari precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Hell\'s Gate National Park | Walkable Safari Adventure',
    meta_description: 'Experience Kenya\'s only walkable national park with gorges, geothermal features, and cycling.',
    meta_keywords: ['Hell\'s Gate', 'Walkable Safari', 'Cycling', 'Geothermal', 'Kenya'],
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Aberdare National Park',
    slug: 'aberdare-national-park',
    country: 'Kenya',
    region: 'Central Highlands',
    description: 'Aberdare National Park is known for its bamboo forests, waterfalls, and the famous tree lodges. It\'s home to the rare bongo antelope and offers excellent hiking opportunities.',
    short_description: 'Bamboo forests, waterfalls, and tree lodges in central Kenya highlands.',
    latitude: -0.4167,
    longitude: 36.6667,
    best_time_to_visit: 'December to March, June to September (dry seasons)',
    how_to_get_there: 'Fly to Nairobi, then drive 2-3 hours north',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Mountain weather can change quickly. Standard hiking precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Aberdare National Park | Bamboo Forests & Tree Lodges',
    meta_description: 'Explore Aberdare\'s bamboo forests, waterfalls, and famous tree lodges.',
    meta_keywords: ['Aberdare', 'Bamboo Forest', 'Tree Lodge', 'Waterfalls', 'Kenya'],
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Meru National Park',
    slug: 'meru-national-park',
    country: 'Kenya',
    region: 'Eastern Kenya',
    description: 'Meru National Park is one of Kenya\'s most underrated parks, offering excellent wildlife viewing, beautiful landscapes, and fewer crowds than the more famous reserves.',
    short_description: 'Underrated wildlife paradise with diverse ecosystems and fewer crowds.',
    latitude: 0.0833,
    longitude: 38.0833,
    best_time_to_visit: 'June to October (dry season) for best wildlife viewing',
    how_to_get_there: 'Fly to Nairobi, then drive 4-5 hours northeast',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended. Standard safari precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1547471080-7cc8555ca1f4?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1547471080-7cc8555ca1f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Meru National Park | Underrated Kenya Wildlife Paradise',
    meta_description: 'Discover Meru National Park\'s diverse wildlife and beautiful landscapes.',
    meta_keywords: ['Meru', 'National Park', 'Wildlife', 'Safari', 'Kenya'],
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Ruma National Park',
    slug: 'ruma-national-park',
    country: 'Kenya',
    region: 'Nyanza',
    description: 'Ruma National Park is Kenya\'s smallest national park and home to the largest population of Roan antelope in the country. It offers excellent bird watching and grassland wildlife.',
    short_description: 'Kenya\'s smallest park with Roan antelope and excellent bird watching.',
    latitude: -0.6500,
    longitude: 34.2833,
    best_time_to_visit: 'June to October (dry season) for wildlife concentration',
    how_to_get_there: 'Fly to Kisumu, then drive 1 hour west',
    visa_requirements: 'East African Tourist Visa or e-visa available',
    health_safety: 'Malaria prophylaxis recommended. Standard safari precautions.',
    currency: 'Kenyan Shilling (KES)',
    languages: ['Luo', 'Swahili', 'English'],
    timezone: 'East Africa Time (UTC+3)',
    featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80'
    ],
    meta_title: 'Ruma National Park | Roan Antelope & Bird Watching',
    meta_description: 'Visit Kenya\'s smallest national park with Roan antelope and excellent birdlife.',
    meta_keywords: ['Ruma', 'Roan Antelope', 'Bird Watching', 'Kenya', 'Smallest Park'],
    is_featured: false,
    is_active: true,
  }
];

async function seedDestinations() {
  const client = await pool.connect();

  try {
    console.log('Starting destination seeding with raw SQL...');

    let successCount = 0;
    let skipCount = 0;

    for (const destData of destinations) {
      try {
        // Check if destination already exists
        const existingQuery = 'SELECT id FROM destinations WHERE slug = $1';
        const existingResult = await client.query(existingQuery, [destData.slug]);

        if (existingResult.rows.length > 0) {
          console.log(`⏭️  Skipping existing destination: ${destData.name}`);
          skipCount++;
          continue;
        }

        // Insert destination using raw SQL
        const insertQuery = `
          INSERT INTO destinations (
            name, slug, country, region, description, short_description,
            latitude, longitude, best_time_to_visit, how_to_get_there,
            visa_requirements, health_safety, currency, languages, timezone,
            featured_image, gallery_images, meta_title, meta_description,
            meta_keywords, is_featured, is_active
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21, $22
          ) RETURNING id
        `;

        const values = [
          destData.name,
          destData.slug,
          destData.country,
          destData.region,
          destData.description,
          destData.short_description,
          destData.latitude,
          destData.longitude,
          destData.best_time_to_visit,
          destData.how_to_get_there,
          destData.visa_requirements,
          destData.health_safety,
          destData.currency,
          destData.languages,
          destData.timezone,
          destData.featured_image,
          destData.gallery_images,
          destData.meta_title,
          destData.meta_description,
          destData.meta_keywords,
          destData.is_featured,
          destData.is_active
        ];

        const result = await client.query(insertQuery, values);
        successCount++;
        console.log(`✅ Created destination: ${destData.name} (ID: ${result.rows[0].id})`);
      } catch (error) {
        console.error(`❌ Failed to create destination: ${destData.name}`, error.message);
      }
    }

    console.log(`\n🎉 Destination seeding completed:`);
    console.log(`✅ Successfully created: ${successCount} destinations`);
    console.log(`⏭️  Skipped (existing): ${skipCount} destinations`);

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM destinations';
    const countResult = await client.query(countQuery);
    console.log(`📊 Total destinations in database: ${countResult.rows[0].total}`);

  } catch (error) {
    console.error('💥 Destination seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the seeding
seedDestinations()
  .then(async () => {
    console.log('\n🏁 Destination seeding script completed successfully.');
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('\n💥 Destination seeding script failed:', error);
    await pool.end();
    process.exit(1);
  });