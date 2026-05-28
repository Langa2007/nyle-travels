'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiChevronRight
} from 'react-icons/fi';
import { FaTripadvisor } from 'react-icons/fa';
import Newsletter from '@/components/home/Newsletter';
import { useTranslation } from '@/hooks/useTranslation';

const getFooterLinks = (t) => ({
  company: [
    { label: t('footer.aboutUs'), href: '/about' },
    { label: t('footer.careers'), href: '/careers' },
    { label: t('footer.blog'), href: '/blog' },
    { label: t('footer.press'), href: '/press' },
    { label: t('footer.sustainability'), href: '/sustainability' },
  ],
  support: [
    { label: t('footer.contactUs'), href: '/contact' },
    { label: t('footer.reportIssue'), href: '/report' },
    { label: t('footer.faqs'), href: '/faqs' },
    { label: t('footer.bookingGuide'), href: '/guide' },
    { label: 'Lipa Pole Pole', href: '/travel-fund' },
    { label: t('footer.travelInsurance'), href: '/insurance' },
    { label: t('footer.terms'), href: '/terms' },
    { label: t('footer.privacy'), href: '/privacy' },
  ],
  destinations: [
    { label: 'Maasai Mara', href: '/destinations#maasai-mara' },
    { label: 'Diani Beach', href: '/destinations#diani-beach' },
    { label: 'Amboseli', href: '/destinations#amboseli' },
    { label: 'Tsavo', href: '/destinations#tsavo-east' },
    { label: 'Lake Nakuru', href: '/destinations#lake-nakuru' },
    { label: 'Samburu', href: '/destinations#samburu' },
  ],
  tours: [
    { label: t('footer.safariAdventures'), href: '/tours?type=safari' },
    { label: t('footer.beachHolidays'), href: '/tours?type=beach' },
    { label: t('footer.mountainClimbing'), href: '/tours?type=mountain' },
    { label: t('footer.culturalTours'), href: '/tours?type=cultural' },
    { label: t('footer.honeymoonPackages'), href: '/tours?type=honeymoon' },
    { label: t('footer.familySafaris'), href: '/tours?type=family' },
  ],
});

const socialLinks = [
  { icon: FiFacebook, href: 'https://facebook.com/nyletravel', label: 'Facebook' },
  { icon: FiTwitter, href: 'https://twitter.com/nyletravel', label: 'Twitter' },
  { icon: FiInstagram, href: 'https://instagram.com/nyletravel', label: 'Instagram' },
  { icon: FiLinkedin, href: 'https://linkedin.com/company/nyletravel', label: 'LinkedIn' },
  { icon: FiYoutube, href: 'https://youtube.com/nyletravel', label: 'YouTube' },
  { icon: FaTripadvisor, href: 'https://tripadvisor.com/nyletravel', label: 'TripAdvisor' },
];

const awards = [
  {
    name: 'World Travel Awards',
    image: 'https://picsum.photos/seed/logo_pi6hmk9/200/200',
    year: '2023',
  },
  {
    name: 'Luxury Travel Guide',
    image: 'https://picsum.photos/seed/logo_wsbe0d/200/200',
    year: '2023',
  },
  {
    name: 'African Travel Awards',
    image: 'https://picsum.photos/seed/logo_mf6v16/200/200',
    year: '2023',
  },
];

export default function Footer() {
  const { t } = useTranslation();
  const footerLinks = getFooterLinks(t);

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="https://picsum.photos/seed/930b59/800/600"
          alt="Footer Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/90" />

      {/* Newsletter Section */}
      <div className="relative border-b border-gray-800">
        <Newsletter />
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl font-serif">N</span>
                </div>
                <span className="font-serif text-2xl font-bold text-white">
                  Nyle<span className="text-primary-400">Travel</span>
                </span>
              </div>
            </Link>

            <p className="text-gray-400 mb-6">
              Curating extraordinary African experiences for discerning travelers since 2010.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <FiMapPin className="w-5 h-5 text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-300">
                  Peponi Road, Nairobi<br />Kenya
                </span>
              </div>
              <div className="flex items-center">
                <FiPhone className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                <a href="tel:+254704521408" className="text-gray-300 hover:text-primary-400 transition-colors">
                  +254 704521408
                </a>
              </div>
              <div className="flex items-center">
                <FiMail className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@nyletravel.com" className="text-gray-300 hover:text-primary-400 transition-colors">
                  info@nyletravel.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.company')}
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                    >
                      <FiChevronRight className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.support')}
              </h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                    >
                      <FiChevronRight className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.topDestinations')}
              </h3>
              <ul className="space-y-2">
                {footerLinks.destinations.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                    >
                      <FiChevronRight className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tours */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.popularTours')}
              </h3>
              <ul className="space-y-2">
                {footerLinks.tours.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                    >
                      <FiChevronRight className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Awards Column */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t('footer.awards')}
            </h3>
            <div className="space-y-4">
              {awards.map((award) => (
                <div key={award.name} className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={award.image}
                      alt={award.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{award.name}</div>
                    <div className="text-xs text-gray-500">{award.year}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.securePayments')}
              </h3>
              <div className="flex space-x-2">
                <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">
                  Visa
                </div>
                <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">
                  Mpesa
                </div>
                <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">
                  Amex
                </div>
                <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Nyle Travel & Tours. {t('footer.allRightsReserved')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                {t('footer.cookies')}
              </Link>
              <Link href="/sitemap" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                {t('footer.sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
