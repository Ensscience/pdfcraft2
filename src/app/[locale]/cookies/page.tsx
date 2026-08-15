import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { generateBaseMetadata } from '@/lib/seo';
import { locales, type Locale } from '@/lib/i18n/config';
import CookiesPageClient from './CookiesPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = locales.includes(localeParam as Locale) ? (localeParam as Locale) : 'en';

  return generateBaseMetadata({
    locale,
    path: '/cookies',
    title: 'Cookie Policy',
    description: 'Read the YesConvert cookie policy and learn how cookies support our free, private PDF tools.',
    noIndex: true,
  });
}

interface CookiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookiesPageClient locale={locale as Locale} />;
}
