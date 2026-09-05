import React, { useEffect, useRef } from 'react';
import { useLang } from '@/lib/i18n';
import Reveal from './Reveal';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ThumbsUp,
  Award,
  ExternalLink
} from 'lucide-react';

const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJP0DUpRj5wEcRi_n7x-KoYpw';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/waYmpQFWymGu6Pet9';

export default function Reviews() {
  const { lang, t } = useLang();
  const widgetContainerRef = useRef(null);

  useEffect(() => {
    const container = widgetContainerRef.current;
    if (!container) return;

    // Helper to keep strictly only one widget instance
    const deduplicateWidgets = () => {
      const widgets = container.querySelectorAll('.ti-widget');
      if (widgets.length > 1) {
        for (let i = 1; i < widgets.length; i++) {
          widgets[i].remove();
        }
      }
    };

    // If widget is already present, simply deduplicate
    if (container.querySelector('.ti-widget')) {
      deduplicateWidgets();
      return;
    }

    // Clean up any stale Trustindex loader scripts from document to prevent re-execution conflicts
    document.querySelectorAll('script[src*="cdn.trustindex.io/loader.js"]').forEach((s) => s.remove());

    // Inject the Trustindex script
    const script = document.createElement('script');
    script.src = 'https://cdn.trustindex.io/loader.js?382fc158037b8132742658aa902';
    script.async = true;
    script.defer = true;
    container.appendChild(script);

    // Observer to automatically strip any duplicate widget if injected by repeated execution
    const observer = new MutationObserver(() => {
      deduplicateWidgets();
    });

    observer.observe(container, { childList: true, subtree: false });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="reviews" className="bg-warm py-20 md:py-28 border-t border-navy/10 relative overflow-hidden">
      {/* Subtle architectural background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#123B66_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-solar" />
              <span className="text-solar font-bold tracking-label text-[11px] uppercase">
                {t('reviews_label')}
              </span>
            </div>
            <h2 className="font-heading font-semibold tracking-tightest text-navy text-3xl md:text-5xl xl:text-6xl leading-[0.98]">
              {t('reviews_title')}
            </h2>
            <p className="mt-4 text-base md:text-lg text-navy/70 max-w-2xl leading-relaxed">
              {t('reviews_subtitle')}
            </p>
          </Reveal>

          <Reveal delay={100} className="shrink-0">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-navy/15 hover:border-electric hover:text-electric text-navy px-5 py-3 text-xs font-bold uppercase tracking-label transition-all shadow-2xs group"
            >
              <span>{lang === 'nl' ? 'Bekijk op Google Maps' : lang === 'en' ? 'View on Google Maps' : 'Voir sur Google Maps'}</span>
              <ExternalLink size={13} className="text-solar group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Reveal>
        </div>

        {/* Trust Highlight Stats */}
        <Reveal delay={120} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 pb-8 border-b border-navy/15">
          <div className="flex items-center gap-3.5 bg-white/70 border border-navy/10 p-4">
            <div className="w-10 h-10 bg-electric/10 text-electric flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-navy">
                {lang === 'nl' ? '100% AREI-geslaagd' : lang === 'en' ? '100% Inspection Pass' : '100% Réussite RGIE'}
              </div>
              <div className="text-xs text-navy/60">
                {lang === 'nl' ? 'Gelijkvormigheidsattest gegarandeerd' : lang === 'en' ? 'Official compliance guaranteed' : 'Certificat de conformité garanti'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/70 border border-navy/10 p-4">
            <div className="w-10 h-10 bg-solar/15 text-navy flex items-center justify-center shrink-0">
              <ThumbsUp size={20} className="text-solar" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-navy">
                {lang === 'nl' ? '100% Tevreden klanten' : lang === 'en' ? '100% Satisfaction' : '100% Clients satisfaits'}
              </div>
              <div className="text-xs text-navy/60">
                {lang === 'nl' ? 'Strikte planning en schone werf' : lang === 'en' ? 'On-time delivery & clean worksite' : 'Délais respectés et chantier propre'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/70 border border-navy/10 p-4">
            <div className="w-10 h-10 bg-electric/10 text-electric flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-navy">
                {lang === 'nl' ? '5 Jaar ervaring' : lang === 'en' ? '5 Years Experience' : '5 Ans d\'expérience'}
              </div>
              <div className="text-xs text-navy/60">
                {lang === 'nl' ? 'Actief in heel België' : lang === 'en' ? 'Serving all of Belgium' : 'Partout en Belgique'}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Real Google Reviews via Trustindex Live Widget */}
        <Reveal delay={150} className="w-full">
          <div className="bg-white border border-navy/15 p-4 md:p-8 shadow-sm">
            <div
              ref={widgetContainerRef}
              className="trustindex-widget-container min-h-[160px] flex items-center justify-center w-full overflow-hidden"
            >
              {/* Trustindex script dynamically mounts here */}
            </div>
            <style>{`
              .trustindex-widget-container > .ti-widget:not(:first-of-type) {
                display: none !important;
              }
              .trustindex-widget-container > .ti-widget {
                width: 100% !important;
              }
            `}</style>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-navy/60 px-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>{lang === 'nl' ? 'Geverifieerd door Google Maps' : lang === 'en' ? 'Verified by Google Maps' : 'Avis certifiés via Google Maps'}</span>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric hover:text-solar font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>{lang === 'nl' ? 'Bekijk profiel op Google' : lang === 'en' ? 'View Google profile' : 'Voir le profil Google'}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
