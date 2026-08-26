import React from 'react';
import { useContent } from '@/lib/content';
import EditField from './cms/EditField';
import Reveal from './Reveal';

export default function FinalCTA() {
  const go = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-electric py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 border-t-2 border-r-2 border-solar/80" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-solar/40" />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-solar" />
            <EditField k="hero_label" as="span" className="text-solar font-bold tracking-label text-[11px] uppercase" />
          </div>
          <h2 className="font-heading font-semibold tracking-tightest text-white text-4xl md:text-6xl xl:text-7xl leading-[0.95]">
            <EditField k="finalcta_title" as="span" />
          </h2>
          <div className="mt-7 text-lg md:text-xl text-white/75 max-w-xl leading-relaxed">
            <EditField k="finalcta_text" as="p" multiline />
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => go('#contact')}
            onKeyDown={(e) => e.key === 'Enter' && go('#contact')}
            className="mt-9 bg-solar text-navy px-8 py-4 text-[12px] font-bold uppercase tracking-label hover:bg-white transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer select-none"
          >
            <EditField k="finalcta_btn" as="span" /> →
          </div>
        </Reveal>
      </div>
    </section>
  );
}