import { query } from '../config/db.js';
import cloudinary from '../services/cloudinaryService.js';
import streamifier from 'streamifier';

export const getSettings = async (req, res, next) => {
  try {
    const { key } = req.params;
    let result;
    if (key) {
      result = await query('SELECT value FROM app_settings WHERE key = $1', [key]);
      return res.status(200).json({ status: 'success', data: result.rows[0]?.value || null });
    } else {
      result = await query('SELECT * FROM app_settings');
      const settings = {};
      result.rows.forEach(row => { settings[row.key] = row.value; });
      return res.status(200).json({ status: 'success', data: settings });
    }
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const keys = Object.keys(req.body);
    for (const key of keys) {
      await query(`
        INSERT INTO app_settings (key, value) 
        VALUES ($1, $2) 
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      `, [key, JSON.stringify(req.body[key])]);
    }
    
    res.status(200).json({ status: 'success', message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Explicit Section Handlers (for better structure and future validation)
export const getSectionSettings = async (req, res, next) => {
  const { section } = req.params;
  let key = `${section}_sections`;
  
  if (section === 'safaris') key = 'featured_safaris';
  if (section === 'video') key = 'showcase_video_section';
  if (section === 'blog') key = 'blog_posts_sections';
  if (section === 'offers') key = 'exclusive_offers_sections';
  if (section === 'stays') key = 'luxury_stays_sections';
  if (section === 'destinations') key = 'destinations_sections';
  
  req.params.key = key;
  return getSettings(req, res, next);
};

export const updateSectionSettings = async (req, res, next) => {
  const { section } = req.params;
  const key = section.endsWith('s') ? `${section}_sections` : `${section}_sections`;
  // Special naming for existing keys
  let targetKey = key;
  if (section === 'safaris') targetKey = 'featured_safaris';
  if (section === 'video') targetKey = 'showcase_video_section';
  
  req.body = { [targetKey]: req.body };
  return updateSettings(req, res, next);
};

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const isVideo = req.file.mimetype.startsWith('video');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'nyle_travels/settings',
        resource_type: isVideo ? 'video' : 'image',
      },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ status: 'error', message: 'Failed to upload media' });
        }
        res.status(200).json({ status: 'success', data: { url: result.secure_url } });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    next(error);
  }
};
export const seedDefaults = async (req, res, next) => {
  try {
    const defaultSettings = {
      hero_sections: [
        { id: 1, image: 'https://picsum.photos/seed/bj6tly/800/600', title: 'Luxury Safari Experience', subtitle: 'Witness the Great Migration', description: 'Experience the untamed beauty of Africa in unparalleled luxury' },
        { id: 2, image: 'https://picsum.photos/seed/7dt4ou/800/600', title: 'Pristine Beach Retreats', subtitle: 'Indian Ocean Paradise', description: 'Relax on white sandy beaches with world-class amenities' },
        { id: 3, image: 'https://picsum.photos/seed/f92ta9/800/600', title: 'Mountain Majesty', subtitle: 'Climb Kilimanjaro', description: 'Conquer Africa\'s highest peak in style' },
        { id: 4, image: 'https://picsum.photos/seed/7gup6o/800/600', title: 'Cultural Immersion', subtitle: 'Meet Local Tribes', description: 'Discover the rich heritage and traditions of East Africa' },
        { id: 5, image: 'https://picsum.photos/seed/60xk0t/800/600', title: 'Majestic Waterfalls', subtitle: 'Victoria Falls & Beyond', description: 'Witness the breathtaking power of nature firsthand' }
      ],
      featured_safaris: [
        { id: 1, name: 'The Great Migration Safari', slug: 'great-migration-safari', destination: 'Maasai Mara', image: 'https://picsum.photos/seed/tour1/800/600', duration: '7 Days', maxGroupSize: 8, price: 4500, rating: 4.9, reviewCount: 124, badge: 'Best Seller', highlights: ['Witness the wildebeest migration', 'Luxury tented camps', 'Hot air balloon safari', 'Maasai cultural visit'] },
        { id: 2, name: 'Coastal Luxury Retreat', slug: 'coastal-luxury-retreat', destination: 'Diani Beach', image: 'https://picsum.photos/seed/tour2/800/600', duration: '5 Days', maxGroupSize: 2, price: 3200, rating: 4.8, reviewCount: 89, badge: 'Honeymoon Special', highlights: ['Private beach villa', 'Spa treatments', 'Sunset dhow cruise', 'Gourmet dining'] },
        { id: 3, name: 'Kilimanjaro Climb - Luxury Route', slug: 'kilimanjaro-luxury-climb', destination: 'Kilimanjaro', image: 'https://picsum.photos/seed/tour3/800/600', duration: '8 Days', maxGroupSize: 6, price: 5800, rating: 4.9, reviewCount: 56, badge: 'Adventure', highlights: ['Private guides', 'Premium camping equipment', 'Gourmet meals', 'Summit celebration'] },
        { id: 4, name: 'Amboseli Elephant Experience', slug: 'amboseli-elephant-experience', destination: 'Amboseli', image: 'https://picsum.photos/seed/tour4/800/600', duration: '4 Days', maxGroupSize: 10, price: 2800, rating: 4.7, reviewCount: 92, badge: 'Family Friendly', highlights: ['Elephant research center visit', 'Mount Kilimanjaro views', 'Photography safari', 'Conservation talk'] },
        { id: 5, name: 'Samburu Cultural Safari', slug: 'samburu-cultural-safari', destination: 'Samburu', image: 'https://picsum.photos/seed/tour5/800/600', duration: '6 Days', maxGroupSize: 8, price: 3900, rating: 4.8, reviewCount: 67, badge: 'Cultural', highlights: ['Samburu village visit', 'Rare wildlife species', 'Night game drives', 'Cultural performances'] }
      ],
      destinations_sections: [
        { id: 1, name: 'Maasai Mara', country: 'Kenya', slug: 'maasai-mara', image: 'https://picsum.photos/seed/dest1/800/600', description: 'Witness the Great Migration and the Big Five in Africa\'s most famous reserve.', tours: 24, hotels: 18, rating: 4.9 },
        { id: 2, name: 'Diani Beach', country: 'Kenya', slug: 'diani-beach', image: 'https://picsum.photos/seed/dest2/800/600', description: 'Pristine white sands and crystal-clear waters of the Indian Ocean.', tours: 15, hotels: 32, rating: 4.8 },
        { id: 3, name: 'Amboseli', country: 'Kenya', slug: 'amboseli', image: 'https://picsum.photos/seed/dest3/800/600', description: 'Iconic views of Mount Kilimanjaro and large elephant herds.', tours: 18, hotels: 12, rating: 4.7 },
        { id: 4, name: 'Tsavo', country: 'Kenya', slug: 'tsavo', image: 'https://picsum.photos/seed/dest4/800/600', description: 'Kenya\'s largest national park with diverse landscapes and wildlife.', tours: 20, hotels: 15, rating: 4.6 },
        { id: 5, name: 'Lake Nakuru', country: 'Kenya', slug: 'lake-nakuru', image: 'https://picsum.photos/seed/dest5/800/600', description: 'Famous for flamingos and rhino sanctuary.', tours: 12, hotels: 8, rating: 4.5 },
        { id: 6, name: 'Samburu', country: 'Kenya', slug: 'samburu', image: 'https://picsum.photos/seed/dest6/800/600', description: 'Unique wildlife species and rich Samburu culture.', tours: 14, hotels: 10, rating: 4.7 }
      ],
      luxury_stays_sections: [
        { id: 1, name: 'Mara Serena Safari Lodge', slug: 'mara-serena', destination: 'Maasai Mara', image: 'https://picsum.photos/seed/hotel1/800/600', rating: 5, price: 850, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], description: 'Luxury lodge perched on a hillside with panoramic views of the Mara.', badge: 'Ultra-Luxury' },
        { id: 2, name: 'Almanara Luxury Resort', slug: 'almanara', destination: 'Diani Beach', image: 'https://picsum.photos/seed/hotel2/800/600', rating: 5, price: 650, amenities: ['Private Beach', 'Spa', 'Fine Dining', 'Infinity Pool'], description: 'Italian-designed luxury resort on the white sands of Diani.', badge: 'Beachfront' },
        { id: 3, name: 'Ol Donyo Wuas Lodge', slug: 'ol-donyo-wuas', destination: 'Amboseli', image: 'https://picsum.photos/seed/hotel3/800/600', rating: 5, price: 1200, amenities: ['Private Pools', 'Stargazing', 'Safari', 'Gourmet Meals'], description: 'Exclusive lodge with stunning views of Kilimanjaro.', badge: 'Exclusive' },
        { id: 4, name: 'Giraffe Manor', slug: 'giraffe-manor', destination: 'Nairobi', image: 'https://picsum.photos/seed/hotel4/800/600', rating: 5, price: 950, amenities: ['Giraffe Feeding', 'Garden', 'Fine Dining', 'Heritage'], description: 'Iconic manor where giraffes visit during breakfast.', badge: 'Iconic' }
      ],
      exclusive_offers_sections: [
        { id: 1, title: 'Early Bird Safari', description: 'Book 6 months in advance and save big on luxury safaris', discount: 20, code: 'EARLYBIRD20', validUntil: '2024-06-30', image: 'https://picsum.photos/seed/dnanf/800/600', type: 'Early Bird' },
        { id: 2, title: 'Honeymoon Paradise', description: 'Special romance package with spa treatments and champagne', discount: 15, code: 'HONEYMOON15', validUntil: '2024-12-31', image: 'https://picsum.photos/seed/qii2pf/800/600', type: 'Romance' },
        { id: 3, title: 'Family Adventure', description: 'Kids stay and eat free on selected family tours', discount: 25, code: 'FAMILY25', validUntil: '2024-08-31', image: 'https://picsum.photos/seed/o4lgl9/800/600', type: 'Family' }
      ],
      blog_posts_sections: [
        { id: 1, title: 'Ultimate Guide to the Great Migration', excerpt: 'Everything you need to know about witnessing one of nature\'s greatest spectacles.', image: 'https://picsum.photos/seed/xbuiz9/800/600', author: 'Sarah Mitchell', date: 'March 15, 2024', category: 'Safari Guide', readTime: '8 min read', slug: 'great-migration-guide' },
        { id: 2, title: 'Top 10 Luxury Beach Resorts in Diani', excerpt: 'Discover the most exclusive beachfront properties along Kenya\'s coast.', image: 'https://picsum.photos/seed/qsmzqu/800/600', author: 'James Wilson', date: 'March 10, 2024', category: 'Hotels', readTime: '6 min read', slug: 'luxury-diani-resorts' },
        { id: 3, title: 'Photography Tips for Safari', excerpt: 'Expert advice on capturing stunning wildlife photos during your safari.', image: 'https://picsum.photos/seed/3vr8iq/800/600', author: 'Emma Thompson', date: 'March 5, 2024', category: 'Photography', readTime: '5 min read', slug: 'safari-photography-tips' },
        { id: 4, title: 'Sustainable Luxury Travel in Africa', excerpt: 'How we\'re preserving nature while providing unforgettable experiences.', image: 'https://picsum.photos/seed/ack89b/800/600', author: 'David Chen', date: 'February 28, 2024', category: 'Sustainability', readTime: '7 min read', slug: 'sustainable-luxury-travel' }
      ],
      showcase_video_section: {
        title: 'Discover Your African Dream',
        description: 'Watch our story and see why discerning travelers choose Nyle for unforgettable African adventures.',
        url: '/videos/showcase.mp4',
        thumbnail: 'https://picsum.photos/seed/33oywj/800/600'
      }
    };

    const keys = Object.keys(defaultSettings);
    for (const key of keys) {
      await query(`
        INSERT INTO app_settings (key, value) 
        VALUES ($1, $2) 
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      `, [key, JSON.stringify(defaultSettings[key])]);
    }

    res.status(200).json({ status: 'success', message: 'Defaults restored successfully' });
  } catch (error) {
    next(error);
  }
};
