'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { SECTION_NAME } from '@/lib/site';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ododex-theme', next);
    } catch {
      // Ignorer si localStorage non accessible
    }
  };

  return (
    <header className="border-b border-line bg-surface/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/fr" className="font-extrabold text-lg tracking-tight text-fg hover:text-accent transition-colors">
            Ododex
          </a>
          <span className="text-line font-light">/</span>
          <Link href="/" className="font-medium text-sm text-secondary hover:text-fg transition-colors">
            {SECTION_NAME}
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Changer le thème"
          className="p-2 rounded-lg text-secondary hover:text-fg hover:bg-elevated transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-warning" />}
        </button>
      </div>
    </header>
  );
}
