export const HOTELS_SETTINGS_KEY = 'hotels_catalog';
export const HOTEL_FALLBACK_IMAGE = '/images/hotel-placeholder.svg';

const BLOCKED_IMAGE_HOSTS = ['images.unsplash.com', 'source.unsplash.com', 'picsum.photos'];

export function slugifyHotelValue(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseHotelList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isBlockedHotelImage(url) {
  if (typeof url !== 'string') {
    return false;
  }

  const value = url.trim();

  if (!value) {
    return false;
  }

  return BLOCKED_IMAGE_HOSTS.some((host) => value.includes(host));
}

export function sanitizeHotelImage(url) {
  if (typeof url !== 'string') {
    return '';
  }

  const value = url.trim();

  if (!value || isBlockedHotelImage(value)) {
    return '';
  }

  return value;
}

export function pickHotelImage(...values) {
  for (const value of values.flat()) {
    const sanitized = sanitizeHotelImage(value);

    if (sanitized) {
      return sanitized;
    }
  }

  return '';
}

function uniqueHotelImages(values = []) {
  const seen = new Set();
  const images = [];

  values.flat().forEach((value) => {
    const sanitized = sanitizeHotelImage(value);

    if (!sanitized || seen.has(sanitized)) {
      return;
    }

    seen.add(sanitized);
    images.push(sanitized);
  });

  return images;
}

export function normalizeHotel(hotel, index = 0) {
  const amenities = parseHotelList(hotel.amenities);
  const explicitGallery = parseHotelList(hotel.gallery);
  const fallbackGallery = parseHotelList(hotel.gallery_images);
  const image = pickHotelImage(hotel.image, hotel.featured_image, hotel.defaultImage, hotel.default_image);
  const defaultImage = pickHotelImage(hotel.defaultImage, hotel.default_image, hotel.image, hotel.featured_image);
  const starRating = Number(hotel.starRating ?? hotel.star_rating ?? hotel.rating ?? hotel.average_rating ?? 0);
  const price = Number(hotel.price ?? hotel.price_per_night ?? 0);
  const rawSlug = hotel.slug || slugifyHotelValue(hotel.name || `hotel-${index + 1}`);
  const gallery = uniqueHotelImages(explicitGallery, fallbackGallery, image, defaultImage);

  return {
    ...hotel,
    id: hotel.id ?? `hotel-${index + 1}`,
    name: hotel.name ?? '',
    slug: slugifyHotelValue(rawSlug),
    destination: hotel.destination ?? hotel.destination_name ?? '',
    region: hotel.region ?? hotel.address ?? '',
    country: hotel.country ?? hotel.destination_country ?? 'Kenya',
    type: hotel.type ?? hotel.hotel_type ?? 'luxury',
    starRating,
    rating: Number(hotel.rating ?? hotel.average_rating ?? starRating),
    price,
    priceCurrency: hotel.priceCurrency ?? hotel.price_currency ?? 'USD',
    badge: hotel.badge ?? hotel.tag ?? '',
    featured: Boolean(hotel.featured),
    featuredOnHome: Boolean(hotel.featuredOnHome ?? hotel.featured),
    shortDescription:
      hotel.shortDescription ??
      hotel.short_description ??
      hotel.description ??
      '',
    description:
      hotel.description ??
      hotel.shortDescription ??
      hotel.short_description ??
      '',
    amenities,
    defaultImage,
    image,
    gallery,
  };
}

export function normalizeHotels(catalog = []) {
  return (Array.isArray(catalog) ? catalog : []).map((hotel, index) => normalizeHotel(hotel, index));
}

export function getHotelImage(hotel) {
  return pickHotelImage(
    hotel?.image,
    hotel?.defaultImage,
    hotel?.featured_image,
    hotel?.default_image,
    hotel?.gallery
  ) || HOTEL_FALLBACK_IMAGE;
}

export function matchesHotelAmenity(hotel, amenity) {
  if (!amenity || amenity === 'all') {
    return true;
  }

  const normalizedAmenity = slugifyHotelValue(amenity);

  return (hotel.amenities || []).some((item) => {
    const normalizedItem = slugifyHotelValue(item);
    return (
      normalizedItem === normalizedAmenity ||
      normalizedItem.includes(normalizedAmenity) ||
      normalizedAmenity.includes(normalizedItem)
    );
  });
}

export function filterHotels(hotels, filters = {}) {
  const {
    search = '',
    destination = 'all',
    type = 'all',
    rating = 'all',
    amenity = 'all',
  } = filters;

  const query = search.trim().toLowerCase();

  return hotels.filter((hotel) => {
    const matchesQuery =
      !query ||
      hotel.name.toLowerCase().includes(query) ||
      hotel.destination.toLowerCase().includes(query) ||
      hotel.region.toLowerCase().includes(query) ||
      hotel.description.toLowerCase().includes(query) ||
      hotel.badge.toLowerCase().includes(query) ||
      hotel.amenities.some((item) => item.toLowerCase().includes(query));

    const matchesDestination = destination === 'all' || hotel.destination === destination;
    const matchesType = type === 'all' || hotel.type === type;
    const matchesRating = rating === 'all' || hotel.starRating >= Number(rating);
    const matchesAmenity = matchesHotelAmenity(hotel, amenity);

    return matchesQuery && matchesDestination && matchesType && matchesRating && matchesAmenity;
  });
}

export function getFeaturedHotels(hotels, limit = 4) {
  const featured = hotels.filter((hotel) => hotel.featuredOnHome || hotel.featured);
  const pool = featured.length > 0 ? featured : [...hotels].sort((a, b) => b.starRating - a.starRating);
  return pool.slice(0, limit);
}

export function buildHotelQuery(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') {
      params.set(key, value);
    }
  });

  return params.toString();
}
