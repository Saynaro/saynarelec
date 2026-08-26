import React from 'react';
import { useContent } from '@/lib/content';
import { SOLAR_IMG } from '@/lib/content-defaults';
import EditableImage from './cms/EditableImage';
import EditField from './cms/EditField';
import Reveal from './Reveal';

export default function SolarSection() {
  const { img, setImage } = useContent();
  const go = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-skyblue py-20 md:py-28 border-t border-navy/10 relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 opacity-[0.06] hidden md:block">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="250" y1="250" x2={250 + 240 * Math.cos((i * Math.PI) / 12)} y2={250 + 240 * Math.sin((i * Math.PI) / 12)} stroke="#123B66" strokeWidth="1" />
          ))}
          <circle cx="250" cy="250" r="60" stroke="#123B66" strokeWidth="1" />
          <circle cx="250" cy="250" r="120" stroke="#123B66" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-12 gap-6 md:gap-12 items-center relative">
        <Reveal className="col-span-12 lg:col-span-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-solar" />
            <EditField k="solar_label" as="span" className="text-solar font-bold tracking-label text-[11px] uppercase" />
          </div>
          <h2 className="font-heading font-semibold tracking-tightest text-navy text-4xl md:text-6xl leading-[0.95]">
            <EditField k="solar_title" as="span" />
          </h2>
          <EditField k="solar_text" as="p" multiline className="mt-7 text-lg md:text-xl text-navy/75 max-w-md leading-relaxed" />
          <div
            role="button"
            tabIndex={0}
            onClick={() => go('#contact')}
            onKeyDown={(e) => e.key === 'Enter' && go('#contact')}
            className="mt-9 bg-solar text-navy px-7 py-4 text-[12px] font-bold uppercase tracking-label hover:bg-electric hover:text-white transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer select-none"
          >
            <EditField k="solar_cta" as="span" /> →
          </div>
        </Reveal>

        <Reveal className="col-span-12 lg:col-span-6" delay={120}>
          <div className="relative aspect-[16/11] w-full overflow-hidden">
            <EditableImage
              src={img('solar_image') || SOLAR_IMG}
              alt="Panneaux solaires Saynarelec"
              onChange={(url) => setImage('solar_image', url)}
              className="w-full h-full"
            />
            <div className="absolute -bottom-px -left-px w-24 h-24 border-b-2 border-l-2 border-solar pointer-events-none" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}