import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { translations } from '@/lib/i18n/translations';
import { getCookie, setCookie, getLocaleFromPath, stripLocalePrefix, addLocalePrefix } from '@/lib/i18n/utils';
import { supabase } from '@/integrations/supabase/client';

type Locale = 'en' | 'fr' | 'ar';

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
    if (cookieLocale === 'fr' || cookieLocale === 'en' || cookieLocale === 'ar') return cookieLocale;
    return getLocaleFromPath(location.pathname);
  });
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});

  // Load translation overrides once
  useEffect(() => {
    const loadOverrides = async () => {
      const { data } = await supabase
        .from('translation_overrides')
        .select('locale, translation_key, translation_value');
      if (data && data.length > 0) {
        const map: Record<string, Record<string, string>> = {};
        for (const row of data) {
          if (!map[row.locale]) map[row.locale] = {};
          map[row.locale][row.translation_key] = row.translation_value;
        }
        setOverrides(map);
      }
    };
    loadOverrides();
  }, []);

  // First-visit auto-redirect
  useEffect(() => {
    const hasVisited = getCookie('lng');
    const currentPath = location.pathname;
    
    if (!hasVisited && !currentPath.startsWith('/fr') && !currentPath.startsWith('/ar')) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('fr')) {
        setCookie('lng', 'fr', 180);
        const newPath = '/fr' + currentPath + location.search + location.hash;
        navigate(newPath, { replace: true });
        setLocaleState('fr');
      } else if (browserLang.includes('ar')) {
        setCookie('lng', 'ar', 180);
        const newPath = '/ar' + currentPath + location.search + location.hash;
        navigate(newPath, { replace: true });
        setLocaleState('ar');
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

  // Set text direction for RTL languages
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setCookie('lng', newLocale, 180);
    setLocaleState(newLocale);
    
    const currentPath = stripLocalePrefix(location.pathname);
    const newPath = addLocalePrefix(currentPath, newLocale);
    navigate(newPath + location.search + location.hash);
  };

  const t = (key: string): string => {
    // Check DB overrides first
    const override = overrides[locale]?.[key];
    if (override !== undefined) return override;

    // Fall back to static translations
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
