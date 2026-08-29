import React, { useState } from 'react';
import { useLang } from '@/lib/i18n';
import Reveal from './Reveal';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const faqData = {
  fr: [
    {
      q: "Dans quelles régions de Belgique l'entreprise Saynarelec intervient-elle ?",
      a: "Saynarelec intervient dans toute la Belgique, notamment en région bruxelloise (Bruxelles-Capitale), en Wallonie (Liège, Namur, Charleroi, Brabant wallon, Mons) et en Flandre, que ce soit pour des chantiers résidentiels ou professionnels."
    },
    {
      q: "Qu'est-ce que la mise en conformité RGIE et quand est-elle obligatoire en Belgique ?",
      a: "Le RGIE (Règlement Général sur les Installations Électriques) est la norme officielle en Belgique. Un contrôle de conformité est obligatoire lors de la vente d'un bien immobilier, lors d'une modification importante du tableau électrique, pour un nouveau compteur ou tous les 25 ans. Saynarelec réalise l'audit, remet aux normes votre installation et prépare le passage de l'organisme de contrôle agréé."
    },
    {
      q: "Combien coûte une installation ou une rénovation électrique avec Saynarelec ?",
      a: "Le coût dépend de la superficie, de l'état du réseau existant, du nombre de points lumineux/prises et de la puissance requise. Saynarelec propose des devis gratuits, transparents et détaillés sans engagement après étude précise de votre projet."
    },
    {
      q: "Proposez-vous un service de dépannage électrique d'urgence ?",
      a: "Oui, Saynarelec assure la recherche de pannes, court-circuits, disjonctions intempestives et coupures de courant pour rétablir la sécurité et l'alimentation de vos installations dans les meilleurs délais."
    },
    {
      q: "Quelle est la rentabilité de l'installation de panneaux solaires en Belgique ?",
      a: "Avec les hausses tarifaires de l'électricité, une installation photovoltaïque bien dimensionnée permet de réduire drastiquement vos factures d'énergie avec un retour sur investissement moyen de 5 à 7 ans. Saynarelec dimensionne vos panneaux pour maximiser votre autoconsommation."
    },
    {
      q: "Comment demander un devis électrique à Saynarelec ?",
      a: "Vous pouvez nous contacter directement par e-mail à contact@saynarelec.com ou remplir le formulaire de contact sur notre site. Nous vous recontactons sous 24h à 48h pour fixer un rendez-vous ou étudier vos plans."
    }
  ],
  nl: [
    {
      q: "In welke regio's van België is Saynarelec actief?",
      a: "Saynarelec is actief in heel België, inclusief Brussel, Wallonië (Luik, Namen, Charleroi) en Vlaanderen, voor zowel particuliere als professionele projecten."
    },
    {
      q: "Wat is AREI-gelijkvormigheid en wanneer is het verplicht?",
      a: "Het AREI (Algemeen Reglement op de Elektrische Installaties) is de wettelijke norm in België. Een keuring is verplicht bij de verkoop van een woning, na grote renovaties of elke 25 jaar. Saynarelec brengt uw installatie volledig in orde voor de keuring."
    },
    {
      q: "Hoe vraag ik een gratis offerte aan bij Saynarelec?",
      a: "U kunt contact opnemen via het contactformulier of mailen naar contact@saynarelec.com. Wij nemen binnen 24-48 uur contact met u op."
    }
  ],
  en: [
    {
      q: "In which areas of Belgium does Saynarelec operate?",
      a: "Saynarelec operates across Belgium, including Brussels, Wallonia (Liège, Namur, Charleroi), and Flanders, for both residential and commercial electrical projects."
    },
    {
      q: "What is RGIE / AREI compliance and when is it mandatory?",
      a: "RGIE/AREI is the official Belgian regulation for electrical safety. Certification is mandatory when selling a property, upgrading an electrical panel, or every 25 years. Saynarelec upgrades your system to pass official inspection."
    },
    {
      q: "How can I request a free quote from Saynarelec?",
      a: "You can reach us via our online contact form or by emailing contact@saynarelec.com. We respond within 24 to 48 business hours."
    }
  ]
};

export default function FAQ({ customFaqs = null, className = "" }) {
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState(0);

  const currentLang = faqData[lang] ? lang : 'fr';
  const list = customFaqs || faqData[currentLang] || faqData.fr;

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className={`py-20 md:py-28 bg-warm border-t border-navy/10 ${className}`}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-solar" />
            <span className="text-solar font-bold tracking-label text-[11px] uppercase">
              {lang === 'nl' ? 'VEELGESTELDE VRAGEN' : lang === 'en' ? 'FREQUENTLY ASKED QUESTIONS' : 'FOIRE AUX QUESTIONS'}
            </span>
            <span className="w-6 h-px bg-solar" />
          </div>
          <h2 className="font-heading font-semibold tracking-tightest text-navy text-3xl sm:text-4xl md:text-5xl leading-[1.05]">
            {lang === 'nl' ? 'Vragen over uw elektriciteitswerken ?' : lang === 'en' ? 'Questions About Your Electrical Works ?' : 'Questions fréquentes sur nos services d\'électricité'}
          </h2>
          <p className="mt-4 text-navy/70 text-base md:text-lg">
            {lang === 'nl'
              ? 'Vind antwoorden op de meest gestelde vragen over onze diensten en normen in België.'
              : lang === 'en'
              ? 'Find clear answers regarding electrical standards, compliance, and quotes in Belgium.'
              : 'Tout ce que vous devez savoir sur la conformité RGIE, nos tarifs, délais et interventions en Belgique.'}
          </p>
        </Reveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {list.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal key={idx} delay={idx * 50}>
                <div
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-electric bg-white shadow-md' : 'border-navy/15 bg-white/60 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading font-medium text-navy text-lg sm:text-xl pr-2">
                      {item.q}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'bg-electric text-white rotate-180' : 'bg-navy/5 text-navy/60'
                      }`}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 px-5 sm:px-6 pb-6' : 'max-h-0 opacity-0 overflow-hidden px-5 sm:px-6 pb-0'
                    }`}
                  >
                    <div className="pt-2 border-t border-navy/10 text-navy/75 text-sm sm:text-base leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
