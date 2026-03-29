'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import StaticPageHeader from '@/components/ui/StaticPageHeader';
import Button from '@/components/ui/Button';
import { FiCalendar, FiUser, FiTag, FiChevronRight, FiClock } from 'react-icons/fi';
import { fetchSettings } from '@/utils/settings';

const defaultBlogPosts = [
  {
    id: 1,
    title: 'The Great Migration: A Photographer\'s Guide',
    excerpt: 'Discover the best tips and locations for capturing the world\'s most spectacular wildlife migration. From camera gear to timing, we cover everything you need to know for the perfect shot.',
    image: 'https://picsum.photos/seed/nyle_blog1/1200/800',
    date: 'March 15, 2024',
    category: 'Safari Guide',
    author: 'Sarah Mitchell',
    readTime: '12 min read',
    slug: 'great-migration-guide',
  },
  {
    id: 2,
    title: 'Top 5 Luxury Beach Resorts in Diani',
    excerpt: 'Unwind in paradise with our curated list of the most exclusive and secluded beach getaways. Experience white sands and turquoise waters in unparalleled luxury.',
    image: 'https://picsum.photos/seed/nyle_blog2/800/600',
    date: 'March 10, 2024',
    category: 'Hotels',
    author: 'James Wilson',
    readTime: '8 min read',
    slug: 'luxury-diani-resorts',
  },
  {
    id: 3,
    title: 'Sustainable Luxury: Our Commitment to Africa',
    excerpt: 'Learn how we are preserving Africa\'s natural beauty while providing unforgettable experiences. Sustainability is at the heart of everything we do at Nyle Travel.',
    image: 'https://picsum.photos/seed/nyle_blog3/800/600',
    date: 'March 5, 2024',
    category: 'Sustainability',
    author: 'David Chen',
    readTime: '10 min read',
    slug: 'sustainable-luxury-travel',
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState(defaultBlogPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchSettings('blog');
        if (data && Array.isArray(data) && data.length > 0) {
          // Merge with defaults to ensure we have all fields for UX
          setPosts(data.map((item, index) => ({
            ...defaultBlogPosts[index % defaultBlogPosts.length],
            ...item,
            id: item.id || `fetched-${index}`,
          })));
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="bg-white min-h-screen">
      <StaticPageHeader 
        title="Journal" 
        subtitle="Insights, guides, and inspiration for your next African adventure."
        bgImage="https://picsum.photos/seed/nyle_blog/1920/1080"
      />

      {/* Featured Post Section */}
      {!loading && featuredPost && (
        <section className="py-20 -mt-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="group relative bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 lg:flex items-stretch"
            >
              <div className="lg:w-2/3 relative h-[400px] lg:h-auto overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  unoptimized={featuredPost.image.startsWith('http')}
                />
                <div className="absolute top-8 left-8">
                  <span className="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-full shadow-lg">
                    FEATURED STORY
                  </span>
                </div>
              </div>
              <div className="lg:w-1/3 p-12 flex flex-col justify-center bg-gray-50/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 font-medium">
                  <span className="flex items-center"><FiCalendar className="mr-2" /> {featuredPost.date}</span>
                  <span className="flex items-center"><FiClock className="mr-2" /> {featuredPost.readTime}</span>
                </div>
                <h2 className="text-4xl font-serif text-gray-900 mb-6 leading-tight group-hover:text-primary-600 transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 italic">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    {featuredPost.author?.[0]}
                  </div>
                  <span className="text-gray-700 font-medium">{featuredPost.author}</span>
                </div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Button variant="primary" size="lg">Read Full Story</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Grid Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif text-gray-900">Latest Articles</h2>
            <div className="h-px bg-gray-200 flex-grow mx-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {remainingPosts.map((post, index) => (
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
                    unoptimized={post.image.startsWith('http')}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </Link>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4 uppercase tracking-widest">
                    <span className="flex items-center"><FiCalendar className="mr-1" /> {post.date}</span>
                    <span className="flex items-center"><FiClock className="mr-1" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                        {post.author?.[0]}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-primary-600 font-semibold text-sm inline-flex items-center group/btn transition-colors">
                      Read More
                      <FiChevronRight className="ml-1 group-hover/btn:ml-2 transition-all" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {!loading && remainingPosts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-serif text-gray-500 italic">Stay tuned for more updates...</h3>
            </div>
          )}

          <div className="mt-24 text-center">
            <Button variant="outline" size="xl" className="!px-12 hover:bg-primary-600 hover:text-white">
              Discover More Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-600 to-secondary-600 p-12 md:p-20 rounded-[50px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10 text-center text-white">
              <h2 className="text-4xl font-serif mb-6 leading-tight">Stay Inspired</h2>
              <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                Join our exclusive travel community and receive the latest African stories, guides, and exclusive offers directly in your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Your luxury email address"
                  className="flex-grow px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 outline-none focus:bg-white/20 transition-all"
                />
                <Button variant="outlineWhite" size="lg" className="whitespace-nowrap">Subscribe Now</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

