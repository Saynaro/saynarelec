import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import EditField from './cms/EditField';

export default function Header() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const nav = [
    { label: t('nav_services'), href: '#services' },
    { label: t('nav_realisations'), href: '#realisations' },
    { label: t('nav_about'), href: '#about' },
    { label: t('nav_contact'), href: '#contact' },
  ];

  const go = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const LangSwitch = ({ className = '' }) => (
    <div className={`flex items-center gap-1.5 text-xs font-bold ${className}`}>
      {['fr', 'nl', 'en'].map((l, idx) => (
        <React.Fragment key={l}>
          {idx > 0 && <span className="text-navy/30">/</span>}
          <button
            onClick={() => setLang(l)}
            className={`transition-colors uppercase ${lang === l ? 'text-electric' : 'text-navy/40 hover:text-navy'}`}
          >
            {l}
          </button>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-warm/95 backdrop-blur-md border-b border-navy/10 py-3 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between gap-4">
        <button onClick={() => go('#top')} className="text-left leading-none">
          <span className="block font-heading font-bold tracking-tightest text-electric text-lg md:text-xl">
            {t('brand')}
          </span>
          <span className="block text-[9px] md:text-[10px] tracking-label uppercase text-navy/55 mt-1">
            {t('descriptor')}
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-7 text-[13px] font-medium uppercase tracking-label text-navy">
            {nav.map((n) => (
              <li key={n.href}>
                <button onClick={() => go(n.href)} className="hover:text-solar transition-colors cursor-pointer">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>

          <LangSwitch className="border-l border-navy/20 pl-6" />

          <button
            onClick={() => go('#contact')}
            className="bg-electric text-white px-5 py-3 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            {t('cta_quote')} →
          </button>
        </nav>

        {/* Mobile Actions (Lang switch + Animated Burger button) */}
        <div className="lg:hidden flex items-center gap-3">
          <LangSwitch />
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative w-9 h-9 flex items-center justify-center text-navy p-1 transition-transform active:scale-95 cursor-pointer"
            aria-label="Menu"
          >
            <span
              className={`absolute transition-all duration-300 transform ${
                open ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
              }`}
            >
              <Menu size={22} />
            </span>
            <span
              className={`absolute transition-all duration-300 transform ${
                open ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
              }`}
            >
              <X size={22} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Menu with smooth cubic-bezier slide */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          open ? 'max-h-[380px] opacity-100 mt-3 border-t border-navy/10' : 'max-h-0 opacity-0 mt-0 border-t-0'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="bg-warm/95 backdrop-blur-md px-5 py-3 shadow-lg">
          <ul className="flex flex-col">
            {nav.map((n, i) => (
              <li
                key={n.href}
                className={`border-b border-navy/10 last:border-0 transform transition-all duration-300 ${
                  open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                }`}
                style={{
                  transitionDelay: open ? `${i * 45}ms` : '0ms',
                }}
              >
                <button
                  onClick={() => go(n.href)}
                  className="w-full text-left py-3.5 text-sm font-medium uppercase tracking-label text-navy hover:text-electric active:text-solar transition-colors cursor-pointer"
                >
                  {n.label}
                </button>
              </li>
            ))}
            <li
              className={`pt-3 pb-2 transform transition-all duration-300 ${
                open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
              }`}
              style={{
                transitionDelay: open ? `${nav.length * 45}ms` : '0ms',
              }}
            >
              <button
                onClick={() => go('#contact')}
                className="w-full bg-electric text-white px-5 py-3.5 text-[12px] font-bold uppercase tracking-label hover:bg-navy active:scale-[0.99] transition-all cursor-pointer shadow-xs"
              >
                {t('cta_quote')} →
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}