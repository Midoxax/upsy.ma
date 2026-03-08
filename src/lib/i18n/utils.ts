const SUPPORTED_LOCALES = ['fr', 'ar'] as const;

export const getLocaleFromPath = (pathname: string): 'en' | 'fr' | 'ar' => {
  // Match /fr, /fr/, /fr/anything or /ar, /ar/, /ar/anything
  const match = pathname.match(/^\/(fr|ar)(?:\/|$)/);
  if (match) return match[1] as 'fr' | 'ar';
  return 'en';
};

export const stripLocalePrefix = (pathname: string): string => {
  const match = pathname.match(/^\/(fr|ar)(\/.*)?$/);
  if (match) return match[2] || '/';
  return pathname;
};

export const addLocalePrefix = (pathname: string, locale: 'en' | 'fr' | 'ar'): string => {
  // Ensure pathname starts with /
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (locale === 'en') return path;
  return `/${locale}${path === '/' ? '' : path}`;
};

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};
