import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const tours = [
  {
    name: "3-Day Maasai Mara Essential Safari",
    package_code: "NYL-MARA-001",
    duration_days: 3,
    duration_nights: 2,
    base_price: 1250,
    difficulty_level: "easy",
    short_description: "Experience the magic of the Mara with premium game drives and luxury tented accommodation.",
    description: "The Maasai Mara is one of the world's most famous wildlife conservation areas. This 3-day safari takes you deep into the heart of the reserve during the best game-viewing times. Expect to see the 'Big Five' and witness the spectacular savannah landscape.",
    highlights: ["Big 5 Game Drives", "Sunset Bush Dinner", "Maasai Village Visit"],
    included_items: ["All Game Drives", "Park Entry Fees", "Full Board Accommodation", "Professional Guide"],
    excluded_items: ["International Flights", "Personal Insurance", "Tips and Gratuities"],
    featured_image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200",
    is_featured: true,
    destination_name: "Maasai Mara"
  },
  {
    name: "5-Day Diani Beach Luxury Escape",
    package_code: "NYL-DIANI-002",
    duration_days: 5,
    duration_nights: 4,
    base_price: 1850,
    difficulty_level: "easy",
    short_description: "Relax on the pristine white sands of Diani Beach in a 5-star ocean-front resort.",
    description: "Voted Africa's best beach destination multiple times, Diani offers turquoise waters and white sands. This package focuses on relaxation and premium service, including spa treatments and a private dhow cruise.",
    highlights: ["Private Dhow Cruise", "Spa Treatment Package", "Snorkeling at Kisite-Mpunguti"],
    included_items: ["Return Flights from Nairobi", "Airport Transfers", "Half Board Accommodation", "Dhow Cruise"],
    excluded_items: ["Water Sports Equipment", "Lunches", "Extra Drinks"],
    featured_image: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1200",
    is_featured: true,
    destination_name: "Diani Beach"
  },
  {
    name: "Mount Kenya Summit Challenge (Sirimon-Chogoria)",
    package_code: "NYL-KENYA-003",
    duration_days: 6,
    duration_nights: 5,
    base_price: 1450,
    difficulty_level: "challenging",
    short_description: "Conquer Point Lenana on Africa's second highest peak via the most scenic routes.",
    description: "A trek up Mount Kenya is a journey through diverse ecosystems, from bamboo forests to alpine moorlands. This route combines the Sirimon ascent with the stunning Chogoria descent for the best views of the peaks.",
    highlights: ["Sunrise at Point Lenana", "Views of Gorges Valley", "Alpine Flora and Fauna"],
    included_items: ["Certified Mountain Guides", "Porters and Cook", "Camping Equipment", "All Meals", "Park Fees"],
    excluded_items: ["Climbing Gear", "Personal Insurance", "Gratuities"],
    featured_image: "https://images.unsplash.com/photo-1547395422-50d4ad545af7?auto=format&fit=crop&w=1200",
    is_featured: false,
    destination_name: "Mount Kenya"
  },
  {
    name: "Amboseli 'Land of Giants' 4-Day Safari",
    package_code: "NYL-AMBO-004",
    duration_days: 4,
    duration_nights: 3,
    base_price: 1100,
    difficulty_level: "easy",
    short_description: "Get up close with Africa's largest elephants against the backdrop of Mt. Kilimanjaro.",
    description: "Amboseli is famous for its large herds of elephants and stunning views of Mount Kilimanjaro across the border in Tanzania. This safari offers excellent photography opportunities in the open plains.",
    highlights: ["Kilimanjaro Views", "Elephant Herd Encounters", "Observation Hill Lookout"],
    included_items: ["All Game Drives", "Park Fees", "Luxury Lodge Stay", "Qualified Ranger"],
    excluded_items: ["Drinks", "Laundry", "Tips"],
    featured_image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200",
    is_featured: true,
    destination_name: "Amboseli"
  },
  {
    name: "Lamu Island Cultural Retreat",
    package_code: "NYL-LAMU-005",
    duration_days: 4,
    duration_nights: 3,
    base_price: 950,
    difficulty_level: "easy",
    short_description: "Step back in time on the tranquil, car-free streets of Lamu Old Town.",
    description: "Lamu is a UNESCO World Heritage site and the oldest Swahili settlement in East Africa. Experience the slow pace of life, historical architecture, and peaceful beaches of Shela village.",
    highlights: ["Old Town Walking Tour", "Traditional Dhow Sailing", "Swahili Cooking Class"],
    included_items: ["Boutique Hotel Stay", "Guided Cultural Tours", "Boat Transfers", "Breakfast"],
    excluded_items: ["International Travel", "Dinners", "Museum Entrance Fees"],
    featured_image: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1200",
    is_featured: false,
    destination_name: "Lamu"
  },
  // ... adding more to reach 50
];

// Helper to generate variations to reach 50
const locations = [
  "Lake Nakuru", "Samburu", "Tsavo East", "Tsavo West", "Hell's Gate", 
  "Lake Naivasha", "Watamu", "Malindi", "Ol Pejeta", "Aberdares",
  "Meru National Park", "Shimba Hills", "Chyulu Hills", "Taita Hills",
  "Kakamega Forest", "Lake Baringo", "Lake Bogoria", "Lake Magadi"
];

const types = ["Safari", "Adventure", "Beach", "Cultural", "Hiking", "Photography"];

for (let i = 6; i <= 50; i++) {
  const loc = locations[i % locations.length];
  const type = types[i % types.length];
  const days = 2 + (i % 7);
  
  tours.push({
    name: `${days}-Day ${loc} ${type} Journey`,
    package_code: `NYL-${loc.substring(0, 4).toUpperCase()}-${100 + i}`,
    duration_days: days,
    duration_nights: days - 1,
    base_price: 500 + (Math.floor(Math.random() * 20) * 100),
    difficulty_level: i % 3 === 0 ? "moderate" : (i % 5 === 0 ? "challenging" : "easy"),
    short_description: `An immersive ${type.toLowerCase()} experience in the beautiful land of ${loc}. Discover the hidden gems of Kenya.`,
    description: `Join us for a unique exploration of ${loc}. This ${type.toLowerCase()} trip is designed to give you an authentic taste of Kenyan hospitality and nature. We've curated the best spots and activities to ensure an unforgettable journey.`,
    highlights: [`${loc} Sightseeing`, `${type} Activities`, "Local Interaction"],
    included_items: ["All Transfers", "Guide Services", "Basic Equipment"],
    excluded_items: ["Personal Spending", "Tips"],
    featured_image: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=1200`,
    is_featured: i % 10 === 0,
    destination_name: loc
  });
}

async function main() {
  console.log('Seeding 50 tours...');
  
  for (const tour of tours) {
    const { destination_name, ...tourData } = tour;
    
    // Find or create destination
    let destination = await prisma.destination.findFirst({
      where: { name: destination_name }
    });
    
    if (!destination) {
      destination = await prisma.destination.upsert({
        where: { slug: destination_name.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: {
          name: destination_name,
          slug: destination_name.toLowerCase().replace(/\s+/g, '-'),
          country: "Kenya",
          region: "East Africa",
          short_description: `Welcome to ${destination_name}, a beautiful part of Kenya.`,
          is_active: true
        }
      });
    }
    
    // Create tour package
    await prisma.tourPackage.upsert({
      where: { package_code: tourData.package_code },
      update: {
        ...tourData,
        destination_id: destination.id,
        slug: tourData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + tourData.package_code.toLowerCase(),
      },
      create: {
        ...tourData,
        destination_id: destination.id,
        slug: tourData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + tourData.package_code.toLowerCase(),
      }
    });
  }
  
  console.log('Successfully seeded 50 tours!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });