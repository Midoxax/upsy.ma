import { useEffect } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { stripLocalePrefix } from '@/lib/i18n/utils';

interface SEOHeadProps {
  path: string;
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
}

const SEOHead = ({ path, title, description, ogImage, ogType = 'website' }: SEOHeadProps) => {
  const { locale } = useLocale();
  const basePath = stripLocalePrefix(path);
  const baseUrl = 'https://upsy.ma';

  useEffect(() => {
    document.documentElement.lang = locale;

    // Title
    if (title) document.title = title;

    // Helper to set or create a meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    const pageUrl = locale === 'fr' ? `${baseUrl}/fr${basePath}` : locale === 'ar' ? `${baseUrl}/ar${basePath}` : `${baseUrl}${basePath}`;

    if (title) {
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('name', 'twitter:card', 'summary_large_image');

    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
      setMeta('name', 'twitter:image', ogImage);
    }

    // Remove existing alternate/canonical links
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
    document.querySelectorAll('link[rel="canonical"]').forEach(el => el.remove());

    // Canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = pageUrl;
    document.head.appendChild(canonical);

    // Hreflang alternates
    const addAlternate = (hreflang: string, href: string) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      link.href = href;
      document.head.appendChild(link);
    };
    addAlternate('en', `${baseUrl}${basePath}`);
    addAlternate('fr', `${baseUrl}/fr${basePath}`);
    addAlternate('ar', `${baseUrl}/ar${basePath}`);
    addAlternate('x-default', `${baseUrl}${basePath}`);

    // OG locale
    const ogLocaleContent = locale === 'fr' ? 'fr_FR' : locale === 'ar' ? 'ar_AR' : 'en_US';
    setMeta('property', 'og:locale', ogLocaleContent);

    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(el => el.remove());
    const alternateLocales = locale === 'en' ? ['fr_FR', 'ar_AR'] : locale === 'fr' ? ['en_US', 'ar_AR'] : ['en_US', 'fr_FR'];
    alternateLocales.forEach(altLocale => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'og:locale:alternate');
      el.setAttribute('content', altLocale);
      document.head.appendChild(el);
    });
  }, [locale, basePath, title, description, ogImage, ogType]);

  return null;
};

export default SEOHead;
