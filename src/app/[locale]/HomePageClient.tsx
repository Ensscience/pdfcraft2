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

/* ───────────────────────── REDBUBBLE DATA ───────────────────────── */

const REDBUBBLE_URL = 'https://www.redbubble.com/people/Zaydroid/shop?asc=u';

const rbProducts = [
  {
    img: "https://ih1.redbubble.net/image.5331582477.18061806,flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
    link: "https://www.redbubble.com/i/hat/Baby-Eat-Sleep-Be-Cute-by-Zaydroid/180561806.4sgw",
  },
  {
    img: "https://ih1.redbubble.net/image.5331582477.18061806,flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
    link: "https://www.redbubble.com/i/bucket-hat/Baby-Eat-Sleep-Be-Cute-by-Zaydroid/180561806.3vy7",
  },
];

/* ───────────────────────── SIDE BANNERS ───────────────────────── */

function RedbubbleSideBanners() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % rbProducts.length);
    }, 3500);

    return () => clearInterval(t);
  }, []);

  const left = rbProducts[index % rbProducts.length];
  const right = rbProducts[(index + 1) % rbProducts.length];

  return (
    <div className="hidden xl:block">
      {/* LEFT */}
      <a
        href={left.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-4 top-40 z-30"
      >
        <img
          src={left.img}
          alt="Redbubble product"
          className="w-40 rounded-xl shadow-xl hover:scale-105 transition-transform"
        />
      </a>

      {/* RIGHT */}
      <a
        href={right.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-40 z-30"
      >
        <img
          src={right.img}
          alt="Redbubble product"
          className="w-40 rounded-xl shadow-xl hover:scale-105 transition-transform"
        />
      </a>
    </div>
  );
}

/* ───────────────────────── HERO BANNER (UNCHANGED) ───────────────────────── */

const slides = [
  {
    bg: 'from-[#1a0533] to-[#0f0e17]',
    blob: 'rgba(180,100,255,0.15)',
    accent: '#c084fc',
    btnBg: 'rgba(192,132,252,0.15)',
    btnBorder: 'rgba(192,132,252,0.35)',
    tag: 'Unique Designs',
    headline: ['Wear Art', "You'll Love"],
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
    sub: 'Gallery-worthy prints delivered to your door.',
    cta: 'Browse Prints',
  },
];

function RedbubbleBanner() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = slides.length;

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 4000);
  };

  useEffect(() => {
    start();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const slide = slides[current];

  return (
    <section className="py-10 relative z-20">
      <div className="container mx-auto px-4">

        <div className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: '#0f0e17', aspectRatio: '3/1' }}>

          <div className="relative z-10 flex items-center h-full px-8">

            <div>
              <h2 className="text-white font-bold text-xl">
                {slide.headline[0]} <br />
                <span className="italic font-normal">{slide.headline[1]}</span>
              </h2>

              <p className="text-gray-400 text-sm mt-2">{slide.sub}</p>

              <a
                href={REDBUBBLE_URL}
                target="_blank"
                className="inline-block mt-3 px-4 py-2 rounded-full text-sm"
                style={{
                  background: slide.btnBg,
                  color: slide.accent,
                  border: `1px solid ${slide.btnBorder}`,
                }}
              >
                {slide.cta} <ArrowRight className="inline ml-1 w-3 h-3" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

/* ───────────────────────── MAIN PAGE ───────────────────────── */

export default function HomePageClient({ locale }: { locale: string }) {

  const t = useTranslations();

  const allTools = getAllTools();
  const popularTools = getPopularTools();

  const features = [
    { icon: ShieldCheck, titleKey: 'home.features.privacy.title', descriptionKey: 'home.features.privacy.description', color: 'text-green-500' },
    { icon: Zap, titleKey: 'home.features.free.title', descriptionKey: 'home.features.free.description', color: 'text-yellow-500' },
    { icon: Wrench, titleKey: 'home.features.powerful.title', descriptionKey: 'home.features.powerful.description', color: 'text-blue-500' },
  ];

  const categoryIcons: Record<ToolCategory, any> = {
    'edit-annotate': Edit,
    'convert-to-pdf': FileImage,
    'convert-from-pdf': FileImage,
    'organize-manage': FolderOpen,
    'optimize-repair': Settings,
    'secure-pdf': ShieldCheck,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <Header locale={locale} />

      <main className="flex-1 relative">

        {/* SIDE ADS */}
        <RedbubbleSideBanners />

        {/* HERO */}
        <section className="pt-20 pb-20">
          <div className="container mx-auto px-4 text-center">

            <h1 className="text-5xl font-bold">
              {t('home.hero.title')}
            </h1>

          </div>
        </section>

        {/* REDBUBBLE BANNER */}
        <RedbubbleBanner />

        {/* REST OF YOUR PAGE (unchanged) */}
        {/* ToolGrid, categories, etc... */}

      </main>

      <Footer locale={locale} />
    </div>
  );
}
