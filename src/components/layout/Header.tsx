'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Menu, X, Command, Github } from 'lucide-react';
import { type Locale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';
import { RecentFilesDropdown } from '@/components/common/RecentFilesDropdown';
import { searchTools, SearchResult } from '@/lib/utils/search';
import { getToolContent } from '@/config/tool-content';
import { getAllTools } from '@/config/tools';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export interface HeaderProps {
  locale: Locale;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ locale, showSearch = true }) => {
  const t = useTranslations('common');
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localizedTools, setLocalizedTools] = useState<Record<string, { title: string; description: string }>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allTools = getAllTools();
    const contentMap: Record<string, { title: string; description: string }> = {};
    allTools.forEach(tool => {
      const content = getToolContent(locale, tool.id);
      if (content) {
        contentMap[tool.id] = { title: content.title, description: content.metaDescription };
      }
    });
    setLocalizedTools(contentMap);
  }, [locale]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery, localizedTools);
      setSearchResults(results.slice(0, 8));
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [searchQuery, localizedTools]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigateToTool(searchResults[selectedIndex].tool.slug);
      } else if (searchResults.length > 0) {
        navigateToTool(searchResults[0].tool.slug);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchResults, selectedIndex]);

  const navigateToTool = useCallback((slug: string) => {
    router.push(`/${locale}/tools/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [locale, router]);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleMobileMenuToggle = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);

  const getToolIcon = (category: string) => {
    const icons: Record<string, string> = {
      'edit-annotate': '✏️', 'convert-to-pdf': '📄', 'convert-from-pdf': '🖼️',
      'organize-manage': '📁', 'optimize-repair': '🔧', 'secure-pdf': '🔒',
    };
    return icons[category] || '📄';
  };

  const navItems = [
    { href: `/${locale}`, label: t('navigation.home') },
    { href: `/${locale}/tools`, label: t('navigation.tools') },
    { href: `/${locale}/workflow`, label: t('navigation.workflow') || 'Workflow' },
    { href: `/${locale}/about`, label: t('navigation.about') },
    { href: `/${locale}/faq`, label: t('navigation.faq') },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-[hsl(var(--color-background))]/80 backdrop-blur-md border-b border-[hsl(var(--color-border))/0.5] shadow-sm'
        : 'bg-transparent border-transparent'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-24 md:h-20 items-center justify-between">
          {/* Logo and Brand Section - Aligned Center Vertically */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link
              href={`/${locale}`}
              className="group flex items-center gap-2.5 text-xl font-bold text-[hsl(var(--color-foreground))] hover:opacity-90 transition-opacity"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF2800] shadow-lg shadow-red-500/30 transition-transform group-hover:scale-105">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-xl tracking-tight font-bold">
                <span className="text-[#FF2800]">Yes</span>Convert
              </span>
            </Link>

            {/* Ko-fi Mobile SVG Icon - PERFECTLY CENTERED UNDER LOGO ICON */}
            <a 
              href="https://ko-fi.com/ensscience" 
              target="_blank" 
              rel="noopener noreferrer"
              className="md:hidden transition-transform active:scale-95"
              aria-label="Support on Ko-fi"
            >
              <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-[#FF2800] bg-white shadow-sm flex items-center justify-center p-1">
                <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 2.318.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" fill="#FF2800"/>
                </svg>
              </div>
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center gap-1 rounded-full border border-[hsl(var(--color-border))/0.4] bg-[hsl(var(--color-background))/0.5] p-1.5 backdrop-blur-sm shadow-sm transition-all duration-300 ${isSearchOpen ? 'opacity-0 translate-y-[-10px] pointer-events-none' : 'opacity-100'}`}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="px-4 py-1.5 text-sm font-medium text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))/0.5] rounded-full transition-all">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions Section */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <a href="https://ko-fi.com/ensscience" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5E5B] hover:bg-[#ff4642] text-white text-xs font-semibold transition-all shadow-sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 2.318.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/></svg>
              Buy me a coffee
            </a>

            {showSearch && (
              <div className="relative" ref={searchContainerRef}>
                {isSearchOpen ? (
                  <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-[22px] md:top-1/2 md:-translate-y-1/2 z-50 animate-in fade-in">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
                      <input ref={searchInputRef} type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder={t('search.placeholder')} className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] shadow-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))]" />
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={handleSearchToggle} className="text-[hsl(var(--color-muted-foreground))]">
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="md:hidden" onClick={handleMobileMenuToggle}>{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))]">
            <ul className="flex flex-col gap-2 p-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block px-4 py-3 text-base font-medium text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))] rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
