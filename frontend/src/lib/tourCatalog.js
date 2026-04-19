export const TOUR_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80';

export function getTourImage(tour) {
  return tour?.featured_image?.trim() || tour?.image?.trim() || TOUR_FALLBACK_IMAGE;
}

export function filterTours(tours, filters = {}) {
  const {
    search = '',
    type = 'all',
    duration = 'all',
    destination = 'all',
    difficulty = 'all',
  } = filters;

  const query = search.trim().toLowerCase();

  return tours.filter((tour) => {
    const matchesQuery =
      !query ||
      tour.name.toLowerCase().includes(query) ||
      tour.description?.toLowerCase().includes(query) ||
      tour.short_description?.toLowerCase().includes(query) ||
      tour.destination?.name?.toLowerCase().includes(query);

    const matchesType = type === 'all' || tour.type === type;
    const matchesDuration = duration === 'all' || checkDuration(tour.duration_days, duration);
    const matchesDestination = destination === 'all' || tour.destination?.name === destination;
    const matchesDifficulty = difficulty === 'all' || tour.difficulty_level === difficulty;

    return matchesQuery && matchesType && matchesDuration && matchesDestination && matchesDifficulty;
  });
}

function checkDuration(tourDays, filterDuration) {
  const days = parseInt(tourDays);
  switch (filterDuration) {
    case '1-3':
      return days >= 1 && days <= 3;
    case '4-7':
      return days >= 4 && days <= 7;
    case '8-14':
      return days >= 8 && days <= 14;
    case '15+':
      return days >= 15;
    default:
      return true;
  }
}

export function getFeaturedTours(tours, limit = 4) {
  const featured = tours.filter((tour) => tour.is_featured);
  const pool = featured.length > 0 ? featured : [...tours].sort((a, b) => b.booking_count - a.booking_count);
  return pool.slice(0, limit);
}

export function buildTourQuery(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') {
      params.set(key, value);
    }
  });

  return params.toString();
}