'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiTag, FiChevronRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const defaultBlogPosts = [
  {
    id: 1,
    title: 'Ultimate Guide to the Great Migration',
    excerpt: 'Everything you need to know about witnessing one of nature\'s greatest spectacles.',
    image: 'https://picsum.photos/seed/xbuiz9/800/600',
    author: 'Sarah Mitchell',
    date: 'March 15, 2024',
    category: 'Safari Guide',
    readTime: '8 min read',
    slug: 'great-migration-guide',
  },
  {
    id: 2,
    title: 'Top 10 Luxury Beach Resorts in Diani',
    excerpt: 'Discover the most exclusive beachfront properties along Kenya\'s coast.',
    image: 'https://picsum.photos/seed/qsmzqu/800/600',
    author: 'James Wilson',
    date: 'March 10, 2024',
    category: 'Hotels',
    readTime: '6 min read',
    slug: 'luxury-diani-resorts',
  },
  {
    id: 3,
    title: 'Photography Tips for Safari',
    excerpt: 'Expert advice on capturing stunning wildlife photos during your safari.',
    image: 'https://picsum.photos/seed/3vr8iq/800/600',
    author: 'Emma Thompson',
    date: 'March 5, 2024',
    category: 'Photography',
    readTime: '5 min read',
    slug: 'safari-photography-tips',
  },
  {
    id: 4,
    title: 'Sustainable Luxury Travel in Africa',
    excerpt: 'How we\'re preserving nature while providing unforgettable experiences.',
    image: 'https://picsum.photos/seed/ack89b/800/600',
    author: 'David Chen',
    date: 'February 28, 2024',
    category: 'Sustainability',
    readTime: '7 min read',
    slug: 'sustainable-luxury-travel',
  },
];

export default function TravelBlog() {
  const [posts, setPosts] = useState(defaultBlogPosts);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
        if (!apiUrl) return;
        
        const res = await fetch(`${apiUrl}/settings/blog_posts_sections`);
        const result = await res.json();
        
        if (result.status === 'success' && result.data && Array.isArray(result.data) && result.data.length > 0) {
          setPosts(result.data.map((item, index) => ({
            ...defaultBlogPosts[index % defaultBlogPosts.length],
            ...item,
            id: item.id || defaultBlogPosts[index % defaultBlogPosts.length].id,
            image: item.image || defaultBlogPosts[index % defaultBlogPosts.length].image
          })));
        }
      } catch (error) {
        console.error('Failed to fetch blog settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <Link href={`/blog/${post.slug}`}>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Image */}
                <div className="md:col-span-2 relative h-48 md:h-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-3 p-6">
                  {/* Meta Info */}
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <FiUser className="mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <FiTag className="mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                    Read More
                    <FiChevronRight className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="col-span-full text-center mt-12"
      >
        <Link href="/blog">
          <Button variant="outline" size="lg">
            View All Articles
            <FiChevronRight className="ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
