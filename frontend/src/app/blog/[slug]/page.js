'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiCalendar, FiUser, FiClock, FiChevronLeft, FiShare2, FiBookmark } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { fetchSettings } from '@/utils/settings';

const defaultBlogPosts = [
  {
    id: 1,
    title: 'The Great Migration: A Photographer\'s Guide',
    excerpt: 'Discover the best tips and locations for capturing the world\'s most spectacular wildlife migration.',
    content: `
      <p>The Great Migration is one of nature's most spectacular events, and capturing it through a lens requires both patience and the right knowledge. Every year, over 1.5 million wildebeest, zebras, and antelopes traverse the Serengeti-Mara ecosystem in search of greener pastures.</p>
      
      <h2>When to Go</h2>
      <p>Timing is everything. Typically, the herds are in the Maasai Mara from July to October. This is when the dramatic river crossings occur at the Mara River, providing some of the most intense wildlife photography opportunities in the world.</p>
      
      <h2>Essential Gear</h2>
      <p>For wildlife photography, a long lens is non-negotiable. A 100-400mm or a 200-600mm lens will give you the reach needed for distant subjects while allowing you to zoom out for wider context. Don't forget a beanbag or a sturdy gimbal head for your safari vehicle's roof.</p>
      
      <blockquote>"Photography is the only language that can be understood anywhere in the world." - Bruno Barbey</blockquote>
      
      <h2>Composing the Shot</h2>
      <p>Instead of just focusing on individual animals, try to capture the scale of the migration. Use a wider angle to show the vast herds stretching to the horizon, or focus on the dust and chaos of a river crossing to convey the raw energy of the movement.</p>
    `,
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
    excerpt: 'Unwind in paradise with our curated list of the most exclusive and secluded beach getaways.',
    content: `
      <p>Diani Beach, with its powder-white sands and turquoise waters, is the crown jewel of the Kenyan coast. For those seeking the ultimate in coastal luxury, these five resorts offer unparalleled service and privacy.</p>
      
      <h2>1. Almanara Luxury Resort</h2>
      <p>Nestled between the pristine beach and the ancient forests, Almanara offers six executive villas and a spectacular boutique hotel. The focus here is on personalized service, with each villa assigned a dedicated chef and butler.</p>
      
      <h2>2. Alfajiri Villas</h2>
      <p>Often cited as the most exclusive villas on the East African coast, Alfajiri offers absolute privacy and stunning Indian Ocean views. The decor is a beautiful blend of African and European styles.</p>
      
      <h2>3. The Sands at Nomad</h2>
      <p>Nomad combines an award-winning spa with world-class dining. Its forest-protected location provides a natural sanctuary away from the crowds, while still offering direct beach access.</p>
    `,
    image: 'https://picsum.photos/seed/nyle_blog2/1200/800',
    date: 'March 10, 2024',
    category: 'Hotels',
    author: 'James Wilson',
    readTime: '8 min read',
    slug: 'luxury-diani-resorts',
  },
  {
    id: 3,
    title: 'Sustainable Luxury: Our Commitment to Africa',
    excerpt: 'Learn how we are preserving Africa\'s natural beauty while providing unforgettable experiences.',
    content: `
      <p>At Nyle Travel, we believe that luxury and sustainability are not mutually exclusive. In fact, we believe they are deeply intertwined. Our commitment to Africa goes beyond providing exceptional tours; it's about ensuring these landscapes and communities thrive for generations to come.</p>
      
      <h2>Conservation First</h2>
      <p>We partner only with lodges and camps that have proven conservation records. Whether it's through wildlife protection, solar energy investment, or water conservation, our partners are at the forefront of sustainable hospitality.</p>
      
      <h2>Empowering Communities</h2>
      <p>True sustainability includes the people who call these places home. We prioritize experiences that provide direct economic benefits to local communities and support education and healthcare initiatives.</p>
    `,
    image: 'https://picsum.photos/seed/nyle_blog3/1200/800',
    date: 'March 5, 2024',
    category: 'Sustainability',
    author: 'David Chen',
    readTime: '10 min read',
    slug: 'sustainable-luxury-travel',
  }
];

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchSettings('blog');
        let foundPost = null;
        
        if (data && Array.isArray(data)) {
          foundPost = data.find(p => p.slug === slug);
        }
        
        if (!foundPost) {
          foundPost = defaultBlogPosts.find(p => p.slug === slug);
        }

        if (foundPost) {
          // Merge with default to ensure we have content if it's missing from DB
          const defaultPost = defaultBlogPosts.find(p => p.slug === slug) || defaultBlogPosts[0];
          setPost({
            ...defaultPost,
            ...foundPost
          });
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-serif mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The story you're looking for has moved or no longer exists.</p>
        <Link href="/blog">
          <Button variant="primary">Back to Journal</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="relative h-[60vh] min-h-[500px] w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full tracking-widest uppercase">
                  {post.category}
                </span>
                <span className="text-white/80 text-sm flex items-center">
                  <FiClock className="mr-2" /> {post.readTime}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mr-3 font-bold">
                    {post.author?.[0]}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-60">Authored by</div>
                    <div className="font-medium">{post.author}</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div className="flex items-center">
                  <FiCalendar className="mr-3 text-xl opacity-60" />
                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-60">Published</div>
                    <div className="font-medium">{post.date}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Left */}
            <aside className="lg:w-24 flex lg:flex-col items-center justify-start space-x-6 lg:space-x-0 lg:space-y-8 order-2 lg:order-1">
              <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-600 transition-all group">
                <FiShare2 size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-600 transition-all group">
                <FiBookmark size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="hidden lg:block w-px h-24 bg-gray-100" />
            </aside>

            {/* Main Content */}
            <div className="lg:w-2/3 order-1 lg:order-2">
              <div 
                className="prose prose-lg max-w-none prose-serif prose-primary text-gray-700 leading-relaxed
                prose-headings:font-serif prose-headings:text-gray-900 prose-headings:mb-6
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-100
                prose-p:mb-8 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 prose-blockquote:p-8 prose-blockquote:rounded-2xl prose-blockquote:italic
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm uppercase tracking-widest font-semibold">Share the journey</span>
                  <div className="flex gap-3">
                    {/* Share buttons would go here */}
                  </div>
                </div>
                <Link href="/blog">
                  <Button variant="outline" className="group">
                    <FiChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Journal
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar Right */}
            <aside className="lg:w-1/4 order-3">
              <div className="sticky top-32">
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h4 className="text-xl font-serif mb-6">Plan Your Journey</h4>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                    Inspired by this story? Let our experts craft your own unique African adventure.
                  </p>
                  <Link href="/contact">
                    <Button variant="primary" className="w-full">Enquire Now</Button>
                  </Link>
                </div>

                <div className="mt-12">
                  <h4 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-6">Related Stories</h4>
                  <div className="space-y-8">
                    {defaultBlogPosts.filter(p => p.slug !== slug).map(related => (
                      <Link key={related.id} href={`/blog/${related.slug}`} className="group flex gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={related.image} alt={related.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                            {related.title}
                          </h5>
                          <span className="text-xs text-gray-400 mt-2 block">{related.date}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
