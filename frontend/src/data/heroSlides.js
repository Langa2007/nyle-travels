export const defaultHeroSlides = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/bj6tly/800/600',
    title: 'Luxury Safari Experience',
    subtitle: 'Witness the Great Migration',
    description: 'Experience the untamed beauty of Africa in unparalleled luxury',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/7dt4ou/800/600',
    title: 'Pristine Beach Retreats',
    subtitle: 'Indian Ocean Paradise',
    description: 'Relax on white sandy beaches with world-class amenities',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/f92ta9/800/600',
    title: 'Mountain Majesty',
    subtitle: 'Climb Kilimanjaro',
    description: "Conquer Africa's highest peak in style",
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/7gup6o/800/600',
    title: 'Cultural Immersion',
    subtitle: 'Meet Local Tribes',
    description: 'Discover the rich heritage and traditions of East Africa',
  },
  {
    id: 5,
    image: 'https://picsum.photos/seed/60xk0t/800/600',
    title: 'Majestic Waterfalls',
    subtitle: 'Victoria Falls & Beyond',
    description: 'Witness the breathtaking power of nature firsthand',
  },
];

export function normalizeHeroSlides(slides) {
  if (!Array.isArray(slides) || slides.length === 0) {
    return defaultHeroSlides;
  }

  const normalized = slides.map((slide, index) => {
    const fallback = defaultHeroSlides[index % defaultHeroSlides.length];

    return {
      id: slide?.id || fallback.id,
      image: slide?.image || fallback.image,
      title: slide?.title || fallback.title,
      subtitle: slide?.subtitle || fallback.subtitle,
      description: slide?.description || fallback.description,
    };
  });

  return normalized.some((slide) => slide.image) ? normalized : defaultHeroSlides;
}
