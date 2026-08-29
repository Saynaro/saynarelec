import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SERVICES_SEO_DATA } from '@/lib/services-data';
import { LanguageProvider, useLang } from '@/lib/i18n';
import SEO from '@/components/SEO';
import FAQ from '@/components/site/FAQ';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';
import { ArrowLeft, CheckCircle2, ChevronRight, Zap, Shield, Mail, Phone } from 'lucide-react';

function ServicePageContent() {
  const { slug } = useParams();
  const { t, lang } = useLang();

  // Find service by slug or alias
  let service = SERVICES_SEO_DATA[slug];
  if (!service) {
    for (const key in SERVICES_SEO_DATA) {
      if (SERVICES_SEO_DATA[key].aliases?.includes(slug)) {
        service = SERVICES_SEO_DATA[key];
        break;
      }
    }
  }

  if (!service) {
    return <Navigate to="/#services" replace />;
  }

  const otherServices = Object.values(SERVICES_SEO_DATA).filter((s) => s.slug !== service.slug);

  // Schema.org Structured Data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://saynarelec.com/services/${service.slug}#service`,
        "name": service.h1,
        "serviceType": service.badge,
        "description": service.metaDescription,
        "provider": {
          "@type": "Electrician",
          "name": "Saynarelec",
          "url": "https://saynarelec.com/",
          "telephone": "",
          "email": "contact@saynarelec.com",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "BE"
          }
        },
        "areaServed": {
          "@type": "Country",
          "name": "Belgium"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Accueil",
            "item": "https://saynarelec.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": "https://saynarelec.com/#services"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": service.h1,
            "item": `https://saynarelec.com/services/${service.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": service.faqs.map((faq) => ({
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

  return (
    <div className="bg-warm min-h-screen">
      <SEO
        title={service.title}
        description={service.metaDescription}
        canonical={`/services/${service.slug}`}
        ogImage={service.image}
        lang={lang}
        schema={serviceSchema}
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
            <Link to="/#services" className="hover:text-electric transition-colors">
              Services
            </Link>
            <ChevronRight size={14} />
            <span className="text-navy font-medium truncate max-w-[200px] sm:max-w-none">
              {service.h1}
            </span>
          </nav>
        </div>

        {/* Hero Banner */}
        <section className="max-w-[1400px] mx-auto px-5 md:px-10 mb-16 md:mb-24">
          <div className="grid grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-solar" />
                <span className="text-solar font-bold tracking-label text-[11px] uppercase">
                  {service.badge}
                </span>
              </div>

              <h1 className="font-heading font-semibold tracking-tightest text-navy text-3xl sm:text-5xl lg:text-6xl leading-[1.02] mb-6">
                {service.h1}
              </h1>

              <p className="text-lg sm:text-xl text-navy/80 leading-relaxed mb-8">
                {service.lead}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="bg-electric text-white px-8 py-4 text-xs font-bold uppercase tracking-label hover:bg-navy transition-all shadow-lg shadow-electric/20 inline-flex items-center gap-2"
                >
                  Demander un devis gratuit →
                </a>
                <a
                  href="mailto:contact@saynarelec.com"
                  className="border border-navy/20 text-navy px-6 py-4 text-xs font-bold uppercase tracking-label hover:border-electric hover:text-electric transition-all inline-flex items-center gap-2"
                >
                  <Mail size={16} /> Contact direct
                </a>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-navy/10 aspect-[4/3] bg-navy/5">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium bg-navy/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
                  ⚡ Intervention certifiée conforme RGIE en Belgique
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Checklist */}
        <section className="bg-white py-16 border-y border-navy/10">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-navy mb-8">
              Ce que comprend notre prestation en Belgique :
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {service.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-warm/50 border border-navy/5"
                >
                  <CheckCircle2 size={20} className="text-solar shrink-0 mt-0.5" />
                  <span className="text-navy/85 text-sm sm:text-base leading-relaxed font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24 space-y-12">
          {service.sections.map((sec, idx) => (
            <div key={idx} className="max-w-3xl">
              <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-navy mb-4">
                {sec.title}
              </h2>
              <p className="text-navy/75 text-base sm:text-lg leading-relaxed">
                {sec.text}
              </p>
            </div>
          ))}
        </section>

        {/* Service FAQ */}
        <FAQ customFaqs={service.faqs} />

        {/* Related Services Internal Links */}
        <section className="py-16 md:py-24 bg-white border-t border-navy/10">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-px bg-solar" />
              <span className="text-solar font-bold tracking-label text-[11px] uppercase">
                AUTRES SERVICES SAYNARELEC
              </span>
            </div>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-navy mb-8">
              Découvrez nos autres prestations d'électricité en Belgique
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServices.map((other) => (
                <Link
                  key={other.slug}
                  to={`/services/${other.slug}`}
                  className="group p-6 rounded-2xl bg-warm/60 border border-navy/10 hover:border-electric transition-all flex flex-col justify-between hover:shadow-lg"
                >
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-navy group-hover:text-electric transition-colors mb-2">
                      {other.h1}
                    </h3>
                    <p className="text-xs sm:text-sm text-navy/70 line-clamp-2">
                      {other.metaDescription}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-bold uppercase tracking-label text-electric inline-flex items-center gap-1">
                    En savoir plus <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ServicePage() {
  return <ServicePageContent />;
}
