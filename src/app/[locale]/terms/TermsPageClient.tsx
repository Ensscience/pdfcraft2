'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { type Locale } from '@/lib/i18n/config';

interface TermsPageClientProps {
  locale: Locale;
}

export default function TermsPageClient({ locale }: TermsPageClientProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[hsl(var(--color-primary)/0.1)] via-[hsl(var(--color-background))] to-[hsl(var(--color-secondary)/0.1)] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--color-foreground))] mb-6">
                Terms of Service
              </h1>
              <p className="text-lg text-[hsl(var(--color-muted-foreground))]">
                Please read these terms carefully before using YesConvert.
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

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                By accessing and using YesConvert, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">2. Description of Service</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                YesConvert provides free, browser-based PDF and file conversion tools. All processing happens locally in your browser — your files are never uploaded to our servers.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">3. Use of Service</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">You agree to use YesConvert only for lawful purposes. You must not:</p>
              <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--color-muted-foreground))] mb-4">
                <li>Use the service to process files you do not own or have permission to modify</li>
                <li>Attempt to reverse engineer or disrupt the service</li>
                <li>Use the service for any illegal or unauthorized purpose</li>
              </ul>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">4. Intellectual Property</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                The YesConvert name, logo, and interface are the property of Ahmed Chouib. The underlying open-source code is licensed under AGPL v3.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                YesConvert is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">6. Limitation of Liability</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                YesConvert shall not be liable for any damages resulting from the use or inability to use the service, including any loss of data.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">7. Changes to Terms</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">8. Contact</h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                For questions about these terms, contact us at <a href="mailto:ensscience@gmail.com" className="text-[hsl(var(--color-primary))] hover:underline">ensscience@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
