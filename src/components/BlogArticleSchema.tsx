import { useEffect } from 'react';
import { useLocale } from '@/contexts/LocaleContext';

interface BlogArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  datePublished?: string;
  dateModified?: string;
  category?: string;
  readTimeMinutes?: number;
}

const BlogArticleSchema = ({
  title,
  description,
  slug,
  datePublished = '2025-01-15',
  dateModified,
  category = 'Mental Health',
  readTimeMinutes = 5,
}: BlogArticleSchemaProps) => {
  const { locale } = useLocale();
  const baseUrl = 'https://upsy.ma';
  const localePath = locale === 'en' ? '' : `/${locale}`;
  const articleUrl = `${baseUrl}${localePath}/blog/${slug}`;
  const wordCount = readTimeMinutes * 200;

  useEffect(() => {
    const scriptId = `article-schema-${slug}`;
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url: articleUrl,
      datePublished,
      dateModified: dateModified || datePublished,
      wordCount,
      inLanguage: locale === 'fr' ? 'fr-FR' : locale === 'ar' ? 'ar-MA' : 'en-US',
      author: {
        '@type': 'Organization',
        name: 'U.Psy',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'U.Psy',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/og-image.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      articleSection: category,
      isAccessibleForFree: true,
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [title, description, slug, locale, articleUrl, datePublished, dateModified, wordCount, category]);

  return null;
};

export default BlogArticleSchema;
