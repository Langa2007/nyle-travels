// src/app/layout.js
import { Inter, Playfair_Display, Montserrat, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NextAuthProvider } from '@/context/NextAuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
import LoadingBar from '@/components/ui/LoadingBar';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Nyle Travel & Tours - Luxury African Safaris',
    template: '%s | Nyle Travel'
  },
  description: 'Experience the ultimate luxury African safari with Nyle Travel. Exclusive tours, premium accommodations, and personalized service.',
  keywords: 'luxury travel, african safari, kenya tours, luxury hotels, travel agency',
  authors: [{ name: 'Nyle Travel' }],
  creator: 'Nyle Travel',
  publisher: 'Nyle Travel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Nyle Travel & Tours - Luxury African Safaris',
    description: 'Experience the ultimate luxury African safari with Nyle Travel.',
    url: 'https://nyletravels.com',
    siteName: 'Nyle Travel',
    images: [
      {
        url: 'https://nyletravels.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nyle Travel Luxury Safari',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyle Travel & Tours - Luxury African Safaris',
    description: 'Experience the ultimate luxury African safari with Nyle Travel.',
    images: ['https://nyletravels.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo.svg',
    shortcut: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nyletravels.com'),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0ea5e9',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${cormorant.variable}`}
    >
      <body className="font-sans antialiased bg-white text-gray-900">
        <ThemeProvider>
          <NextAuthProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <LoadingBar />
                  <Navbar />
                  <main className="min-h-screen">
                    {children}
                  </main>
                  <Footer />
                  <Toast />
                  <Analytics />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


