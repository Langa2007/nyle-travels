'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { SUPPORTED_LANGUAGES, getInitialLanguage } from '@/lib/i18n';
import Cookies from 'js-cookie';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initLang = getInitialLanguage();
    
    // Load the translations for the initial language
    const loadTranslations = async (lang) => {
      try {
        const response = await fetch(`/locales/${lang}/common.json`);
        if (response.ok) {
          const translations = await response.json();
          i18n.addResourceBundle(lang, 'common', translations, true, true);
        }
      } catch (error) {
        console.error(`Failed to load translations for ${lang}`, error);
      }
      
      // Fallback to english if not english
      if (lang !== 'en') {
        try {
          const responseEn = await fetch(`/locales/en/common.json`);
          if (responseEn.ok) {
            const translationsEn = await responseEn.json();
            i18n.addResourceBundle('en', 'common', translationsEn, true, true);
          }
        } catch (error) {
          console.error(`Failed to load english fallback`, error);
        }
      }
      
      i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      document.documentElement.lang = lang;
      setIsLoaded(true);
    };

    loadTranslations(initLang);
  }, []);

  const changeLanguage = async (langCode) => {
    if (langCode === currentLanguage) return;
    
    setIsLoaded(false);
    try {
      if (!i18n.hasResourceBundle(langCode, 'common')) {
        const response = await fetch(`/locales/${langCode}/common.json`);
        if (response.ok) {
          const translations = await response.json();
          i18n.addResourceBundle(langCode, 'common', translations, true, true);
        }
      }
      
      await i18n.changeLanguage(langCode);
      setCurrentLanguage(langCode);
      Cookies.set('NEXT_LOCALE', langCode, { expires: 365, path: '/' });
      document.documentElement.lang = langCode;
    } catch (error) {
      console.error(`Failed to change language to ${langCode}`, error);
    } finally {
      setIsLoaded(true);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      supportedLanguages: SUPPORTED_LANGUAGES,
      isLoaded
    }}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </LanguageContext.Provider>
  );
}
