
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import type { Language, Translations, Theme } from '@/types';
import { translations, defaultLang } from '@/locales';
import useLocalStorage from '@/hooks/use-local-storage';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
  getLocalizedCategories: () => Record<string, string>;
  getLocalizedSubcategories: () => Record<string, string>;
  currentTranslations: Translations;
  theme: Theme;
  toggleTheme: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [storedLanguage, setStoredLanguage] = useLocalStorage<Language>('app-language', defaultLang);
  const [language, setLanguageState] = useState<Language>(storedLanguage);
  
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('app-theme', 'light');
  const [theme, setThemeState] = useState<Theme>(storedTheme);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLanguageState(storedLanguage); 
    setThemeState(storedTheme);
  }, [storedLanguage, storedTheme]);
  
  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = language;
      document.body.classList.remove('font-english', 'font-tamil', 'font-hindi');
      if (language === 'ta') {
        document.body.classList.add('font-tamil');
      } else if (language === 'hi') {
        document.body.classList.add('font-hindi');
      } else {
        document.body.classList.add('font-english');
      }

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [language, theme, isMounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  };

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  }, [theme, setStoredTheme]);

  const t = (key: string, options?: Record<string, string | number>): string => {
    if (!isMounted) return key; 

    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        result = translations[defaultLang];
        for (const fk of keys) {
          result = result?.[fk];
          if (result === undefined) return key; 
        }
        break;
      }
    }
    
    if (typeof result === 'string' && options) {
      return Object.entries(options).reduce((str, [optKey, optVal]) => {
        return str.replace(new RegExp(`{{${optKey}}}`, 'g'), String(optVal));
      }, result);
    }

    return typeof result === 'string' ? result : key;
  };

  const getLocalizedCategories = () => {
    if (!isMounted) return {};
    return {
      daily: t('categoryDaily'),
      creditCard: t('categoryCreditCard'),
      special: t('categorySpecial'),
    };
  };

  const getLocalizedSubcategories = () => {
    if (!isMounted) return {};
    return {
      gift: t('subcategoryGift'),
      marriage: t('subcategoryMarriage'),
      birthday: t('subcategoryBirthday'),
      custom: t('subcategoryCustom'),
    };
  };
  
  const currentTranslations = isMounted ? translations[language] : translations[defaultLang];

  if (!isMounted) {
    return null; 
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, getLocalizedCategories, getLocalizedSubcategories, currentTranslations, theme, toggleTheme }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
