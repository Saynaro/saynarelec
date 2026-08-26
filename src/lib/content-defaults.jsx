import { dictionaries } from '@/lib/i18n';

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
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // щиток распределения
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80', // освещение интерьера
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', // офис / электромонтаж
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', // панели солнечной энергии
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80', // инструменты
];

export const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800&q=80', // электрик с кабелями
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80', // солнечные панели
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // электрощит
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80', // инструменты
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80', // освещение
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', // офисный монтаж
];

const LANGS = ['fr', 'nl', 'en'];
const loc = (key) => Object.fromEntries(LANGS.map((l) => [l, dictionaries[l][key] ?? '']));

const REAL_COLSPANS = [7, 5, 5, 7, 6, 6];
const REAL_ROWSPANS = [36, 36, 48, 40, 36, 36];

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
};