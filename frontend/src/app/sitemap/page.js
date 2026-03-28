'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';
import Link from 'next/link';

const sitemapData = [
  {
    title: 'Main Navigation',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Tours', href: '/tours' },
      { label: 'Hotels', href: '/hotels' },
      { label: 'Destinations', href: '/destinations' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
      { label: 'Sustainability', href: '/sustainability' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', href: '/faqs' },
      { label: 'Booking Guide', href: '/guide' },
      { label: 'Travel Insurance', href: '/insurance' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookies Policy', href: '/cookies' },
    ],
  },
  {
    title: 'Luxury Experiences',
    links: [
      { label: 'Wildlide Safaris', href: '/tours?type=wildlife' },
      { label: 'Beach Holidays', href: '/tours?type=beach' },
      { label: 'Cultural Tours', href: '/tours?type=cultural' },
      { label: 'Honeymoon Packages', href: '/tours?type=honeymoon' },
    ],
  },
];

export default function SitemapPage() {
  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {sitemapData.map((section, index) => (
        <div key={index} className="space-y-6">
          <h3 className="text-xl font-serif text-gray-900 border-b border-gray-100 pb-4 mb-6">{section.title}</h3>
          <ul className="space-y-4">
            {section.links.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href} className="text-gray-600 hover:text-primary-600 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <BasicStaticPage 
      title="Sitemap" 
      subtitle="Insights, news, and inspiration for your next African adventure."
      content={content}
    />
  );
}
