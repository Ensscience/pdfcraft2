import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import CookiesPageClient from './CookiesPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cookie Policy | YesConvert',
    description: 'Cookie Policy for YesConvert - Free Online PDF & File Converter.',
  };
}

interface CookiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookiesPageClient locale={locale as Locale} />;
}
