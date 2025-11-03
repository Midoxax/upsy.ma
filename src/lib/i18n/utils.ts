export const getLocaleFromPath = (pathname: string): 'en' | 'fr' | 'ar' => {
  if (pathname.startsWith('/fr')) return 'fr';
  if (pathname.startsWith('/ar')) return 'ar';
  return 'en';
};

export const stripLocalePrefix = (pathname: string): string => {
  if (pathname.startsWith('/fr')) {
    return pathname.slice(3) || '/';
  }
  if (pathname.startsWith('/ar')) {
    return pathname.slice(3) || '/';
  }
  return pathname;
};

export const addLocalePrefix = (pathname: string, locale: 'en' | 'fr' | 'ar'): string => {
  if (locale === 'fr') {
    return '/fr' + pathname;
  }
  if (locale === 'ar') {
    return '/ar' + pathname;
  }
  return pathname;
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
