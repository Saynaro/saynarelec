import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import SEO from '@/components/SEO';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import Contact from '@/components/site/Contact';
import { ChevronRight, MapPin, Clock, ShieldCheck } from 'lucide-react';

const CONTACT_TEXTS = {
  fr: {
    seo_title: "Contact & Devis Gratuit Électricité en Belgique | Saynarelec",
    seo_desc: "Contactez Saynarelec pour vos projets d'électricité générale, rénovation, conformité RGIE, dépannage ou panneaux solaires en Belgique. Devis gratuit sous 24h/48h.",
    home: "Accueil",
    contact_breadcrumb: "Contact & Devis",
    badge: "DEVIS GRATUIT & SANS ENGAGEMENT",
    title: "Contactez l'entreprise Saynarelec",
    lead: "Une question sur une mise en conformité RGIE, un dépannage urgent ou un projet complet d'installation électrique et solaire ? Remplissez notre formulaire ci-dessous ou écrivez-nous.",
    area_title: "Zone d'intervention",
    area_desc: "Toute la Belgique : Bruxelles, Brabant wallon, Liège, Namur, Charleroi, Hainaut et Flandre.",
    time_title: "Délai de réponse",
    time_desc: "Réponse à toutes les demandes de devis et renseignements sous 24h à 48h ouvrées.",
    cert_title: "Conformité & Garantie",
    cert_desc: "Travaux certifiés selon les normes RGIE avec assurance décennale et équipement garanti.",
  },
  nl: {
    seo_title: "Contact & Gratis Offerte Elektriciteit in België | Saynarelec",
    seo_desc: "Neem contact op met Saynarelec voor algemene elektriciteit, renovatie, AREI-conformiteit, depannage of zonnepanelen in België. Gratis offerte binnen 24-48u.",
    home: "Home",
    contact_breadcrumb: "Contact & Offerte",
    badge: "GRATIS & VRIJBLIJVENDE OFFERTE",
    title: "Neem contact op met Saynarelec",
    lead: "Een vraag over een AREI-keuring, dringende depannage of een compleet project voor elektriciteit en zonne-energie? Vul ons formulier in of stuur een e-mail.",
    area_title: "Werkgebied",
    area_desc: "Heel België: Brussel, Waals-Brabant, Luik, Namen, Charleroi, Henegouwen en Vlaanderen.",
    time_title: "Reactietijd",
    time_desc: "Antwoord op alle offerte-aanvragen en vragen binnen 24 tot 48 werkuren.",
    cert_title: "Garantie & AREI-normen",
    cert_desc: "Werken uitgevoerd conform het AREI met professionele aansprakelijkheid en kwaliteitsgarantie.",
  },
  en: {
    seo_title: "Contact & Free Electrical Quote in Belgium | Saynarelec",
    seo_desc: "Contact Saynarelec for general electricity, renovation, RGIE compliance, emergency repairs, or solar panels in Belgium. Free quote within 24-48 business hours.",
    home: "Home",
    contact_breadcrumb: "Contact & Quote",
    badge: "FREE & NO-OBLIGATION QUOTE",
    title: "Contact Saynarelec",
    lead: "Have a question about RGIE compliance, emergency troubleshooting, or a complete electrical and solar project? Fill out our form below or email us.",
    area_title: "Service Area",
    area_desc: "Across Belgium: Brussels, Walloon Brabant, Liège, Namur, Charleroi, Hainaut, and Flanders.",
    time_title: "Response Time",
    time_desc: "Prompt response to all quote requests and inquiries within 24 to 48 business hours.",
    cert_title: "Compliance & Warranty",
    cert_desc: "Works strictly certified to Belgian RGIE standards with 10-year liability and manufacturer warranties.",
  },
};

function ContactPageContent() {
  const { lang } = useLang();
  const t = CONTACT_TEXTS[lang] || CONTACT_TEXTS.fr;

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://saynarelec.com/contact#webpage",
    "url": "https://saynarelec.com/contact",
    "name": t.seo_title,
    "description": t.seo_desc,
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
        title={t.seo_title}
        description={t.seo_desc}
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
              {t.home}
            </Link>
            <ChevronRight size={14} />
            <span className="text-navy font-medium">{t.contact_breadcrumb}</span>
          </nav>
        </div>

        {/* Intro Banner */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-px bg-solar" />
            <span className="text-solar font-bold tracking-label text-[11px] uppercase">
              {t.badge}
            </span>
          </div>
          <h1 className="font-heading font-semibold tracking-tightest text-navy text-3xl sm:text-5xl lg:text-6xl leading-[1.02]">
            {t.title}
          </h1>
          <p className="mt-4 text-navy/75 text-base sm:text-lg max-w-2xl">
            {t.lead}
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
                <h2 className="font-heading font-semibold text-lg text-navy mb-1">{t.area_title}</h2>
                <p className="text-xs sm:text-sm text-navy/70 leading-relaxed">
                  {t.area_desc}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-navy/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-solar/10 flex items-center justify-center text-solar shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-navy mb-1">{t.time_title}</h2>
                <p className="text-xs sm:text-sm text-navy/70 leading-relaxed">
                  {t.time_desc}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-navy/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-solar/10 flex items-center justify-center text-solar shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-navy mb-1">{t.cert_title}</h2>
                <p className="text-xs sm:text-sm text-navy/70 leading-relaxed">
                  {t.cert_desc}
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
