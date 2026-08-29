import React from 'react';
import { Link } from 'react-router-dom';
import { LanguageProvider, useLang } from '@/lib/i18n';
import { ContentProvider } from '@/lib/content';
import SEO from '@/components/SEO';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import Contact from '@/components/site/Contact';
import { ChevronRight, MapPin, Mail, Clock, ShieldCheck } from 'lucide-react';

function ContactPageContent() {
  const { t, lang } = useLang();

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://saynarelec.com/contact#webpage",
    "url": "https://saynarelec.com/contact",
    "name": "Contact & Devis Gratuit — Saynarelec Belgique",
    "description": "Formulaire de contact et demande de devis gratuit pour tous travaux d'électricité générale et énergie solaire en Belgique.",
    "mainEntity": {
      "@type": "Electrician",
      "name": "Saynarelec",
      "email": "contact@saynarelec.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BE"
      },
      "areaServed": "Belgium"
    }
  };

  return (
    <div className="bg-warm min-h-screen">
      <SEO
        title="Contact & Devis Gratuit Électricité en Belgique | Saynarelec"
        description="Contactez Saynarelec pour vos projets d'électricité générale, rénovation, conformité RGIE, dépannage ou panneaux solaires en Belgique. Devis gratuit sous 24h/48h."
        canonical="/contact"
        lang={lang}
        schema={contactSchema}
      />

      <Header />

      <main className="pt-28 md:pt-36">
        {/* Breadcrumb Navigation */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-navy/60">
            <Link to="/" className="hover:text-electric transition-colors">
              Accueil
            </Link>
            <ChevronRight size={14} />
            <span className="text-navy font-medium">Contact & Devis</span>
          </nav>
        </div>

        {/* Intro Banner */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-px bg-solar" />
            <span className="text-solar font-bold tracking-label text-[11px] uppercase">
              DEVIS GRATUIT & SANS ENGAGEMENT
            </span>
          </div>
          <h1 className="font-heading font-semibold tracking-tightest text-navy text-3xl sm:text-5xl lg:text-6xl leading-[1.02]">
            Contactez l'entreprise Saynarelec
          </h1>
          <p className="mt-4 text-navy/75 text-base sm:text-lg max-w-2xl">
            Une question sur une mise en conformité RGIE, un dépannage urgent ou un projet complet d'installation électrique et solaire ? Remplissez notre formulaire ci-dessous ou écrivez-nous.
          </p>
        </div>

        {/* Reusable Contact Form & Info */}
        <Contact />

        {/* Additional Local & Assurance Info */}
        <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-navy/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-solar/10 flex items-center justify-center text-solar shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-navy mb-1">Zone d'intervention</h2>
                <p className="text-xs sm:text-sm text-navy/70 leading-relaxed">
                  Toute la Belgique : Bruxelles, Brabant wallon, Liège, Namur, Charleroi, Hainaut et Flandre.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-navy/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-solar/10 flex items-center justify-center text-solar shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-navy mb-1">Délai de réponse</h2>
                <p className="text-xs sm:text-sm text-navy/70 leading-relaxed">
                  Réponse à toutes les demandes de devis et renseignements sous 24h à 48h ouvrées.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-navy/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-solar/10 flex items-center justify-center text-solar shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-navy mb-1">Conformité & Garantie</h2>
                <p className="text-xs sm:text-sm text-navy/70 leading-relaxed">
                  Travaux certifiés selon les normes RGIE avec assurance décennale et équipement garanti.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return <ContactPageContent />;
}
