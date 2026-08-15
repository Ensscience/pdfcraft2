import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import HomePageClient from './[locale]/HomePageClient';
import RootLocaleRedirect from './RootLocaleRedirect';
import { defaultLocale } from '@/lib/i18n/config';
import { generateHomeMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data';

export const metadata = generateHomeMetadata(defaultLocale, {
  title: 'YesConvert - Free Online PDF & File Converter',
  description: siteConfig.description,
}, {
  canonicalUrl: siteConfig.url,
  xDefaultUrl: siteConfig.url,
});

export default async function RootPage() {
  const messages = await getMessages({ locale: defaultLocale });
  const { tools } = await import('@/config/tools');
  const { getToolContent } = await import('@/config/tool-content');

  const localizedToolContent = tools.reduce((acc, tool) => {
    const content = getToolContent(defaultLocale, tool.id);
    if (content) {
      acc[tool.id] = {
        title: content.title,
        description: content.metaDescription,
      };
    }
    return acc;
  }, {} as Record<string, { title: string; description: string }>);

  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages}>
      <JsonLd data={generateWebSiteSchema(defaultLocale)} />
      <JsonLd data={generateOrganizationSchema()} />
      <RootLocaleRedirect />
      <HomePageClient locale={defaultLocale} localizedToolContent={localizedToolContent} />
    </NextIntlClientProvider>
  );
}
