

## Add BreadcrumbList JSON-LD Schema to Blog Pages

### What This Does
Injects a `BreadcrumbList` structured data schema on blog pages so Google can display breadcrumb trails (e.g., "U.Psy › Blog › Understanding Anxiety") directly in search results.

### Changes

**File: `src/components/BlogArticleSchema.tsx`**

Extend the existing `useEffect` to inject a second JSON-LD script tag containing a `BreadcrumbList` schema alongside the existing `Article` schema. The breadcrumb structure will be:

1. **Home** → `https://upsy.ma` (or locale-prefixed)
2. **Blog** → `https://upsy.ma/blog` (or locale-prefixed)
3. **[Article Title]** → article URL

The schema will follow the same locale-aware URL pattern already used for the Article schema. A separate `<script>` tag with id `breadcrumb-schema-{slug}` will be created and cleaned up on unmount.

No new props needed — `title`, `slug`, and `locale` already provide everything required.

No changes to any blog page files — they all already use `BlogArticleSchema`.

