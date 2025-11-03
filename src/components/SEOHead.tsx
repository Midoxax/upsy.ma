import { useEffect } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { stripLocalePrefix } from '@/lib/i18n/utils';

interface SEOHeadProps {
  path: string;
}

const SEOHead = ({ path }: SEOHeadProps) => {
  const { locale } = useLocale();
  const basePath = stripLocalePrefix(path);
  const baseUrl = 'https://upsy.ma';

  useEffect(() => {
    // Set HTML lang attribute
    document.documentElement.lang = locale;

    // Remove existing alternate links
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
    document.querySelectorAll('link[rel="canonical"]').forEach(el => el.remove());

    // Add canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = locale === 'fr' ? `${baseUrl}/fr${basePath}` : locale === 'ar' ? `${baseUrl}/ar${basePath}` : `${baseUrl}${basePath}`;
    document.head.appendChild(canonical);

    // Add hreflang alternates
    const hreflangEn = document.createElement('link');
    hreflangEn.rel = 'alternate';
    hreflangEn.hreflang = 'en';
    hreflangEn.href = `${baseUrl}${basePath}`;
    document.head.appendChild(hreflangEn);

    const hreflangFr = document.createElement('link');
    hreflangFr.rel = 'alternate';
    hreflangFr.hreflang = 'fr';
    hreflangFr.href = `${baseUrl}/fr${basePath}`;
    document.head.appendChild(hreflangFr);

    const hreflangAr = document.createElement('link');
    hreflangAr.rel = 'alternate';
    hreflangAr.hreflang = 'ar';
    hreflangAr.href = `${baseUrl}/ar${basePath}`;
    document.head.appendChild(hreflangAr);

    const hreflangDefault = document.createElement('link');
    hreflangDefault.rel = 'alternate';
    hreflangDefault.hreflang = 'x-default';
    hreflangDefault.href = `${baseUrl}${basePath}`;
    document.head.appendChild(hreflangDefault);

    // Update Open Graph locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    const ogLocaleContent = locale === 'fr' ? 'fr_FR' : locale === 'ar' ? 'ar_AR' : 'en_US';
    ogLocale.setAttribute('content', ogLocaleContent);

    // Add og:locale:alternate
    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(el => el.remove());
    
    const alternateLocales = locale === 'en' ? ['fr_FR', 'ar_AR'] : locale === 'fr' ? ['en_US', 'ar_AR'] : ['en_US', 'fr_FR'];
    alternateLocales.forEach(altLocale => {
      const ogLocaleAlt = document.createElement('meta');
      ogLocaleAlt.setAttribute('property', 'og:locale:alternate');
      ogLocaleAlt.setAttribute('content', altLocale);
      document.head.appendChild(ogLocaleAlt);
    });

  }, [locale, basePath]);

  return null;
};

export default SEOHead;
