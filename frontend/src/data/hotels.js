const HOTEL_IMAGE_LIBRARY = {
  nairobiManor:
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
  nairobiCity:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
  nairobiModern:
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80',
  maraLodge:
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
  maraCamp:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  amboseliView:
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=80',
  amboseliCamp:
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
  tsavoLodge:
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  samburuCamp:
    'https://images.unsplash.com/photo-1492521778974-ad0b3f4f5f2b?auto=format&fit=crop&w=1600&q=80',
  laikipiaRetreat:
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80',
  dianiBeach:
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80',
  mombasaResort:
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80',
  watamuBeach:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  lamuBoutique:
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80',
  naivashaRetreat:
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1600&q=80',
  nakuruLodge:
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
  aberdareLodge:
    'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?auto=format&fit=crop&w=1600&q=80',
};

const HOTEL_GALLERY_LIBRARY = {
  nairobiManor: [
    HOTEL_IMAGE_LIBRARY.nairobiManor,
    HOTEL_IMAGE_LIBRARY.nairobiCity,
    HOTEL_IMAGE_LIBRARY.nairobiModern,
  ],
  nairobiCity: [
    HOTEL_IMAGE_LIBRARY.nairobiCity,
    HOTEL_IMAGE_LIBRARY.nairobiModern,
    HOTEL_IMAGE_LIBRARY.nairobiManor,
  ],
  nairobiModern: [
    HOTEL_IMAGE_LIBRARY.nairobiModern,
    HOTEL_IMAGE_LIBRARY.nairobiCity,
    HOTEL_IMAGE_LIBRARY.nairobiManor,
  ],
  maraLodge: [
    HOTEL_IMAGE_LIBRARY.maraLodge,
    HOTEL_IMAGE_LIBRARY.maraCamp,
    HOTEL_IMAGE_LIBRARY.amboseliView,
  ],
  maraCamp: [
    HOTEL_IMAGE_LIBRARY.maraCamp,
    HOTEL_IMAGE_LIBRARY.maraLodge,
    HOTEL_IMAGE_LIBRARY.samburuCamp,
  ],
  amboseliView: [
    HOTEL_IMAGE_LIBRARY.amboseliView,
    HOTEL_IMAGE_LIBRARY.amboseliCamp,
    HOTEL_IMAGE_LIBRARY.maraLodge,
  ],
  amboseliCamp: [
    HOTEL_IMAGE_LIBRARY.amboseliCamp,
    HOTEL_IMAGE_LIBRARY.amboseliView,
    HOTEL_IMAGE_LIBRARY.tsavoLodge,
  ],
  tsavoLodge: [
    HOTEL_IMAGE_LIBRARY.tsavoLodge,
    HOTEL_IMAGE_LIBRARY.amboseliCamp,
    HOTEL_IMAGE_LIBRARY.maraCamp,
  ],
  samburuCamp: [
    HOTEL_IMAGE_LIBRARY.samburuCamp,
    HOTEL_IMAGE_LIBRARY.laikipiaRetreat,
    HOTEL_IMAGE_LIBRARY.maraCamp,
  ],
  laikipiaRetreat: [
    HOTEL_IMAGE_LIBRARY.laikipiaRetreat,
    HOTEL_IMAGE_LIBRARY.samburuCamp,
    HOTEL_IMAGE_LIBRARY.aberdareLodge,
  ],
  dianiBeach: [
    HOTEL_IMAGE_LIBRARY.dianiBeach,
    HOTEL_IMAGE_LIBRARY.mombasaResort,
    HOTEL_IMAGE_LIBRARY.watamuBeach,
  ],
  mombasaResort: [
    HOTEL_IMAGE_LIBRARY.mombasaResort,
    HOTEL_IMAGE_LIBRARY.dianiBeach,
    HOTEL_IMAGE_LIBRARY.watamuBeach,
  ],
  watamuBeach: [
    HOTEL_IMAGE_LIBRARY.watamuBeach,
    HOTEL_IMAGE_LIBRARY.dianiBeach,
    HOTEL_IMAGE_LIBRARY.lamuBoutique,
  ],
  lamuBoutique: [
    HOTEL_IMAGE_LIBRARY.lamuBoutique,
    HOTEL_IMAGE_LIBRARY.watamuBeach,
    HOTEL_IMAGE_LIBRARY.dianiBeach,
  ],
  naivashaRetreat: [
    HOTEL_IMAGE_LIBRARY.naivashaRetreat,
    HOTEL_IMAGE_LIBRARY.nakuruLodge,
    HOTEL_IMAGE_LIBRARY.laikipiaRetreat,
  ],
  nakuruLodge: [
    HOTEL_IMAGE_LIBRARY.nakuruLodge,
    HOTEL_IMAGE_LIBRARY.naivashaRetreat,
    HOTEL_IMAGE_LIBRARY.aberdareLodge,
  ],
  aberdareLodge: [
    HOTEL_IMAGE_LIBRARY.aberdareLodge,
    HOTEL_IMAGE_LIBRARY.laikipiaRetreat,
    HOTEL_IMAGE_LIBRARY.nakuruLodge,
  ],
};

const HOTEL_ROWS = [
  ['Giraffe Manor', 'Nairobi', 'Nairobi County', 'boutique', 5, 1250, 'Iconic', 'nairobiManor', true, ['Giraffe encounters', 'Garden breakfast', 'Spa', 'Heritage suites'], 'Historic manor stay where resident giraffes wander in for breakfast.'],
  ['Hemingways Nairobi', 'Nairobi', 'Nairobi County', 'luxury', 5, 980, 'Refined', 'nairobiCity', true, ['Suites', 'Butler service', 'Spa', 'Fine dining'], 'All-suite luxury retreat in Karen with polished service and leafy views.'],
  ['Villa Rosa Kempinski', 'Nairobi', 'Nairobi County', 'luxury', 5, 420, 'City Luxe', 'nairobiModern', false, ['Spa', 'Rooftop dining', 'Pool', 'Executive lounge'], 'Grand city hotel known for upscale dining, wellness, and business convenience.'],
  ['Nairobi Serena Hotel', 'Nairobi', 'Nairobi County', 'luxury', 5, 360, 'Classic', 'nairobiCity', false, ['Spa', 'Pool', 'Fine dining', 'WiFi'], 'Established luxury address blending city access with serene gardens and polished rooms.'],
  ['Fairmont The Norfolk', 'Nairobi', 'Nairobi County', 'boutique', 5, 455, 'Heritage', 'nairobiManor', false, ['Courtyard', 'Pool', 'Spa', 'Historic charm'], 'Heritage hotel in central Nairobi with old-world character and landscaped courtyards.'],
  ['Tribe Hotel', 'Nairobi', 'Nairobi County', 'wellness', 5, 330, 'Design', 'nairobiModern', false, ['Spa', 'Wellness', 'Pool', 'Modern dining'], 'Contemporary design-led stay in Gigiri with spa facilities and sleek social spaces.'],
  ['Sankara Nairobi', 'Nairobi', 'Nairobi County', 'luxury', 5, 315, 'Rooftop', 'nairobiModern', false, ['Rooftop pool', 'Cocktail bar', 'Spa', 'WiFi'], 'Westlands favorite with elevated city views, stylish rooms, and rooftop lounging.'],
  ['Radisson Blu Hotel Nairobi Upper Hill', 'Nairobi', 'Nairobi County', 'city', 5, 295, 'Business', 'nairobiModern', false, ['Meeting rooms', 'Spa', 'Pool', 'Airport access'], 'Upper Hill base with streamlined rooms, conference appeal, and strong business access.'],
  ['JW Marriott Hotel Nairobi', 'Nairobi', 'Nairobi County', 'luxury', 5, 510, 'New Arrival', 'nairobiModern', true, ['Skyline views', 'Spa', 'Pool', 'Signature dining'], 'New luxury tower in Westlands with skyline views and modern polished interiors.'],
  ['Sarova Stanley', 'Nairobi', 'Nairobi County', 'boutique', 5, 285, 'Historic', 'nairobiManor', false, ['Heritage suites', 'Pool', 'Fine dining', 'City center'], 'Landmark Nairobi hotel famed for heritage details and classic city hospitality.'],
  ['Tamarind Tree Hotel', 'Nairobi', 'Nairobi County', 'city', 4, 210, 'Convenient', 'nairobiCity', false, ['Pool', 'Restaurants', 'Family rooms', 'WiFi'], 'Comfortable urban stay with easy airport access and a calm business-friendly setup.'],
  ['Ole Sereni Hotel', 'Nairobi', 'Nairobi County', 'wellness', 4, 235, 'Park Views', 'nairobiCity', false, ['Spa', 'Pool', 'Fitness center', 'Savannah views'], 'Nairobi stay overlooking the national park with a spa and quiet leisure focus.'],
  ['Mara Serena Safari Lodge', 'Maasai Mara', 'Narok County', 'safari', 5, 540, 'Signature', 'maraLodge', true, ['Game drives', 'Bush dining', 'Pool', 'Spa'], 'Hillside safari lodge overlooking the Mara with classic game-viewing access.'],
  ['Sarova Mara Game Camp', 'Maasai Mara', 'Narok County', 'safari', 5, 485, 'Popular', 'maraCamp', false, ['Tented suites', 'Bush meals', 'Pool', 'Game drives'], 'Well-known game camp balancing comfort, family appeal, and strong safari logistics.'],
  ['Keekorok Lodge', 'Maasai Mara', 'Narok County', 'safari', 4, 355, 'Pioneer', 'maraLodge', false, ['Boardwalk views', 'Pool', 'Hippo deck', 'Game drives'], 'One of the Mara’s pioneering lodges with wetlands views and a classic safari feel.'],
  ['Angama Mara', 'Maasai Mara', 'Narok County', 'safari', 5, 1950, 'Ultra-Luxury', 'maraLodge', true, ['Private decks', 'Hot-air balloon access', 'Fine dining', 'Butler service'], 'Clifftop luxury camp with sweeping Mara views and highly personalized hosting.'],
  ['Mara Bushtops', 'Maasai Mara', 'Narok County', 'safari', 5, 1420, 'Premier Camp', 'maraCamp', false, ['Private plunge pools', 'Spa', 'Game drives', 'Wine cellar'], 'High-end tented camp with indulgent suites and immersive conservancy experiences.'],
  ['Entim Mara', 'Maasai Mara', 'Narok County', 'safari', 5, 990, 'Migration Front Row', 'maraCamp', false, ['River views', 'Game drives', 'Sundowner deck', 'Tented suites'], 'Intimate camp positioned close to migration crossings and prime predator territory.'],
  ['Governors\' Camp', 'Maasai Mara', 'Narok County', 'safari', 5, 760, 'Classic Camp', 'maraCamp', false, ['Tented rooms', 'River setting', 'Game drives', 'Bush breakfasts'], 'Classic Mara tented camp on the riverbank with old-school safari atmosphere.'],
  ['Ilkeliani Camp', 'Maasai Mara', 'Narok County', 'safari', 5, 840, 'Elegant', 'maraCamp', false, ['Private verandas', 'Bush dining', 'Game drives', 'WiFi'], 'Boutique-style tented camp with polished canvas suites near key wildlife corridors.'],
  ['Basecamp Masai Mara', 'Maasai Mara', 'Narok County', 'safari', 4, 390, 'Eco Camp', 'maraCamp', false, ['Eco design', 'Community visits', 'Game drives', 'Family tents'], 'Conservation-minded camp with strong community links and relaxed safari comfort.'],
  ['Ashnil Mara Camp', 'Maasai Mara', 'Narok County', 'safari', 4, 430, 'River Camp', 'maraCamp', false, ['River views', 'Pool', 'Game drives', 'Tented suites'], 'Well-placed camp near the Mara River with a practical luxury safari setup.'],
  ['Mara Intrepids Camp', 'Maasai Mara', 'Narok County', 'safari', 4, 520, 'Family Favorite', 'maraCamp', false, ['Family tents', 'Pool', 'Adventure activities', 'Game drives'], 'Energetic safari camp known for family travel, guides, and all-day wildlife action.'],
  ['Sand River Masai Mara', 'Maasai Mara', 'Narok County', 'safari', 5, 1180, 'Romantic', 'maraCamp', false, ['Luxury tents', 'Private dining', 'Game drives', 'Sundowners'], 'Elegant riverside camp with a vintage safari mood and polished service.'],
  ['Sala\'s Camp', 'Maasai Mara', 'Narok County', 'safari', 5, 1050, 'Remote', 'maraCamp', false, ['Private tents', 'Guided safaris', 'Bush meals', 'River setting'], 'Smaller camp in a quieter corner of the Mara favored for intimate wildlife stays.'],
  ['andBeyond Bateleur Camp', 'Maasai Mara', 'Narok County', 'safari', 5, 1630, 'Tented Luxury', 'maraCamp', false, ['Butler service', 'Fine dining', 'Game drives', 'Private plunge pool'], 'Luxe tented retreat with richly styled suites and personalized safari hosting.'],
  ['Neptune Mara Rianta Luxury Camp', 'Maasai Mara', 'Narok County', 'safari', 5, 605, 'Riverside', 'maraCamp', false, ['Luxury tents', 'Spa', 'Game drives', 'Pool'], 'All-suite riverside camp offering a comfortable base for Mara safaris year-round.'],
  ['Ol Donyo Lodge', 'Amboseli', 'Kajiado County', 'safari', 5, 1850, 'Private Conservancy', 'amboseliView', true, ['Private pools', 'Bush dining', 'Horse riding', 'Game drives'], 'High-end lodge with Kilimanjaro views and private conservancy experiences.'],
  ['Amboseli Serena Safari Lodge', 'Amboseli', 'Kajiado County', 'safari', 4, 345, 'Kili Views', 'amboseliView', false, ['Game drives', 'Pool', 'Cultural evenings', 'WiFi'], 'Colorful safari lodge offering classic Amboseli access and mountain-view moments.'],
  ['Tawi Lodge', 'Amboseli', 'Kajiado County', 'safari', 5, 720, 'Boutique Bush', 'amboseliView', false, ['Cottages', 'Spa', 'Game drives', 'Sundowners'], 'Boutique lodge near Amboseli with Kilimanjaro backdrops and tranquil cottages.'],
  ['Tortilis Camp Amboseli', 'Amboseli', 'Kajiado County', 'safari', 5, 950, 'Elegant Camp', 'amboseliCamp', false, ['Tented suites', 'Game drives', 'Bush dining', 'Family tents'], 'Conservation-minded camp with refined tents and expansive views across the plains.'],
  ['Kibo Safari Camp', 'Amboseli', 'Kajiado County', 'safari', 4, 280, 'Value Safari', 'amboseliCamp', false, ['Tents', 'Pool', 'Game drives', 'Family rooms'], 'Popular tented option for travelers seeking comfort close to Amboseli gates.'],
  ['Ol Tukai Lodge', 'Amboseli', 'Kajiado County', 'safari', 4, 415, 'Elephant Views', 'amboseliView', false, ['Mountain views', 'Game drives', 'Pool', 'Gardens'], 'Long-running lodge famous for elephant sightings against Kilimanjaro panoramas.'],
  ['Satao Elerai Camp', 'Amboseli', 'Kajiado County', 'safari', 5, 590, 'Conservancy Stay', 'amboseliCamp', false, ['Tented suites', 'Sundowner deck', 'Game drives', 'Spa'], 'Stylish conservancy camp pairing privacy, wildlife, and mountain-facing decks.'],
  ['Amboseli Sopa Lodge', 'Amboseli', 'Kajiado County', 'safari', 4, 310, 'Reliable', 'amboseliView', false, ['Pool', 'Family rooms', 'Game drives', 'Gardens'], 'Spacious safari lodge with broad grounds and dependable access to Amboseli drives.'],
  ['Kilaguni Serena Safari Lodge', 'Tsavo West', 'Taita-Taveta County', 'safari', 4, 330, 'Waterhole Views', 'tsavoLodge', true, ['Waterhole terrace', 'Game drives', 'Pool', 'Bush walks'], 'Tsavo West lodge overlooking a busy waterhole with volcanic landscapes all around.'],
  ['Salt Lick Safari Lodge', 'Taita Hills', 'Taita-Taveta County', 'safari', 4, 355, 'Stilted Lodge', 'tsavoLodge', false, ['Waterhole decks', 'Game drives', 'Raised rooms', 'Sundowners'], 'Iconic stilted lodge built above a waterhole for around-the-clock wildlife watching.'],
  ['Finch Hattons Luxury Tented Camp', 'Tsavo West', 'Taita-Taveta County', 'safari', 5, 1380, 'Luxury Camp', 'tsavoLodge', false, ['Spa', 'Suites', 'Game drives', 'Fine dining'], 'Luxe tented hideaway in Tsavo West with spa, polished suites, and serene pools.'],
  ['Severin Safari Camp', 'Tsavo West', 'Taita-Taveta County', 'safari', 5, 515, 'Eco Luxury', 'tsavoLodge', false, ['Tents', 'Spa', 'Game drives', 'Bush meals'], 'Eco-focused camp with well-appointed tents and easy access to Tsavo wildlife areas.'],
  ['Ashnil Aruba Lodge', 'Tsavo East', 'Taita-Taveta County', 'safari', 4, 295, 'Lakeside', 'tsavoLodge', false, ['Water views', 'Pool', 'Game drives', 'Family rooms'], 'Tsavo East lodge set by Aruba Dam with reliable safari departures and open views.'],
  ['Voyager Ziwani Camp', 'Tsavo West', 'Taita-Taveta County', 'safari', 4, 365, 'Quiet Escape', 'tsavoLodge', false, ['Boat trips', 'Game drives', 'Sundowners', 'Tented rooms'], 'Quiet camp near the Tanzanian border suited to slower, scenic safari stays.'],
  ['Voi Wildlife Lodge', 'Tsavo East', 'Taita-Taveta County', 'safari', 4, 210, 'Panoramic', 'tsavoLodge', false, ['Waterhole views', 'Pool', 'Game drives', 'Observation deck'], 'Hilltop lodge with broad park views and easy access to Tsavo East game drives.'],
  ['Satao Camp', 'Tsavo East', 'Taita-Taveta County', 'safari', 4, 440, 'Classic Canvas', 'tsavoLodge', false, ['Luxury tents', 'Game drives', 'Bush dining', 'Sundowners'], 'Atmospheric canvas camp close to wildlife routes and Tsavo’s red-earth scenery.'],
  ['Sarova Taita Hills Game Lodge', 'Taita Hills', 'Taita-Taveta County', 'safari', 4, 275, 'Conservancy Base', 'tsavoLodge', false, ['Game drives', 'Pool', 'Conference rooms', 'Gardens'], 'Comfortable safari lodge tied to the Taita conservancy and Salt Lick experiences.'],
  ['Maneaters Safari Camp', 'Tsavo East', 'Taita-Taveta County', 'safari', 4, 325, 'Historic Legend', 'tsavoLodge', false, ['Tented rooms', 'Riverfront setting', 'Game drives', 'Pool'], 'Riverside camp inspired by Tsavo history with a laid-back safari character.'],
  ['Samburu Intrepids', 'Samburu', 'Samburu County', 'safari', 4, 455, 'Riverside', 'samburuCamp', false, ['Tents', 'Game drives', 'Cultural visits', 'Pool'], 'Riverbank tented camp popular for family safaris and Samburu special-five sightings.'],
  ['Saruni Samburu', 'Samburu', 'Samburu County', 'safari', 5, 1220, 'Hilltop Luxury', 'samburuCamp', false, ['Villas', 'Spa', 'Guided safaris', 'Panoramic decks'], 'High-end lodge with standout views and a strong private-conservancy safari feel.'],
  ['Elephant Bedroom Camp', 'Samburu', 'Samburu County', 'safari', 5, 760, 'Wild Riverside', 'samburuCamp', false, ['Tented suites', 'River setting', 'Game drives', 'Pool'], 'Stylish tented camp on the river known for elephant visits and intimate hosting.'],
  ['Sarova Shaba Game Lodge', 'Shaba', 'Isiolo County', 'safari', 4, 305, 'Oasis', 'samburuCamp', false, ['Pool', 'Game drives', 'Spa', 'River views'], 'Palm-fringed lodge in an oasis setting within Kenya’s arid north.'],
  ['Samburu Sopa Lodge', 'Samburu', 'Samburu County', 'safari', 4, 285, 'Savannah Lodge', 'samburuCamp', false, ['Pool', 'Family rooms', 'Game drives', 'Gardens'], 'Spacious hillside lodge with broad views and dependable Samburu access.'],
  ['Ashnil Samburu Camp', 'Samburu', 'Samburu County', 'safari', 4, 420, 'Tent Comfort', 'samburuCamp', false, ['Luxury tents', 'Game drives', 'Pool', 'River views'], 'Comfortable tented camp set for easy game drives along the Ewaso Nyiro.'],
  ['Larsens Camp', 'Samburu', 'Samburu County', 'safari', 5, 530, 'River Camp', 'samburuCamp', false, ['Tents', 'Pool', 'Game drives', 'Bush meals'], 'Classic riverside camp with canvas luxury and front-row Samburu wildlife access.'],
  ['Sasaab', 'Samburu', 'Samburu County', 'safari', 5, 1360, 'Moroccan Style', 'samburuCamp', false, ['Private plunge pools', 'Spa', 'Camel rides', 'Fine dining'], 'Distinctive luxury lodge combining dramatic design with remote northern safaris.'],
  ['Sarara Camp', 'Mathews Range', 'Samburu County', 'safari', 5, 1080, 'Community Conservancy', 'samburuCamp', false, ['Natural rock pool', 'Guided walks', 'Cultural visits', 'Tented suites'], 'Remote camp celebrated for community-led conservation and landscape drama.'],
  ['Fairmont Mount Kenya Safari Club', 'Nanyuki', 'Laikipia County', 'luxury', 5, 720, 'Club Classic', 'laikipiaRetreat', true, ['Golf', 'Spa', 'Horse riding', 'Mountain views'], 'Legendary Mount Kenya retreat with gardens, golf, and polished country-club charm.'],
  ['Sweetwaters Serena Camp', 'Ol Pejeta', 'Laikipia County', 'safari', 4, 430, 'Conservancy Stay', 'laikipiaRetreat', false, ['Game drives', 'Chimpanzee sanctuary access', 'Tents', 'Pool'], 'Popular Ol Pejeta base with tented rooms and strong conservancy experiences.'],
  ['Solio Lodge', 'Solio Ranch', 'Laikipia County', 'luxury', 5, 1680, 'Rhino Luxury', 'laikipiaRetreat', false, ['Private game drives', 'Fireplaces', 'Fine dining', 'Mountain views'], 'Exclusive lodge prized for rhino sightings and deeply private safari hosting.'],
  ['Segera Retreat', 'Laikipia', 'Laikipia County', 'wellness', 5, 2100, 'Retreat', 'laikipiaRetreat', false, ['Wellness', 'Art collection', 'Private villas', 'Conservancy drives'], 'Ultra-private retreat blending art, wellness, and conservation in Laikipia.'],
  ['Loisaba Tented Camp', 'Laikipia', 'Laikipia County', 'safari', 5, 1180, 'Star Beds', 'laikipiaRetreat', false, ['Game drives', 'Star beds', 'Bush dining', 'Horse riding'], 'High-end conservancy camp known for panoramic escarpment views and star beds.'],
  ['Elewana Lewa Safari Camp', 'Lewa', 'Meru County', 'safari', 5, 910, 'Conservancy Classic', 'laikipiaRetreat', false, ['Game drives', 'Wellness', 'Bush meals', 'Tented suites'], 'Elegant camp on Lewa with strong wildlife sightings and polished safari service.'],
  ['Sanctuary Tambarare', 'Ol Pejeta', 'Laikipia County', 'safari', 5, 690, 'Stylish Canvas', 'laikipiaRetreat', false, ['Luxury tents', 'Game drives', 'Private decks', 'Fine dining'], 'Modern luxury tented camp inside Ol Pejeta with a lighter, contemporary feel.'],
  ['Almanara Luxury Villas', 'Diani Beach', 'Kwale County', 'luxury', 5, 980, 'Beachfront', 'dianiBeach', true, ['Private villas', 'Beach access', 'Spa', 'Butler service'], 'Private-villa hideaway on Diani’s sands with polished personalized beach service.'],
  ['The Sands at Nomad', 'Diani Beach', 'Kwale County', 'beach', 5, 445, 'Oceanfront', 'dianiBeach', true, ['Beach access', 'Pool', 'Water sports', 'Spa'], 'Well-loved beachfront resort with a relaxed upscale mood and direct ocean access.'],
  ['Swahili Beach Resort', 'Diani Beach', 'Kwale County', 'beach', 5, 285, 'Arabesque', 'mombasaResort', false, ['Infinity pools', 'Spa', 'Beach access', 'Restaurants'], 'Statement resort known for its architecture, pools, and broad beachfront setting.'],
  ['Leopard Beach Resort & Spa', 'Diani Beach', 'Kwale County', 'beach', 5, 255, 'Award Winning', 'dianiBeach', false, ['Beach access', 'Spa', 'Pool', 'Villas'], 'Established South Coast resort with wide leisure facilities and spa appeal.'],
  ['Baobab Beach Resort & Spa', 'Diani Beach', 'Kwale County', 'beach', 4, 235, 'All-Inclusive', 'dianiBeach', false, ['Beach access', 'Pools', 'All-inclusive dining', 'Spa'], 'Large all-inclusive resort with extensive grounds and family-friendly beach access.'],
  ['Southern Palms Beach Resort', 'Diani Beach', 'Kwale County', 'beach', 4, 205, 'Palm Lined', 'dianiBeach', false, ['Beach access', 'Pool', 'Family rooms', 'Water sports'], 'Classic Diani resort with palm-lined pools and easy oceanfront relaxation.'],
  ['Diani Reef Beach Resort & Spa', 'Diani Beach', 'Kwale County', 'beach', 5, 215, 'Resort Escape', 'mombasaResort', false, ['Beach access', 'Spa', 'Pool', 'Conference rooms'], 'Large resort option with broad facilities for leisure stays and group travel.'],
  ['Waterlovers Beach Resort', 'Diani Beach', 'Kwale County', 'boutique', 4, 395, 'Boutique Beach', 'dianiBeach', false, ['Beach access', 'Pool', 'Boutique rooms', 'Dining'], 'Small-scale beachfront boutique stay known for intimacy and warm service.'],
  ['Diamonds Leisure Beach & Golf Resort', 'Diani Beach', 'Kwale County', 'beach', 4, 180, 'Golf & Beach', 'dianiBeach', false, ['Beach access', 'Golf', 'Pool', 'Family rooms'], 'Comfortable South Coast resort pairing beach time with easy golf access.'],
  ['Pinewood Beach Resort & Spa', 'Diani Beach', 'Kwale County', 'boutique', 4, 245, 'Quiet Retreat', 'dianiBeach', false, ['Beach access', 'Spa', 'Pool', 'Water sports'], 'Smaller South Coast stay suited to quieter beach breaks and couples.'],
  ['Serena Beach Resort & Spa', 'Shanzu', 'Mombasa County', 'beach', 5, 285, 'Swahili Charm', 'mombasaResort', false, ['Beach access', 'Spa', 'Pool', 'Family activities'], 'North Coast resort blending Swahili design cues with a polished beach holiday setup.'],
  ['Sarova Whitesands Beach Resort', 'Mombasa', 'Mombasa County', 'beach', 4, 215, 'Family Resort', 'mombasaResort', false, ['Beach access', 'Pools', 'Restaurants', 'Conference rooms'], 'Large beachfront property with varied dining, events space, and broad leisure appeal.'],
  ['PrideInn Paradise Beach Resort & Spa', 'Mombasa', 'Mombasa County', 'beach', 4, 190, 'Waterpark', 'mombasaResort', false, ['Beach access', 'Waterpark', 'Pool', 'Family rooms'], 'Lively coastal resort popular with families, groups, and all-day pool time.'],
  ['Voyager Beach Resort', 'Nyali', 'Mombasa County', 'beach', 4, 185, 'Themed Resort', 'mombasaResort', false, ['Beach access', 'Pool', 'All-inclusive dining', 'Family entertainment'], 'Energetic Nyali resort with themed zones and a classic Kenyan coast holiday feel.'],
  ['Hemingways Watamu', 'Watamu', 'Kilifi County', 'luxury', 5, 560, 'Ocean Suites', 'watamuBeach', true, ['Ocean views', 'Spa', 'Fishing charters', 'Suites'], 'Refined oceanfront stay in Watamu with polished suites and marine escape energy.'],
  ['Medina Palms', 'Watamu', 'Kilifi County', 'luxury', 5, 510, 'Villa Resort', 'watamuBeach', false, ['Beach access', 'Spa', 'Pool', 'Family villas'], 'Boutique villa resort in Watamu with a stylish beachfront atmosphere.'],
  ['Ocean Sports Resort', 'Watamu', 'Kilifi County', 'beach', 4, 235, 'Watersports', 'watamuBeach', false, ['Beach access', 'Kitesurfing', 'Pool', 'Ocean dining'], 'Relaxed oceanfront resort with strong watersports appeal and airy coastal rooms.'],
  ['Temple Point Resort', 'Watamu', 'Kilifi County', 'beach', 4, 205, 'Creekside', 'watamuBeach', false, ['Creek access', 'Pool', 'Water sports', 'Dive center'], 'Creek-and-ocean setting with laid-back rooms and boating or diving options.'],
  ['Kobe Suite Resort', 'Watamu', 'Kilifi County', 'beach', 4, 255, 'Suite Resort', 'watamuBeach', false, ['Beach access', 'Pool', 'Suites', 'Family rooms'], 'Smaller suite-led Watamu stay balancing beach convenience with privacy.'],
  ['Turtle Bay Beach Club', 'Watamu', 'Kilifi County', 'beach', 4, 215, 'All Inclusive', 'watamuBeach', false, ['Beach access', 'All-inclusive dining', 'Pool', 'Family activities'], 'Established Watamu beach club with easy-going all-inclusive coast energy.'],
  ['Diamonds Dream of Africa', 'Malindi', 'Kilifi County', 'beach', 5, 260, 'Adults Escape', 'watamuBeach', false, ['Beach access', 'Spa', 'Pool', 'Boutique rooms'], 'Intimate Malindi-area beachfront resort geared toward slower upscale stays.'],
  ['Peponi Hotel Lamu', 'Lamu', 'Lamu County', 'boutique', 4, 325, 'Lamu Classic', 'lamuBoutique', false, ['Seafront dining', 'Boutique rooms', 'Dhow trips', 'Pool'], 'Beloved Lamu stay with a classic island atmosphere and dhow-filled seafront views.'],
  ['Enashipai Resort & Spa', 'Naivasha', 'Nakuru County', 'wellness', 5, 310, 'Spa Escape', 'naivashaRetreat', true, ['Spa', 'Pool', 'Wellness', 'Conference rooms'], 'Naivasha resort known for wellness weekends, polished rooms, and generous grounds.'],
  ['Lake Naivasha Sopa Resort', 'Naivasha', 'Nakuru County', 'wellness', 4, 275, 'Lakeside', 'naivashaRetreat', false, ['Lake views', 'Pool', 'Family rooms', 'Gardens'], 'Expansive lakeside resort with acacia-filled lawns and resident wildlife.'],
  ['Great Rift Valley Lodge & Golf Resort', 'Naivasha', 'Nakuru County', 'luxury', 4, 260, 'Golf Retreat', 'naivashaRetreat', false, ['Golf', 'Valley views', 'Pool', 'Family villas'], 'Hilltop Naivasha stay combining golf, valley panoramas, and roomy accommodation.'],
  ['Chui Lodge', 'Naivasha', 'Nakuru County', 'boutique', 5, 760, 'Private Sanctuary', 'naivashaRetreat', false, ['Private sanctuary drives', 'Pool', 'Fine dining', 'Boutique suites'], 'Exclusive lodge inside a private sanctuary for slower, more intimate wildlife stays.'],
  ['Lake Elmenteita Serena Camp', 'Elmenteita', 'Nakuru County', 'safari', 5, 470, 'Lake Camp', 'nakuruLodge', true, ['Lake views', 'Spa', 'Game drives', 'Luxury tents'], 'Elegant camp above Lake Elmenteita with polished tents and Rift Valley views.'],
  ['Sarova Lion Hill Game Lodge', 'Lake Nakuru', 'Nakuru County', 'safari', 4, 315, 'Park Base', 'nakuruLodge', false, ['Game drives', 'Pool', 'Valley views', 'Family rooms'], 'Reliable Lake Nakuru base with hillside views and practical safari comfort.'],
  ['Lake Nakuru Sopa Lodge', 'Lake Nakuru', 'Nakuru County', 'safari', 4, 295, 'Escarpment Views', 'nakuruLodge', false, ['Game drives', 'Pool', 'Family rooms', 'View decks'], 'Classic park lodge perched on the escarpment above Lake Nakuru.'],
  ['The Ark Lodge', 'Aberdare National Park', 'Nyeri County', 'safari', 4, 290, 'Waterhole Hide', 'aberdareLodge', false, ['Waterhole viewing', 'Observation decks', 'Game viewing', 'Forest setting'], 'Distinctive Aberdare hide built for nighttime wildlife viewing at the waterhole.'],
  ['Serena Mountain Lodge', 'Mount Kenya', 'Nyeri County', 'safari', 4, 320, 'Forest Lodge', 'aberdareLodge', false, ['Forest walks', 'Waterhole deck', 'Game viewing', 'WiFi'], 'Timber mountain lodge set in forest with a legendary waterhole observation deck.'],
  ['Aberdare Country Club', 'Mweiga', 'Nyeri County', 'boutique', 4, 255, 'Country Escape', 'aberdareLodge', false, ['Golf', 'Gardens', 'Horse riding', 'Family rooms'], 'Country-style base for Aberdare adventures with lawns, golf, and old-school charm.'],
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildHotel([name, destination, region, type, starRating, price, badge, imageKey, featuredOnHome, amenities, description], index) {
  return {
    id: `hotel-${index + 1}`,
    name,
    slug: slugify(name),
    destination,
    region,
    country: 'Kenya',
    type,
    starRating,
    rating: starRating,
    price,
    priceCurrency: 'USD',
    badge,
    featured: featuredOnHome,
    featuredOnHome,
    shortDescription: description,
    description,
    amenities,
    defaultImage: HOTEL_IMAGE_LIBRARY[imageKey],
    image: '',
    gallery: HOTEL_GALLERY_LIBRARY[imageKey] || [HOTEL_IMAGE_LIBRARY[imageKey]],
  };
}

export const hotels = HOTEL_ROWS.map(buildHotel);

export const featuredHotels = hotels.filter((hotel) => hotel.featuredOnHome);

export const hotelDestinations = [...new Set(hotels.map((hotel) => hotel.destination))].sort();

export default hotels;
