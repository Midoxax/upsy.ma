import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { translations } from '@/lib/i18n/translations';
import { getCookie, setCookie, getLocaleFromPath, stripLocalePrefix, addLocalePrefix } from '@/lib/i18n/utils';

type Locale = 'en' | 'fr';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [locale, setLocaleState] = useState<Locale>(() => {
    const cookieLocale = getCookie('lng');
    if (cookieLocale === 'fr' || cookieLocale === 'en') return cookieLocale;
    return getLocaleFromPath(location.pathname);
  });

  // First-visit auto-redirect
  useEffect(() => {
    const hasVisited = getCookie('lng');
    const currentPath = location.pathname;
    
    if (!hasVisited && !currentPath.startsWith('/fr')) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('fr')) {
        setCookie('lng', 'fr', 180);
        const newPath = '/fr' + currentPath + location.search + location.hash;
        navigate(newPath, { replace: true });
        setLocaleState('fr');
      } else {
        setCookie('lng', 'en', 180);
        setLocaleState('en');
      }
    }
  }, []);

  // Sync locale with URL changes
  useEffect(() => {
    const urlLocale = getLocaleFromPath(location.pathname);
    if (urlLocale !== locale) {
      setLocaleState(urlLocale);
    }
  }, [location.pathname]);

  const setLocale = (newLocale: Locale) => {
    setCookie('lng', newLocale, 180);
    setLocaleState(newLocale);
    
    const currentPath = stripLocalePrefix(location.pathname);
    const newPath = addLocalePrefix(currentPath, newLocale);
    navigate(newPath + location.search + location.hash);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
