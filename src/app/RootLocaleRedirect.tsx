'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale, locales } from '@/lib/i18n/config';
import { getLanguagePreference } from '@/components/layout/LanguageSelector';

/**
 * Preserve the existing browser-language behavior without making the root URL
 * an empty client-only document for crawlers.
 */
export default function RootLocaleRedirect() {
  const router = useRouter();

  useEffect(() => {
    const preferredLocale = getLanguagePreference();
    const browserLocale = navigator.language.split('-')[0];
    const targetLocale = preferredLocale || (
      (locales as readonly string[]).includes(browserLocale)
        ? browserLocale
        : defaultLocale
    );

    if (targetLocale !== defaultLocale) {
      router.replace(`/${targetLocale}`);
    }
  }, [router]);

  return null;
}
