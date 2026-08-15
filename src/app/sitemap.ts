/**
 * Sitemap Generation
 * Generates sitemap.xml for all deliberate indexable pages across all locales.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { locales, type Locale } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { TOOL_CATEGORIES } from '@/types/tool';

export const dynamic = 'force-static';

type ChangeFrequency = 'daily' | 'weekly' | 'monthly';

const PRIORITY = {
  home: 1.0,
  tools: 0.9,
  category: 0.8,
  toolPage: 0.7,
  static: 0.5,
} as const;

const CHANGE_FREQUENCY: Record<keyof typeof PRIORITY, ChangeFrequency> = {
  home: 'daily',
  tools: 'weekly',
  category: 'weekly',
  toolPage: 'weekly',
  static: 'monthly',
};

const STATIC_PAGES = [
  { path: '', priority: PRIORITY.home, changeFrequency: CHANGE_FREQUENCY.home },
  { path: '/tools', priority: PRIORITY.tools, changeFrequency: CHANGE_FREQUENCY.tools },
  { path: '/workflow', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/about', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/faq', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/privacy', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/contact', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
] as const;

const CATEGORY_PAGES = TOOL_CATEGORIES.map((category) => ({
  path: `/tools/category/${category}`,
  priority: PRIORITY.category,
  changeFrequency: CHANGE_FREQUENCY.category,
}));

function createEntry(
  url: string,
  priority: number,
  changeFrequency: ChangeFrequency
): MetadataRoute.Sitemap[number] {
  // Deliberately omit lastModified because the repository does not track
  // reliable per-page content modification dates.
  return { url, priority, changeFrequency };
}

function generateLocaleEntries(locale: Locale): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of STATIC_PAGES) {
    entries.push(createEntry(`${siteConfig.url}/${locale}${page.path}`, page.priority, page.changeFrequency));
  }

  for (const page of CATEGORY_PAGES) {
    entries.push(createEntry(`${siteConfig.url}/${locale}${page.path}`, page.priority, page.changeFrequency));
  }

  for (const tool of getAllTools()) {
    entries.push(createEntry(`${siteConfig.url}/${locale}/tools/${tool.slug}`, PRIORITY.toolPage, CHANGE_FREQUENCY.toolPage));
  }

  return entries;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const rootEntry = createEntry(siteConfig.url, PRIORITY.home, CHANGE_FREQUENCY.home);
  return [rootEntry, ...locales.flatMap((locale) => generateLocaleEntries(locale))];
}

export function getSitemapUrlCount(): number {
  return 1 + (STATIC_PAGES.length + CATEGORY_PAGES.length + getAllTools().length) * locales.length;
}
