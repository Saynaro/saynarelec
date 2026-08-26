import React from 'react';
import { useContent } from '@/lib/content';
import { ABOUT_IMG } from '@/lib/content-defaults';
import EditableImage from './cms/EditableImage';
import EditField from './cms/EditField';
import Reveal from './Reveal';

export default function About() {
  const { img, setImage } = useContent();

  return (
    <section id="about" className="bg-skyblue py-20 md:py-28 border-t border-navy/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-12 gap-6 md:gap-10 items-center">
        <Reveal className="col-span-12 lg:col-span-5 order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <EditableImage
              src={img('about_image') || ABOUT_IMG}
              alt="Ibragim Sainaro — Saynarelec"
              onChange={(url) => setImage('about_image', url)}
              className="w-full h-full"
            />
            <div className="absolute -top-px -left-px w-20 h-20 border-t-2 border-l-2 border-solar pointer-events-none" />
          </div>
        </Reveal>

        <div className="col-span-12 lg:col-span-7 order-1 lg:order-2 lg:pl-8">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-solar" />
              <EditField k="about_label" as="span" className="text-solar font-bold tracking-label text-[11px] uppercase" />
            </div>
            <h2 className="font-heading font-semibold tracking-tightest text-navy text-3xl md:text-5xl xl:text-6xl leading-[0.98]">
              <EditField k="about_title" as="span" />
            </h2>
            <EditField k="about_text" as="p" multiline className="mt-7 text-lg md:text-xl text-navy/75 max-w-xl leading-relaxed" />

            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-electric flex items-center justify-center text-white font-heading font-bold text-lg">IS</div>
              <div>
                <EditField k="about_owner" as="div" className="font-heading font-semibold text-navy text-lg" />
                <EditField k="about_role" as="div" className="text-sm text-navy/60" />
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-12 grid grid-cols-2 gap-6 border-t border-navy/15 pt-8" delay={120}>
            <div>
              <EditField k="about_years_num" as="span" className="block font-heading font-bold text-6xl md:text-7xl text-electric leading-none" />
              <EditField k="about_years_label" as="span" className="block text-[10px] uppercase tracking-label text-navy/55 mt-3" />
            </div>
            <div>
              <EditField k="about_clients_num" as="span" className="block font-heading font-bold text-6xl md:text-7xl text-navy leading-none" />
              <EditField k="about_clients_label" as="span" className="block text-[10px] uppercase tracking-label text-navy/55 mt-3" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}