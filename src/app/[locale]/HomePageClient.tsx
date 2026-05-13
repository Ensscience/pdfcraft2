'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Zap, Wrench, Lock, Sparkles, Edit, FileImage, FolderOpen, Settings, ShieldCheck, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAllTools, getToolsByCategory, getPopularTools } from '@/config/tools';
import { type Locale } from '@/lib/i18n/config';
import { CATEGORY_INFO, type ToolCategory } from '@/types/tool';

interface HomePageClientProps {
  locale: Locale;
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

// ─── Redbubble Carousel Banner ───────────────────────────────────────────────
const REDBUBBLE_URL = 'https://www.redbubble.com/people/Zaydroid/shop?asc=u';

const slides = [
  {
    bg: 'from-[#1a0533] to-[#0f0e17]',
    blob: 'rgba(180,100,255,0.15)',
    accent: '#c084fc',
    btnBg: 'rgba(192,132,252,0.15)',
    btnBorder: 'rgba(192,132,252,0.35)',
    tag: 'Unique Designs',
    headline: ['Wear Art', 'You\'ll Love'],
    sub: 'Exclusive handcrafted designs on tees, mugs, stickers & more.',
    cta: 'Shop Now',
  },
  {
    bg: 'from-[#001a33] to-[#0f0e17]',
    blob: 'rgba(56,189,248,0.15)',
    accent: '#38bdf8',
    btnBg: 'rgba(56,189,248,0.15)',
    btnBorder: 'rgba(56,189,248,0.35)',
    tag: 'Posters & Prints',
    headline: ['Art That', 'Transforms Walls'],
    sub: 'Gallery-worthy prints delivered to your door. Every design one of a kind.',
    cta: 'Browse Prints',
  },
  {
    bg: 'from-[#1a1a00] to-[#0f0e17]',
    blob: 'rgba(250,204,21,0.15)',
    accent: '#fbbf24',
    btnBg: 'rgba(251,191,36,0.15)',
    btnBorder: 'rgba(251,191,36,0.35)',
    tag: 'Apparel & Accessories',
    headline: ['Style With', 'a Story'],
    sub: 'Hoodies, tote bags & accessories with designs that spark conversations.',
    cta: 'See Collection',
  },
  {
    bg: 'from-[#001a1a] to-[#0f0e17]',
    blob: 'rgba(52,211,153,0.15)',
    accent: '#34d399',
    btnBg: 'rgba(52,211,153,0.15)',
    btnBorder: 'rgba(52,211,153,0.35)',
    tag: 'Phone Cases & More',
    headline: ['Protect Your', 'Phone in Style'],
    sub: 'Custom phone cases with original artwork. Fits most major models.',
    cta: 'Find Yours',
  },
  {
    bg: 'from-[#1a0000] to-[#0f0e17]',
    blob: 'rgba(251,113,133,0.15)',
    accent: '#fb7185',
    btnBg: 'rgba(251,113,133,0.15)',
    btnBorder: 'rgba(251,113,133,0.35)',
    tag: 'Gifts & Stationery',
    headline: ['Gifts They\'ll', 'Remember Forever'],
    sub: 'Notebooks, greeting cards & gifts with heart. Perfect for every occasion.',
    cta: 'Shop Gifts',
  },
];

function RedbubbleBanner() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const goTo = (i: number) => setCurrent((i + total) % total);

  const startAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 4000);
  };

  useEffect(() => {
    startAuto();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const slide = slides[current];

  return (
    <section className="py-10" aria-label="Featured Shop">
      <div className="container mx-auto px-4">
        {/* Label */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#e63946' }}
          />
          <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Featured on Redbubble
          </span>
        </div>

        {/* Banner */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: '#0f0e17', aspectRatio: '3/1', minHeight: 140 }}
          onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current); }}
          onMouseLeave={startAuto}
        >
          {/* Blob */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 70% 50%, ${slide.blob} 0%, transparent 65%)`,
              transition: 'background 0.7s ease',
            }}
          />
          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center h-full px-8 md:px-12 gap-8">
            {/* Text */}
            <div className="flex flex-col gap-2 flex-1">
              <span
                className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
                style={{ color: slide.accent, transition: 'color 0.5s' }}
              >
                <span className="inline-block w-4 h-px" style={{ background: slide.accent }} />
                {slide.tag}
              </span>

              <h2
                className="font-bold leading-tight"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
                  color: '#f8fafc',
                }}
              >
                {slide.headline[0]}<br />
                <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{slide.headline[1]}</em>
              </h2>

              <p
                className="text-slate-400 leading-relaxed"
                style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.82rem)', maxWidth: '28ch' }}
              >
                {slide.sub}
              </p>

              <a
                href={REDBUBBLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full font-medium transition-all hover:-translate-y-0.5"
                style={{
                  marginTop: '0.25rem',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  background: slide.btnBg,
                  color: slide.accent,
                  border: `1px solid ${slide.btnBorder}`,
                  width: 'fit-content',
                  textDecoration: 'none',
                }}
              >
                {slide.cta}
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Decorative emoji/icon area */}
            <div
              className="hidden md:flex items-center justify-center flex-shrink-0 rounded-xl"
              style={{
                width: '22%',
                height: '75%',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${slide.btnBorder}`,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              }}
            >
              {['🎨', '🖼️', '👕', '📱', '🎁'][current]}
            </div>
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={() => { goTo(current - 1); startAuto(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:bg-white/20"
            style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            aria-label="Previous"
          >
            <ArrowRight size={13} className="text-white rotate-180" />
          </button>
          <button
            onClick={() => { goTo(current + 1); startAuto(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:bg-white/20"
            style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            aria-label="Next"
          >
            <ArrowRight size={13} className="text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); startAuto(); }}
                aria-label={`Go to slide ${i + 1}`}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  background: i === current ? '#fff' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePageClient({ locale, localizedToolContent }: HomePageClientProps) {
  const t = useTranslations();
  const allTools = getAllTools();
  const popularTools = getPopularTools();

  const features = [
    {
      icon: ShieldCheck,
      titleKey: 'home.features.privacy.title',
      descriptionKey: 'home.features.privacy.description',
      color: 'text-green-500',
    },
    {
      icon: Zap,
      titleKey: 'home.features.free.title',
      descriptionKey: 'home.features.free.description',
      color: 'text-yellow-500',
    },
    {
      icon: Wrench,
      titleKey: 'home.features.powerful.title',
      descriptionKey: 'home.features.powerful.description',
      color: 'text-blue-500',
    },
  ];

  const categoryIcons: Record<ToolCategory, typeof Edit> = {
    'edit-annotate': Edit,
    'convert-to-pdf': FileImage,
    'convert-from-pdf': FileImage,
    'organize-manage': FolderOpen,
    'optimize-repair': Settings,
    'secure-pdf': ShieldCheck,
  };

  const categoryTranslationKeys: Record<ToolCategory, string> = {
    'edit-annotate': 'editAnnotate',
    'convert-to-pdf': 'convertToPdf',
    'convert-from-pdf': 'convertFromPdf',
    'organize-manage': 'organizeManage',
    'optimize-repair': 'optimizeRepair',
    'secure-pdf': 'securePdf',
  };

  const categoryOrder: ToolCategory[] = [
    'edit-annotate',
    'convert-to-pdf',
    'convert-from-pdf',
    'organize-manage',
    'optimize-repair',
    'secure-pdf',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--color-background))]">
      <Header locale={locale} />

      <main id="main-content" className="flex-1 relative" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28"
          aria-labelledby="hero-title"
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--color-primary)/0.2)] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[hsl(var(--color-accent)/0.2)] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-[hsl(var(--color-secondary)/0.3)] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[hsl(var(--color-background)/0.8)] border border-[hsl(var(--color-primary)/0.2)] shadow-sm backdrop-blur-md transition-all hover:bg-[hsl(var(--color-background))]">
                <Sparkles className="h-4 w-4 text-[hsl(var(--color-primary))]" aria-hidden="true" />
                <span className="text-sm font-medium text-[hsl(var(--color-primary))]">
                  {t('common.brand')}
                </span>
              </div>

              <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-[hsl(var(--color-foreground))]">{t('home.hero.title')} </span>
                <span className="text-gradient block mt-1 pb-2">{t('home.hero.highlight')}</span>
              </h1>

              <p className="text-lg text-[hsl(var(--color-muted-foreground))] mb-8 max-w-2xl mx-auto leading-relaxed">
                {t('home.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={`/${locale}/tools`}>
                  <Button variant="primary" size="lg" className="h-11 px-8 text-base shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5">
                    {t('home.hero.cta')}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))] bg-[hsl(var(--color-background)/0.5)] px-4 py-2 rounded-full border border-[hsl(var(--color-border))] backdrop-blur-sm">
                  <Lock className="h-4 w-4 text-green-500" aria-hidden="true" />
                  <span>{t('common.footer.privacyBadge')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 relative z-20" aria-label="Features">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-6 text-center glass-card border-0 hover:-translate-y-1 transition-transform duration-300" hover={false}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[hsl(var(--color-primary)/0.1)] mb-4 text-[hsl(var(--color-primary))]">
                      <Icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-[hsl(var(--color-foreground))] mb-2">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] leading-relaxed">
                      {t(feature.descriptionKey)}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Tools Section */}
        <section className="py-16 bg-[hsl(var(--color-muted)/0.5)]" aria-labelledby="popular-tools-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[hsl(var(--color-primary)/0.1)] border border-[hsl(var(--color-primary)/0.2)]">
                <Star className="h-4 w-4 text-[hsl(var(--color-primary))]" aria-hidden="true" />
                <span className="text-sm font-medium text-[hsl(var(--color-primary))]">
                  {t('home.popularTools.badge')}
                </span>
              </div>
              <h2 id="popular-tools-heading" className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-3">
                {t('home.popularTools.title')}
              </h2>
              <p className="text-[hsl(var(--color-muted-foreground))] max-w-2xl mx-auto text-base">
                {t('home.popularTools.description')}
              </p>
            </div>
            <ToolGrid
              tools={popularTools}
              locale={locale}
              localizedToolContent={localizedToolContent}
            />
          </div>
        </section>

        <section className="py-16" aria-labelledby="featured-tools-heading">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div className="max-w-2xl">
                <h2 id="featured-tools-heading" className="text-2xl font-bold text-[hsl(var(--color-foreground))] mb-2">
                  {t(`home.categories.${categoryTranslationKeys['organize-manage']}`)}
                </h2>
                <p className="text-[hsl(var(--color-muted-foreground))] text-base">
                  {t(`home.categoriesDescription.${categoryTranslationKeys['organize-manage']}`)}
                </p>
              </div>
              <Link href={`/${locale}/tools`}>
                <Button variant="outline" size="sm" className="group">
                  {t('common.navigation.tools')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
            </div>
            <ToolGrid
              tools={getToolsByCategory('organize-manage').slice(0, 8)}
              locale={locale}
              localizedToolContent={localizedToolContent}
            />
          </div>
        </section>

        {/* Tool Categories Section */}
        <section className="py-16 bg-[hsl(var(--color-muted)/0.3)]" aria-labelledby="categories-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 id="categories-heading" className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-3">
                {t('home.categoriesSection.title')}
              </h2>
              <p className="text-[hsl(var(--color-muted-foreground))] max-w-2xl mx-auto text-base">
                {t('home.categoriesSection.description', { count: allTools.length })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryOrder.map((category) => {
                const categoryTools = getToolsByCategory(category);
                const Icon = categoryIcons[category];
                const categoryName = t(`home.categories.${categoryTranslationKeys[category]}`);
                const categoryDescription = t(`home.categoriesDescription.${categoryTranslationKeys[category]}`);

                return (
                  <Link
                    key={category}
                    href={`/${locale}/tools?category=${category}`}
                    className="group"
                  >
                    <Card className="p-5 h-full glass-card hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-[hsl(var(--color-border)/0.6)]">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[hsl(var(--color-primary)/0.1)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-5 w-5 text-[hsl(var(--color-primary))]" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-[hsl(var(--color-foreground))] mb-1 group-hover:text-[hsl(var(--color-primary))] transition-colors">
                            {categoryName}
                          </h3>
                          <p className="text-xs text-[hsl(var(--color-muted-foreground))] line-clamp-2 mb-2">
                            {categoryDescription}
                          </p>
                          <div className="flex items-center text-xs font-medium text-[hsl(var(--color-primary))]">
                            <span className="bg-[hsl(var(--color-primary)/0.1)] px-2 py-0.5 rounded-md">
                              {t('home.categoriesSection.toolsCount', { count: categoryTools.length })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16" aria-label="Statistics">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[hsl(var(--color-border))]">
              <div className="p-4">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">
                  {allTools.length}+
                </div>
                <div className="text-xs font-medium text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider">
                  {t('home.stats.pdfTools')}
                </div>
              </div>
              <div className="p-4">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">
                  100%
                </div>
                <div className="text-xs font-medium text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider">
                  {t('home.stats.freeToUse')}
                </div>
              </div>
              <div className="p-4">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">
                  9
                </div>
                <div className="text-xs font-medium text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider">
                  {t('home.stats.languages')}
                </div>
              </div>
              <div className="p-4">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">
                  0
                </div>
                <div className="text-xs font-medium text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider">
                  {t('home.stats.filesUploaded')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Redbubble Banner ── */}
        <RedbubbleBanner />

      </main>

      <Footer locale={locale} />
    </div>
  );
}
