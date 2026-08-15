import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { generateBaseMetadata } from '@/lib/seo';
import { locales, type Locale } from '@/lib/i18n/config';
import TermsPageClient from './TermsPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = locales.includes(localeParam as Locale) ? (localeParam as Locale) : 'en';

  return generateBaseMetadata({
    locale,
    path: '/terms',
    title: 'Terms of Service',
    description: 'Read the YesConvert terms of service for using our free, private, browser-based PDF tools.',
    noIndex: true,
  });
}

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsPageClient locale={locale as Locale} />;
}
