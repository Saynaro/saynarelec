import { dictionaries } from '@/lib/i18n';
import { SERVICES_SEO_DATA } from '@/lib/services-data';

// ─── Рабочие Unsplash фото (электрика, солнечные панели, строительство) ───

export const HERO_IMG =
  'https://res.cloudinary.com/q6lr90ky/image/upload/v1787783960/byntvhslvv75kzdgjr7c.jpg';

export const ABOUT_IMG =
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=85';
  // инструменты электрика

export const SOLAR_IMG =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=85';
  // солнечные панели на крыше

export const REALISATION_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85', // 01 Tableau divisionnaire & coffret modulaire
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=85', // 02 Éclairage architectural & spots LED
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=85', // 03 Installation neuve & câblage
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&q=85', // 04 Énergie solaire & panneaux photovoltaïques
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=85', // 05 Dépannage & diagnostic électrique
];

export const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=1200&q=85', // 01 Électricité générale
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85', // 02 Rénovation électrique
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=85', // 03 Mise en conformité
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85', // 04 Dépannage
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=85', // 05 Éclairage
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&q=85', // 06 Panneaux solaires
];

const LANGS = ['fr', 'nl', 'en'];
const loc = (key) => Object.fromEntries(LANGS.map((l) => [l, dictionaries[l][key] ?? '']));

const REAL_COLSPANS = [7, 5, 5, 7, 6, 6];
const REAL_ROWSPANS = [44, 44, 48, 44, 44, 44];

const buildServices = () => {
  const len = dictionaries.fr.services.length;
  return Array.from({ length: len }, (_, i) => ({
    image: SERVICE_IMAGES[i] || '',
    name: Object.fromEntries(LANGS.map((l) => [l, dictionaries[l].services[i].name])),
    desc: Object.fromEntries(LANGS.map((l) => [l, dictionaries[l].services[i].desc])),
  }));
};

const buildRealisations = () => {
  const len = dictionaries.fr.real_projects.length;
  return Array.from({ length: len }, (_, i) => ({
    image: REALISATION_IMAGES[i] || '',
    cat: Object.fromEntries(LANGS.map((l) => [l, dictionaries[l].real_projects[i].cat])),
    desc: Object.fromEntries(LANGS.map((l) => [l, dictionaries[l].real_projects[i].desc])),
    colSpan: REAL_COLSPANS[i] || 6,
    rowSpan: REAL_ROWSPANS[i] || 36,
  }));
};

const buildProcessSteps = () => {
  const len = dictionaries.fr.process_steps.length;
  return Array.from({ length: len }, (_, i) => ({
    title: Object.fromEntries(LANGS.map((l) => [l, dictionaries[l].process_steps[i].title])),
    desc: Object.fromEntries(LANGS.map((l) => [l, dictionaries[l].process_steps[i].desc])),
  }));
};

const buildContactTypes = () => {
  const len = dictionaries.fr.contact_types.length;
  return Array.from({ length: len }, (_, i) =>
    Object.fromEntries(LANGS.map((l) => [l, dictionaries[l].contact_types[i]]))
  );
};

export const DEFAULT_FAQS = [
  {
    q: {
      fr: "Dans quelles régions de Belgique l'entreprise Saynarelec intervient-elle ?",
      nl: "In welke regio's van België is Saynarelec actief?",
      en: "In which areas of Belgium does Saynarelec operate?"
    },
    a: {
      fr: "Saynarelec intervient dans toute la Belgique, notamment en région bruxelloise (Bruxelles-Capitale), en Wallonie (Liège, Namur, Charleroi, Brabant wallon, Mons) et en Flandre, que ce soit pour des chantiers résidentiels ou professionnels.",
      nl: "Saynarelec is actief in heel België, inclusief Brussel, Wallonië (Luik, Namen, Charleroi) en Vlaanderen, voor zowel particuliere als professionele projecten.",
      en: "Saynarelec operates across Belgium, including Brussels, Wallonia (Liège, Namur, Charleroi), and Flanders, for both residential and commercial electrical projects."
    }
  },
  {
    q: {
      fr: "Qu'est-ce que la mise en conformité RGIE et quand est-elle obligatoire en Belgique ?",
      nl: "Wat is AREI-gelijkvormigheid en wanneer is het verplicht?",
      en: "What is RGIE / AREI compliance and when is it mandatory?"
    },
    a: {
      fr: "Le RGIE (Règlement Général sur les Installations Électriques) est la norme officielle en Belgique. Un contrôle de conformité est obligatoire lors de la vente d'un bien immobilier, lors d'une modification importante du tableau électrique, pour un nouveau compteur ou tous les 25 ans. Saynarelec réalise l'audit, remet aux normes votre installation et prépare le passage de l'organisme de contrôle agréé.",
      nl: "Het AREI (Algemeen Reglement op de Elektrische Installaties) is de wettelijke norm in België. Een keuring is verplicht bij de verkoop van een woning, na grote renovaties of elke 25 jaar. Saynarelec brengt uw installatie volledig in orde voor de keuring.",
      en: "RGIE/AREI is the official Belgian regulation for electrical safety. Certification is mandatory when selling a property, upgrading an electrical panel, or every 25 years. Saynarelec upgrades your system to pass official inspection."
    }
  },
  {
    q: {
      fr: "Combien coûte une installation ou une rénovation électrique avec Saynarelec ?",
      nl: "Hoeveel kost een elektrische installatie of renovatie?",
      en: "How much does an electrical installation or renovation cost?"
    },
    a: {
      fr: "Le coût dépend de la superficie, de l'état du réseau existant, du nombre de points lumineux/prises et de la puissance requise. Saynarelec propose des devis gratuits, transparents et détaillés sans engagement après étude précise de votre projet.",
      nl: "De kosten zijn afhankelijk van de oppervlakte, de staat van het netwerk en het aantal aansluitpunten. Saynarelec biedt gratis en transparante offertes op maat.",
      en: "The cost depends on the property size, condition of existing wiring, and required circuits. Saynarelec provides free, transparent, and detailed quotes without obligation."
    }
  },
  {
    q: {
      fr: "Proposez-vous un service de dépannage électrique d'urgence ?",
      nl: "Biedt u een noodhersteldienst aan?",
      en: "Do you offer emergency electrical repair services?"
    },
    a: {
      fr: "Oui, Saynarelec assure la recherche de pannes, court-circuits, disjonctions intempestives et coupures de courant pour rétablir la sécurité et l'alimentation de vos installations dans les meilleurs délais.",
      nl: "Ja, Saynarelec spoort kortsluitingen, stroomstoringen en defecte zekeringen snel op om de stroomvoorziening veilig te herstellen.",
      en: "Yes, Saynarelec provides diagnostic and troubleshooting services for short circuits, tripped breakers, and power outages to safely restore your electricity as quickly as possible."
    }
  },
  {
    q: {
      fr: "Quelle est la rentabilité de l'installation de panneaux solaires en Belgique ?",
      nl: "Wat is het rendement van zonnepanelen in België?",
      en: "What is the return on investment for solar panels in Belgium?"
    },
    a: {
      fr: "Avec les hausses tarifaires de l'électricité, une installation photovoltaïque bien dimensionnée permet de réduire drastiquement vos factures d'énergie avec un retour sur investissement moyen de 5 à 7 ans. Saynarelec dimensionne vos panneaux pour maximiser votre autoconsommation.",
      nl: "Een goed gedimensioneerde zonne-installatie verlaagt uw energierekening drastisch met een gemiddelde terugverdientijd van 5 tot 7 jaar.",
      en: "A properly sized photovoltaic solar installation significantly lowers energy bills with an average ROI of 5 to 7 years. Saynarelec optimizes your installation for maximum self-consumption."
    }
  },
  {
    q: {
      fr: "Comment demander un devis électrique à Saynarelec ?",
      nl: "Hoe vraag ik een gratis offerte aan bij Saynarelec?",
      en: "How can I request a free quote from Saynarelec?"
    },
    a: {
      fr: "Vous pouvez nous contacter directement par e-mail à contact@saynarelec.com ou remplir le formulaire de contact sur notre site. Nous vous recontactons sous 24h à 48h pour fixer un rendez-vous ou étudier vos plans.",
      nl: "U kunt contact opnemen via het contactformulier of mailen naar contact@saynarelec.com. Wij nemen binnen 24-48 uur contact met u op.",
      en: "You can reach us via our online contact form or by emailing contact@saynarelec.com. We respond within 24 to 48 business hours."
    }
  }
];

const SCALAR_KEYS = Object.keys(dictionaries.fr).filter((k) => typeof dictionaries.fr[k] === 'string');

export const DEFAULT_CONTENT = {
  hero_image: HERO_IMG,
  about_image: ABOUT_IMG,
  solar_image: SOLAR_IMG,
  ...Object.fromEntries(SCALAR_KEYS.map((k) => [k, loc(k)])),
  services: buildServices(),
  realisations: buildRealisations(),
  process_steps: buildProcessSteps(),
  contact_types: buildContactTypes(),
  faqs: DEFAULT_FAQS,
  service_pages: SERVICES_SEO_DATA,
};