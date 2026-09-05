import React from 'react';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content';
import SEO from '@/components/SEO';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import Services from '@/components/site/Services';
import About from '@/components/site/About';
import Realisations from '@/components/site/Realisations';
import SolarSection from '@/components/site/SolarSection';
import Process from '@/components/site/Process';
import Reviews from '@/components/site/Reviews';
import FAQ from '@/components/site/FAQ';
import FinalCTA from '@/components/site/FinalCTA';
import Contact from '@/components/site/Contact';
import Footer from '@/components/site/Footer';
import AdminBar from '@/components/site/cms/AdminBar';

function HomeContent() {
  const { lang, t } = useLang();
  const { faqs } = useContent();

  const currentFaqs = faqs || [];

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://saynarelec.com/#website",
        "url": "https://saynarelec.com/",
        "name": "Saynarelec",
        "alternateName": ["SAYNARELEC", "Saynarelec Belgique", "Entreprise Saynarelec"],
        "description": "Entreprise d'électricité générale, rénovation, conformité RGIE et énergie solaire en Belgique.",
        "inLanguage": lang === 'nl' ? 'nl-BE' : lang === 'en' ? 'en-GB' : 'fr-BE'
      },
      {
        "@type": "Electrician",
        "@id": "https://saynarelec.com/#organization",
        "name": "Saynarelec",
        "alternateName": "SAYNARELEC",
        "url": "https://saynarelec.com/",
        "logo": "https://saynarelec.com/android-chrome-512x512.png",
        "image": "https://res.cloudinary.com/q6lr90ky/image/upload/v1787783960/byntvhslvv75kzdgjr7c.jpg",
        "email": "contact@saynarelec.com",
        "priceRange": "€€",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BE"
        },
        "areaServed": [
          { "@type": "Country", "name": "Belgium" },
          { "@type": "City", "name": "Bruxelles" },
          { "@type": "City", "name": "Liège" },
          { "@type": "City", "name": "Charleroi" },
          { "@type": "City", "name": "Namur" }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "48",
          "bestRating": "5",
          "worstRating": "1"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Prestations Saynarelec",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Électricité générale Belgique",
                "url": "https://saynarelec.com/services/electricite-generale"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Rénovation électrique",
                "url": "https://saynarelec.com/services/renovation-electrique"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Mise en conformité RGIE",
                "url": "https://saynarelec.com/services/mise-en-conformite"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Dépannage électrique",
                "url": "https://saynarelec.com/services/depannage-electrique"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Panneaux solaires photovoltaïques",
                "url": "https://saynarelec.com/services/panneaux-solaires"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": currentFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  const titles = {
    fr: "Saynarelec — Électricien & Entreprise d'Électricité en Belgique",
    nl: "Saynarelec — Elektricien & Elektriciteitsbedrijf in België",
    en: "Saynarelec — Certified Electrician & Solar Company in Belgium",
  };

  const descriptions = {
    fr: "Saynarelec est votre entreprise d'électricité générale et solaire en Belgique. Rénovation électrique, conformité RGIE, dépannage rapide et pose de panneaux solaires. Devis gratuit.",
    nl: "Saynarelec is uw specialist in algemene elektriciteit en zonne-energie in België. AREI-gelijkvormigheid, renovatie, depannage en zonnepanelen. Gratis offerte.",
    en: "Saynarelec provides professional electrical installation, RGIE compliance, electrical renovation, emergency repairs, and solar panels in Belgium. Free quote.",
  };

  return (
    <div className="bg-warm min-h-screen overflow-x-hidden w-full max-w-[100vw]">
      <SEO
        title={titles[lang] || titles.fr}
        description={descriptions[lang] || descriptions.fr}
        canonical="/"
        lang={lang}
        schema={homeSchema}
      />
      <Header />
      <main className="overflow-x-hidden w-full">
        <Hero />
        <Services />
        <About />
        <Realisations />
        <SolarSection />
        <Process />
        <Reviews />
        <FAQ />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
      <AdminBar />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}