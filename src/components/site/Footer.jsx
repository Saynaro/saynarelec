import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content';
import EditField from './cms/EditField';
import AdminLogin from './cms/AdminLogin';

const FOOTER_TEXTS = {
  fr: {
    bio: "Entreprise d'électricité générale et solaire en Belgique. Installations fiables, rénovations et mises en conformité RGIE pour particuliers et professionnels.",
    quote: "Devis en ligne",
    services_heading: "Nos Prestations",
    area: "Intervention partout en Belgique : Bruxelles, Liège, Namur, Charleroi, Flandre.",
    tagline: "Électricité · Solaire · Belgique",
    services: [
      { label: 'Électricité générale', href: '/services/electricite-generale' },
      { label: 'Rénovation électrique', href: '/services/renovation-electrique' },
      { label: 'Mise en conformité RGIE', href: '/services/mise-en-conformite' },
      { label: 'Dépannage d\'urgence', href: '/services/depannage-electrique' },
      { label: 'Éclairage LED & design', href: '/services/eclairage' },
      { label: 'Panneaux photovoltaïques', href: '/services/panneaux-solaires' },
    ],
  },
  nl: {
    bio: "Specialist in algemene elektriciteit en zonne-energie in België. Betrouwbare installaties, renovaties en AREI-conformiteit voor particulieren en bedrijven.",
    quote: "Online offerte",
    services_heading: "Onze Diensten",
    area: "Werkzaam in heel België: Brussel, Luik, Namen, Charleroi, Vlaanderen.",
    tagline: "Elektriciteit · Zonne-energie · België",
    services: [
      { label: 'Algemene elektriciteit', href: '/services/electricite-generale' },
      { label: 'Elektrische renovatie', href: '/services/renovation-electrique' },
      { label: 'AREI-conformiteit', href: '/services/mise-en-conformite' },
      { label: 'Snelle depannage', href: '/services/depannage-electrique' },
      { label: 'Led- & designverlichting', href: '/services/eclairage' },
      { label: 'Zonnepanelen', href: '/services/panneaux-solaires' },
    ],
  },
  en: {
    bio: "General electricity and solar energy company in Belgium. Reliable installations, rewiring renovations, and RGIE compliance for homes and businesses.",
    quote: "Online quote",
    services_heading: "Our Services",
    area: "Active across Belgium: Brussels, Liège, Namur, Charleroi, Flanders.",
    tagline: "Electricity · Solar · Belgium",
    services: [
      { label: 'General electricity', href: '/services/electricite-generale' },
      { label: 'Electrical renovation', href: '/services/renovation-electrique' },
      { label: 'RGIE compliance', href: '/services/mise-en-conformite' },
      { label: 'Emergency repairs', href: '/services/depannage-electrique' },
      { label: 'LED & lighting design', href: '/services/eclairage' },
      { label: 'Solar panels', href: '/services/panneaux-solaires' },
    ],
  },
};

export default function Footer() {
  const { t, lang, setLang } = useLang();
  const { isAdmin, logout } = useContent();
  const [loginOpen, setLoginOpen] = useState(false);

  const fTexts = FOOTER_TEXTS[lang] || FOOTER_TEXTS.fr;

  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const onScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight - 350;
      if (scrollPos >= threshold) {
        if (metaTheme) metaTheme.setAttribute('content', '#123B66');
      } else {
        if (metaTheme) metaTheme.setAttribute('content', '#F7F5F0');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (metaTheme) metaTheme.setAttribute('content', '#F7F5F0');
    };
  }, []);

  const go = (href) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/${href}`;
    }
  };

  const nav = [
    { label: t('nav_services'), href: '#services' },
    { label: t('nav_realisations'), href: '#realisations' },
    { label: t('nav_about'), href: '#about' },
    { label: t('nav_reviews'), href: '#reviews' },
    { label: t('nav_contact'), href: '#contact' },
  ];

  const handleAdmin = () => {
    if (isAdmin) logout();
    else setLoginOpen(true);
  };

  return (
    <footer id="footer" className="bg-electric text-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-20 grid grid-cols-12 gap-8 md:gap-10">
        {/* Col 1: Brand & Bio */}
        <div className="col-span-12 md:col-span-4 lg:col-span-4">
          <div className="font-heading font-bold tracking-tightest text-3xl">
            <EditField k="footer_brand" as="span" />
          </div>
          <div className="text-[10px] tracking-label uppercase text-solar mt-2 font-bold">
            <EditField k="footer_descriptor" as="span" />
          </div>
          <p className="text-white/70 text-xs sm:text-sm mt-4 leading-relaxed max-w-sm">
            {fTexts.bio}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold">
            {['fr', 'nl', 'en'].map((l, idx) => (
              <React.Fragment key={l}>
                {idx > 0 && <span className="text-white/30">/</span>}
                <button
                  onClick={() => setLang(l)}
                  className={`transition-colors uppercase cursor-pointer ${lang === l ? 'text-solar font-bold' : 'text-white/40 hover:text-white'}`}
                >
                  {l}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="col-span-6 md:col-span-2 lg:col-span-2">
          <div className="text-[10px] uppercase tracking-label text-white/40 mb-4 font-bold">
            <EditField k="footer_nav" as="span" />
          </div>
          <ul className="space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <button onClick={() => go(n.href)} className="text-white/80 hover:text-solar transition-colors text-xs sm:text-sm cursor-pointer">
                  {n.label}
                </button>
              </li>
            ))}
            <li>
              <Link to="/contact" className="text-white/80 hover:text-solar transition-colors text-xs sm:text-sm">
                {fTexts.quote}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Services (SEO internal linking) */}
        <div className="col-span-6 md:col-span-3 lg:col-span-3">
          <div className="text-[10px] uppercase tracking-label text-white/40 mb-4 font-bold">
            {fTexts.services_heading}
          </div>
          <ul className="space-y-2 text-xs sm:text-sm">
            {fTexts.services.map((s) => (
              <li key={s.href}>
                <Link to={s.href} className="text-white/80 hover:text-solar transition-colors">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact & Legal */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3">
          <div className="text-[10px] uppercase tracking-label text-white/40 mb-4 font-bold">
            <EditField k="footer_contact" as="span" />
          </div>
          <a
            href={`mailto:${t('contact_email')}`}
            className="text-white hover:text-solar transition-colors font-medium text-sm break-all block"
          >
            {t('contact_email')}
          </a>
          <p className="text-white/60 text-xs mt-2">
            {fTexts.area}
          </p>
          <div className="mt-6 flex flex-col gap-2 text-xs sm:text-sm">
            <Link to="/mentions-legales" className="text-white/70 hover:text-solar transition-colors">
              {t('footer_legal')}
            </Link>
            <Link to="/politique-confidentialite" className="text-white/70 hover:text-solar transition-colors">
              {t('footer_privacy')}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <span className="flex items-center gap-2">
            © {new Date().getFullYear()} Saynarelec — <EditField k="footer_rights" as="span" />
            <button
              onClick={handleAdmin}
              className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-solar transition-colors"
              aria-label="Espace administrateur"
              title="Espace administrateur"
            />
          </span>
          <span className="tracking-label uppercase text-[10px]">{fTexts.tagline}</span>
        </div>
      </div>

      <AdminLogin open={loginOpen} onClose={() => setLoginOpen(false)} />
    </footer>
  );
}