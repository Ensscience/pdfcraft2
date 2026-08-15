import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import WorkflowPageClient from './WorkflowPageClient';
import { generateBaseMetadata } from '@/lib/seo';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: localeParam } = await params;
    const locale = locales.includes(localeParam as Locale) ? (localeParam as Locale) : 'en';
    const t = await getTranslations({ locale, namespace: 'workflow' });

    return generateBaseMetadata({
        locale,
        path: '/workflow',
        title: t('metaTitle'),
        description: t('metaDescription'),
        keywords: ['PDF workflow builder', 'PDF automation', 'PDF tools workflow'],
    });
}

interface WorkflowPageProps {
    params: Promise<{ locale: string }>;
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return <WorkflowPageClient locale={locale as Locale} />;
}
