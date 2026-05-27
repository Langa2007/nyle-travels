'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

// Define the supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  // 1. Check cookie
  const savedLang = Cookies.get('NEXT_LOCALE');
  if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
    return savedLang;
  }
  
  // 2. Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LANGUAGES.some(l => l.code === browserLang)) {
    return browserLang;
  }
  
  return 'en';
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    // We will dynamically add resources to avoid huge bundle sizes initially,
    // or just rely on a simple fetch mechanism in the provider.
  });

export default i18n;
