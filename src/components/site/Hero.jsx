import React from 'react';
import { useContent } from '@/lib/content';
import { HERO_IMG } from '@/lib/content-defaults';
import EditableImage from './cms/EditableImage';
import EditField from './cms/EditField';
import CountUpStat from '@/components/ui/CountUpStat';
import Reveal from './Reveal';

export default function Hero() {
  const { img, setImage, t, isAdmin } = useContent();
  const go = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative bg-warm pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-navy/10" />
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="col-span-12 lg:col-span-5 relative z-10 order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-solar" />
            <EditField k="hero_label" as="span" className="text-solar font-bold tracking-label text-[11px] uppercase" />
          </div>

          <h1 className="font-heading font-semibold leading-[0.92] tracking-tightest text-navy text-[52px] sm:text-6xl md:text-7xl xl:text-[88px]">
            <EditField k="hero_title_1" as="span" /><br />
            <span className="text-electric"><EditField k="hero_title_2" as="span" /></span>
          </h1>

          <EditField k="hero_text" as="p" multiline className="mt-7 text-lg md:text-xl text-navy/75 max-w-md leading-relaxed" />

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <div
              role="button"
              tabIndex={0}
              onClick={() => go('#contact')}
              onKeyDown={(e) => e.key === 'Enter' && go('#contact')}
              className="bg-electric text-white px-7 py-4 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <EditField k="hero_cta_primary" as="span" /> →
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => go('#services')}
              onKeyDown={(e) => e.key === 'Enter' && go('#services')}
              className="border border-navy/25 text-navy px-7 py-4 text-[12px] font-bold uppercase tracking-label hover:border-electric hover:text-electric transition-all inline-flex items-center justify-center cursor-pointer select-none"
            >
              <EditField k="hero_cta_secondary" as="span" />
            </div>
          </div>

          <div className="mt-12 w-full flex items-center justify-around sm:justify-start sm:items-baseline gap-4 sm:gap-10 md:gap-14 border-t border-navy/15 pt-7">
            <div className="flex-1 sm:flex-initial text-center sm:text-left flex flex-col items-center sm:items-start">
              {isAdmin
                ? <EditField k="stat_years" as="span" className="block font-heading font-bold text-5xl md:text-6xl text-navy leading-none" />
                : <CountUpStat value={t('stat_years')} className="block font-heading font-bold text-5xl md:text-6xl text-navy leading-none" delay={200} />}
              <div className="mt-2 text-center sm:text-left">
                <EditField k="stat_years_label" as="span" className="block text-[10px] uppercase tracking-label text-navy/55" />
                <EditField k="stat_years_sub" as="span" className="block text-[10px] text-navy/55 lowercase tracking-normal" />
              </div>
            </div>
            <div className="w-px h-12 bg-navy/15 shrink-0" />
            <div className="flex-1 sm:flex-initial text-center sm:text-left flex flex-col items-center sm:items-start">
              {isAdmin
                ? <EditField k="stat_clients" as="span" className="block font-heading font-bold text-5xl md:text-6xl text-electric leading-none" />
                : <CountUpStat value={t('stat_clients')} className="block font-heading font-bold text-5xl md:text-6xl text-electric leading-none" delay={400} />}
              <div className="mt-2 text-center sm:text-left">
                <EditField k="stat_clients_label" as="span" className="block text-[10px] uppercase tracking-label text-navy/55" />
                <EditField k="stat_clients_sub" as="span" className="block text-[10px] text-navy/55 lowercase tracking-normal" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 order-1 lg:order-2 relative">
          <Reveal className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6] w-full overflow-hidden">
            <EditableImage
              src={img('hero_image') || HERO_IMG}
              alt="Installation électrique Saynarelec"
              onChange={(url) => setImage('hero_image', url)}
              className="w-full h-full"
            />
            <div className="absolute -bottom-px -right-px w-20 h-20 border-b-2 border-r-2 border-solar pointer-events-none" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}