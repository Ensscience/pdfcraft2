'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Cookie } from 'lucide-react';
import { type Locale } from '@/lib/i18n/config';

interface CookiesPageClientProps {
  locale: Locale;
}

export default function CookiesPageClient({ locale }: CookiesPageClientProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[hsl(var(--color-primary)/0.1)] via-[hsl(var(--color-background))] to-[hsl(var(--color-secondary)/0.1)] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6">
                <Cookie className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--color-foreground))] mb-6">
                Cookie Policy
              </h1>
              <p className="text-lg text-[hsl(var(--color-muted-foreground))]">
                We use minimal cookies to ensure the best experience on YesConvert.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-8">
                Last updated: May 2025
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">1. What Are Cookies?</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">2. How We Use Cookies</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">YesConvert uses only essential cookies:</p>
              <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--color-muted-foreground))] mb-4">
                <li><strong>Language preference:</strong> Remembers your chosen language</li>
                <li><strong>Theme preference:</strong> Remembers if you prefer dark or light mode</li>
                <li><strong>Session data:</strong> Keeps track of your current session for tool functionality</li>
              </ul>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">3. Cookies We Do NOT Use</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">We do not use:</p>
              <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--color-muted-foreground))] mb-4">
                <li>Advertising or tracking cookies</li>
                <li>Third-party marketing cookies</li>
                <li>Social media tracking cookies</li>
                <li>Cookies that identify you personally</li>
              </ul>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">4. Local Storage</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                In addition to cookies, we use your browser&apos;s local storage to save your tool history and work-in-progress. This data stays on your device and is never sent to us.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">5. Managing Cookies</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                You can control cookies through your browser settings. Note that disabling cookies may affect some features of YesConvert, such as language and theme preferences.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">6. Contact</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                For questions about our cookie policy, contact us at <a href="mailto:ensscience@gmail.com" className="text-[hsl(var(--color-primary))] hover:underline">ensscience@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
