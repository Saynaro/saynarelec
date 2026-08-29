import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content';
import { SERVICES_SEO_DATA } from '@/lib/services-data';
import SEO from '@/components/SEO';
import FAQ from '@/components/site/FAQ';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import AdminBar from '@/components/site/cms/AdminBar';
import EditableText from '@/components/site/cms/EditableText';
import EditableImage from '@/components/site/cms/EditableImage';
import { CheckCircle2, ChevronRight, Mail, Plus, Trash2 } from 'lucide-react';

const UI_TEXTS = {
  fr: {
    home: "Accueil",
    services: "Services",
    cta_quote: "Demander un devis gratuit →",
    cta_contact: "Contact direct",
    badge_img: "Intervention certifiée conforme RGIE en Belgique",
    checklist_title: "Ce que comprend notre prestation en Belgique :",
    add_highlight: "Ajouter un point",
    add_section: "Ajouter une section détaillée",
    other_label: "AUTRES SERVICES SAYNARELEC",
    other_title: "Découvrez nos autres prestations d'électricité en Belgique",
    learn_more: "En savoir plus",
    banner_q: "Besoin d'un devis pour ce projet ?",
    banner_desc: "Contactez Saynarelec dès aujourd'hui pour une estimation claire et rapide de vos travaux.",
    banner_cta: "Demander un devis en ligne →",
  },
  nl: {
    home: "Home",
    services: "Diensten",
    cta_quote: "Gratis offerte aanvragen →",
    cta_contact: "Direct contact",
    badge_img: "Gecertificeerde installatie conform het AREI in België",
    checklist_title: "Wat onze dienst in België omvat:",
    add_highlight: "Punt toevoegen",
    add_section: "Gedetailleerde sectie toevoegen",
    other_label: "ANDERE SAYNARELEC DIENSTEN",
    other_title: "Ontdek onze overige elektriciteitsdiensten in België",
    learn_more: "Meer informatie",
    banner_q: "Offerte nodig voor dit project?",
    banner_desc: "Neem vandaag contact op met Saynarelec voor een snelle en transparante schatting van uw werken.",
    banner_cta: "Online offerte aanvragen →",
  },
  en: {
    home: "Home",
    services: "Services",
    cta_quote: "Request a free quote →",
    cta_contact: "Direct contact",
    badge_img: "Certified RGIE-compliant electrical service in Belgium",
    checklist_title: "What our electrical service in Belgium includes:",
    add_highlight: "Add item",
    add_section: "Add detailed section",
    other_label: "OTHER SAYNARELEC SERVICES",
    other_title: "Discover our other electrical services across Belgium",
    learn_more: "Learn more",
    banner_q: "Need a quote for this project?",
    banner_desc: "Contact Saynarelec today for a fast, clear, and comprehensive estimate of your project.",
    banner_cta: "Request a quote online →",
  },
};

function ServicePageContent() {
  const { slug } = useParams();
  const { lang } = useLang();
  const { isAdmin, getServicePage, updateServicePage } = useContent();
  const ui = UI_TEXTS[lang] || UI_TEXTS.fr;

  const service = getServicePage(slug);

  if (!service || !service.slug) {
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
            "name": ui.home,
            "item": "https://saynarelec.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": ui.services,
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
        "mainEntity": (service.faqs || []).map((faq) => ({
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

  // Highlights handlers
  const handleUpdateHighlight = (idx, val) => {
    const list = [...(service.highlights || [])];
    list[idx] = val;
    updateServicePage(service.slug, { highlights: list });
  };

  const handleAddHighlight = () => {
    const defaultText =
      lang === 'nl'
        ? "Nieuw voordeel van deze dienst"
        : lang === 'en'
        ? "New advantage of this service"
        : "Nouvel avantage de la prestation";
    const list = [...(service.highlights || []), defaultText];
    updateServicePage(service.slug, { highlights: list });
  };

  const handleDeleteHighlight = (idx) => {
    const list = (service.highlights || []).filter((_, i) => i !== idx);
    updateServicePage(service.slug, { highlights: list });
  };

  // Detailed Sections handlers
  const handleUpdateSectionTitle = (idx, val) => {
    const sections = [...(service.sections || [])];
    sections[idx] = { ...sections[idx], title: val };
    updateServicePage(service.slug, { sections });
  };

  const handleUpdateSectionText = (idx, val) => {
    const sections = [...(service.sections || [])];
    sections[idx] = { ...sections[idx], text: val };
    updateServicePage(service.slug, { sections });
  };

  const handleAddSection = () => {
    const title =
      lang === 'nl'
        ? "Nieuwe sectietitel"
        : lang === 'en'
        ? "New section title"
        : "Nouveau titre de section";
    const text =
      lang === 'nl'
        ? "Schrijf hier de gedetailleerde uitleg voor deze dienst..."
        : lang === 'en'
        ? "Write the detailed explanation for this service here..."
        : "Rédigez ici le paragraphe explicatif détaillé pour cette prestation...";
    const sections = [
      ...(service.sections || []),
      { title, text }
    ];
    updateServicePage(service.slug, { sections });
  };

  const handleDeleteSection = (idx) => {
    const sections = (service.sections || []).filter((_, i) => i !== idx);
    updateServicePage(service.slug, { sections });
  };

  const resolveText = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || val.fr || val.nl || val.en || '';
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
              {ui.home}
            </Link>
            <ChevronRight size={14} />
            <Link to="/#services" className="hover:text-electric transition-colors">
              {ui.services}
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
                <EditableText
                  as="span"
                  label="Badge de la prestation"
                  value={service.badge}
                  onChange={(v) => updateServicePage(service.slug, { badge: v })}
                  className="text-solar font-bold tracking-label text-[11px] uppercase"
                />
              </div>

              <h1 className="font-heading font-semibold tracking-tightest text-navy text-3xl sm:text-5xl lg:text-6xl leading-[1.02] mb-6">
                <EditableText
                  as="span"
                  label="Titre H1 de la prestation"
                  value={service.h1}
                  onChange={(v) => updateServicePage(service.slug, { h1: v })}
                />
              </h1>

              <div className="text-lg sm:text-xl text-navy/80 leading-relaxed mb-8">
                <EditableText
                  as="p"
                  multiline
                  label="Texte d'introduction / résumé"
                  value={service.lead}
                  onChange={(v) => updateServicePage(service.slug, { lead: v })}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="bg-electric text-white px-8 py-4 text-xs font-bold uppercase tracking-label hover:bg-navy transition-all shadow-lg shadow-electric/20 inline-flex items-center gap-2"
                >
                  {ui.cta_quote}
                </Link>
                <a
                  href="mailto:contact@saynarelec.com"
                  className="border border-navy/20 text-navy px-6 py-4 text-xs font-bold uppercase tracking-label hover:border-electric hover:text-electric transition-all inline-flex items-center gap-2"
                >
                  <Mail size={16} /> {ui.cta_contact}
                </a>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-navy/10 aspect-[4/3] bg-navy/5">
                <EditableImage
                  src={service.image}
                  alt={service.alt || service.h1}
                  onChange={(url) => updateServicePage(service.slug, { image: url })}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium bg-navy/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 pointer-events-none">
                  {ui.badge_img}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Checklist */}
        <section className="bg-white py-16 border-y border-navy/10">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-navy">
                {ui.checklist_title}
              </h2>
              {isAdmin && (
                <button
                  onClick={handleAddHighlight}
                  className="inline-flex items-center gap-1.5 bg-electric text-white text-xs px-3.5 py-2 uppercase tracking-label font-bold hover:bg-navy transition-colors shrink-0 cursor-pointer"
                >
                  <Plus size={14} /> {ui.add_highlight}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {(service.highlights || []).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3.5 p-4 rounded-xl bg-warm/50 border border-navy/5"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <CheckCircle2 size={20} className="text-solar shrink-0 mt-0.5" />
                    <EditableText
                      as="span"
                      value={item}
                      onChange={(v) => handleUpdateHighlight(idx, v)}
                      className="text-navy/85 text-sm sm:text-base leading-relaxed font-medium flex-1"
                    />
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteHighlight(idx)}
                      className="p-1 text-red-400/70 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                      title="Supprimer ce point"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24 space-y-12">
          {(service.sections || []).map((sec, idx) => (
            <div key={idx} className="max-w-3xl relative p-4 -ml-4 rounded-2xl hover:bg-white/40 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-navy flex-1">
                  <EditableText
                    as="span"
                    value={sec.title}
                    onChange={(v) => handleUpdateSectionTitle(idx, v)}
                  />
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteSection(idx)}
                    className="p-1 text-red-400/70 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                    title="Supprimer cette section"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="text-navy/75 text-base sm:text-lg leading-relaxed">
                <EditableText
                  as="p"
                  multiline
                  value={sec.text}
                  onChange={(v) => handleUpdateSectionText(idx, v)}
                />
              </div>
            </div>
          ))}

          {isAdmin && (
            <div className="pt-2">
              <button
                onClick={handleAddSection}
                className="inline-flex items-center gap-2 border border-dashed border-navy/30 hover:border-electric text-navy/70 hover:text-electric px-6 py-3 text-xs font-bold uppercase tracking-label transition-all bg-white cursor-pointer"
              >
                <Plus size={16} /> {ui.add_section}
              </button>
            </div>
          )}
        </section>

        {/* Service FAQ with full CMS edit support */}
        <FAQ
          customFaqs={service.faqs || []}
          onUpdateCustomFaqs={(faqs) => updateServicePage(service.slug, { faqs })}
        />

        {/* Related Services Internal Links */}
        <section className="py-16 md:py-24 bg-white border-t border-navy/10">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-px bg-solar" />
              <span className="text-solar font-bold tracking-label text-[11px] uppercase">
                {ui.other_label}
              </span>
            </div>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-navy mb-8">
              {ui.other_title}
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
                      {resolveText(other.h1)}
                    </h3>
                    <p className="text-xs sm:text-sm text-navy/70 line-clamp-2">
                      {resolveText(other.metaDescription)}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-bold uppercase tracking-label text-electric inline-flex items-center gap-1">
                    {ui.learn_more} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AdminBar />
    </div>
  );
}

export default function ServicePage() {
  return <ServicePageContent />;
}
