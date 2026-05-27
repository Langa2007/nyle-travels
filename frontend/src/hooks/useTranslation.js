'use client';

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';

export function useTranslation(ns = 'common') {
  const { t, i18n, ready } = useI18nTranslation(ns);
  const { isLoaded } = useLanguage();

  return {
    t,
    i18n,
    ready: ready && isLoaded
  };
}
