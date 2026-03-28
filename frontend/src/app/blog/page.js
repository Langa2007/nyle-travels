'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import StaticPageHeader from '@/components/ui/StaticPageHeader';
import Button from '@/components/ui/Button';

const posts = [
  {
    id: 1,
    title: 'The Great Migration: A Photographer\'s Guide',
    excerpt: 'Discover the best tips and locations for capturing the world\'s most spectacular wildlife migration.',
    image: 'https://picsum.photos/seed/nyle_blog1/800/600',
    date: 'March 15, 2024',
    category: 'Safari Guide',
    slug: 'great-migration-guide',
  },
  {
    id: 2,
    title: 'Top 5 Luxury Beach Resorts in Diani',
    excerpt: 'Unwind in paradise with our curated list of the most exclusive and secluded beach getaways.',
    image: 'https://picsum.photos/seed/nyle_blog2/800/600',
    date: 'March 10, 2024',
    category: 'Hotels',
    slug: 'luxury-diani-resorts',
  },
  {
    id: 3,
    title: 'Sustainable Luxury: Our Commitment to Africa',
    excerpt: 'Learn how we are preserving Africa\'s natural beauty while providing unforgettable experiences.',
    image: 'https://picsum.photos/seed/nyle_blog3/800/600',
    date: 'March 5, 2024',
    category: 'Sustainability',
    slug: 'sustainable-luxury-travel',
  },
  {
    id: 4,
    title: 'Meet the Guides: Experts of the Maasai Mara',
    excerpt: 'Get to know the passionate and knowledgeable guides who bring our luxury safaris to life.',
    image: 'https://picsum.photos/seed/nyle_blog4/800/600',
    date: 'February 28, 2024',
    category: 'Guides',
    slug: 'meet-the-guides',
  },
];

export default function BlogPage() {
  return (
    <div className="bg-white">
      <StaticPageHeader 
        title="Journal" 
        subtitle="Insights, guides, and inspiration for your next African adventure."
        bgImage="https://picsum.photos/seed/nyle_blog/1920/1080"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col h-full bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <Link href={`/blog/${post.slug}`} className="relative h-64 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </Link>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="text-sm text-gray-400 mb-3">{post.date}</div>
                  <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="text-primary-600 font-semibold text-sm inline-flex items-center group/btn">
                    Read Full Story
                    <span className="ml-2 group-hover/btn:ml-4 transition-all">→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" size="lg">
              Load More Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
