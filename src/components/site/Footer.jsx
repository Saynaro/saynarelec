import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content';
import EditField from './cms/EditField';
import AdminLogin from './cms/AdminLogin';

export default function Footer() {
  const { t, lang, setLang } = useLang();
  const { isAdmin, logout } = useContent();
  const [loginOpen, setLoginOpen] = useState(false);

  const go = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const nav = [
    { label: t('nav_services'), href: '#services' },
    { label: t('nav_realisations'), href: '#realisations' },
    { label: t('nav_about'), href: '#about' },
    { label: t('nav_contact'), href: '#contact' },
  ];

  const handleAdmin = () => {
    if (isAdmin) logout();
    else setLoginOpen(true);
  };

  return (
    <footer className="bg-electric text-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-20 grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-5">
          <div className="font-heading font-bold tracking-tightest text-3xl">
            <EditField k="footer_brand" as="span" />
          </div>
          <div className="text-[10px] tracking-label uppercase text-solar mt-2">
            <EditField k="footer_descriptor" as="span" />
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold">
            {['fr', 'nl', 'en'].map((l, idx) => (
              <React.Fragment key={l}>
                {idx > 0 && <span className="text-white/30">/</span>}
                <button
                  onClick={() => setLang(l)}
                  className={`transition-colors uppercase ${lang === l ? 'text-solar' : 'text-white/40'}`}
                >
                  {l}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="col-span-6 md:col-span-3">
          <div className="text-[10px] uppercase tracking-label text-white/40 mb-4">
            <EditField k="footer_nav" as="span" />
          </div>
          <ul className="space-y-3">
            {nav.map((n) => (
              <li key={n.href}>
                <button onClick={() => go(n.href)} className="text-white/80 hover:text-solar transition-colors text-sm">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-6 md:col-span-4">
          <div className="text-[10px] uppercase tracking-label text-white/40 mb-4">
            <EditField k="footer_contact" as="span" />
          </div>
          <a href={`mailto:${t('contact_email')}`} className="text-white hover:text-solar transition-colors break-all">
            {t('contact_email')}
          </a>
          <div className="mt-6 flex flex-col gap-2 text-sm">
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
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <span className="flex items-center gap-2">
            © {new Date().getFullYear()} Saynarelec — <EditField k="footer_rights" as="span" />
            <button
              onClick={handleAdmin}
              className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-solar transition-colors"
              aria-label="Espace administrateur"
              title="Espace administrateur"
            />
          </span>
          <span className="tracking-label uppercase text-[10px]">Électricité · Solaire · Belgique</span>
        </div>
      </div>

      <AdminLogin open={loginOpen} onClose={() => setLoginOpen(false)} />
    </footer>
  );
}