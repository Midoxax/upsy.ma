## Confirmed issue

The new `HeroSection.tsx`, `HomePricingSection.tsx`, and `HomeFAQSection.tsx` use hard-coded English literals. Visitors on `/fr`, `/ar`, `/ber` see English marketing copy on an RTL/localized shell. `Index.tsx` also hard-codes SEO title/description. `FeaturedPsychologistsSection` uses English fallbacks for keys missing from `translations.ts`.

## Fix scope

1. **`src/lib/i18n/translations.ts`** — add new keys under `home.hero.v7.*`, `home.pricing.*`, `home.faq.*`, and the missing `featured.*` keys, for all four locales (en, fr, ar, ber).
   - Hero: eyebrow, headline (two spans), subline, primary CTA, secondary CTA, ticker labels, metric card labels/values, trust bar label, trust bar chips.
   - Pricing: section eyebrow, title, subtitle, 3 tiers × {name, price cadence, tagline, 3–4 bullets, CTA label, "Most chosen" badge}, footnote + link label.
   - FAQ: eyebrow, title (with italic span), 13 Q/A pairs.
   - Featured psychologists: the fallback keys currently English-only.

2. **`src/components/home/HeroSection.tsx`** — import `useLocale`, replace every literal with `t('home.hero.v7.<key>')`. Keep the 3D scene and layout untouched.

3. **`src/components/home/HomePricingSection.tsx`** — drive the `tiers` array from `t()` calls; translate section header, badge, footnote.

4. **`src/components/home/HomeFAQSection.tsx`** — build `faqs` from `t()` calls (loop `home.faq.items.0.q` … `.12.a` or a keyed list).

5. **`src/pages/Index.tsx`** — pass localized `title`/`description` to `SEOHead` via `t('home.seo.title')` / `t('home.seo.description')` (add those keys too).

6. **`src/components/home/FeaturedPsychologistsSection.tsx`** — add the missing `featured.*` keys (titleConversion, subtitleConversion, slot.today, etc.) to translations so the fallback path isn't needed on fr/ar/ber.

## Notes

- FR and AR are full translations authored fresh; BER mirrors AR strings unless a Berber variant already exists in the file (keep pattern consistent with the rest of `translations.ts`).
- No layout/design changes — text swap only.
- Numerals (prices, metrics like `98.4`, `140ms`) stay as digits; only labels translate.
- After edits, verify by loading `/fr` and `/ar` in Playwright and screenshotting the hero + pricing + FAQ.

Approve and I'll implement.
