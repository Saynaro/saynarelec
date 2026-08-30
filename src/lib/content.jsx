import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { DEFAULT_CONTENT } from '@/lib/content-defaults';
import { SERVICES_SEO_DATA } from '@/lib/services-data';

const ContentContext = createContext(null);
const ADMIN_EMAILS = ['contact@saynarelec.com', 'saynarelec@gmail.com'];
const ADMIN_PASSWORD = 'Ibragim1234';
const SS_KEY = 'sayna_admin';
const LS_FALLBACK_KEY = 'sayna_site_content'; // fallback если Supabase не настроен

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const arr = (key, c) => (c[key] && c[key].length ? c[key] : DEFAULT_CONTENT[key]);

// Ensure i18n field is always { fr, nl, en } object, never a plain string
const ensureI18n = (val, fallback = '') => {
  if (isObj(val)) return val;
  const s = typeof val === 'string' ? val : fallback;
  return { fr: s, nl: s, en: s };
};

const UNIVERSAL_KEYS = [
  'stat_years',
  'stat_clients',
  'about_years_num',
  'about_clients_num',
  'contact_email',
];

// Helper to ensure each lang property has a value (fallback to fr if nl/en empty)
const fillMissingLangs = (i18nObj) => {
  const norm = ensureI18n(i18nObj);
  const fallback = norm.fr || norm.nl || norm.en || '';
  return {
    fr: norm.fr || fallback,
    nl: norm.nl || fallback,
    en: norm.en || fallback,
  };
};

// Normalize saved content so array items and scalar stats always have proper shape
const normalizeContent = (saved) => {
  if (!saved) return saved;
  const out = { ...saved };

  // Migrate old email to new domain email
  if (out.contact_email) {
    if (typeof out.contact_email === 'string' && (out.contact_email === 'saynarelec@gmail.com' || !out.contact_email)) {
      out.contact_email = 'contact@saynarelec.com';
    } else if (isObj(out.contact_email)) {
      if (out.contact_email.fr === 'saynarelec@gmail.com' || out.contact_email.en === 'saynarelec@gmail.com' || !out.contact_email.fr) {
        out.contact_email = { fr: 'contact@saynarelec.com', nl: 'contact@saynarelec.com', en: 'contact@saynarelec.com' };
      }
    }
  }

  // Migrate old form label 'Nom' to 'Nom et prénom'
  if (out.contact_form_name && isObj(out.contact_form_name)) {
    if (out.contact_form_name.fr === 'Nom') {
      out.contact_form_name.fr = 'Nom et prénom';
    }
  }

  // Sync universal keys (stats/numbers/email) across languages if any language was customized
  UNIVERSAL_KEYS.forEach((k) => {
    if (isObj(out[k])) {
      const customVal = out[k].fr || out[k].nl || out[k].en;
      if (customVal && customVal !== '05' && customVal !== '5') {
        out[k] = { fr: customVal, nl: customVal, en: customVal };
      }
    }
  });

  if (Array.isArray(out.realisations)) {
    out.realisations = out.realisations.map((r) => ({
      ...r,
      colSpan: typeof r.colSpan === 'number' ? r.colSpan : Number(r.colSpan) || 6,
      rowSpan: typeof r.rowSpan === 'number' ? r.rowSpan : Number(r.rowSpan) || 36,
      cat: fillMissingLangs(r.cat),
      desc: fillMissingLangs(r.desc),
    }));
  }
  if (Array.isArray(out.services)) {
    out.services = out.services.map((s) => ({
      ...s,
      name: fillMissingLangs(s.name),
      desc: fillMissingLangs(s.desc),
    }));
  }
  if (Array.isArray(out.process_steps)) {
    out.process_steps = out.process_steps.map((s) => ({
      ...s,
      title: fillMissingLangs(s.title),
      desc: fillMissingLangs(s.desc),
    }));
  }
  return out;
};

// Утилита для загрузки/сохранения контента
const loadContent = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 1)
        .single();
      if (!error && data?.content) return data.content;
    } catch (e) {
      console.warn('Supabase load failed, falling back to localStorage:', e);
    }
  }
  // Fallback: localStorage (если Supabase не настроен)
  try {
    const saved = localStorage.getItem(LS_FALLBACK_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
};

const saveContent = async (content) => {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: 1, content }, { onConflict: 'id' });
      if (!error) return;
      console.warn('Supabase save failed, falling back to localStorage:', error);
    } catch (e) {
      console.warn('Supabase save error:', e);
    }
  }
  // Fallback: localStorage
  try {
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(content));
  } catch (e) {
    console.error('localStorage save failed:', e);
  }
};

export function ContentProvider({ children }) {
  const { lang } = useLang();
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isAdmin, setIsAdmin] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(SS_KEY) === '1'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await loadContent();
        if (saved) {
          setContent({ ...DEFAULT_CONTENT, ...normalizeContent(saved) });
        }
      } catch (e) {
        // use defaults silently
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (supabase) {
        const { error } = await supabase
          .from('site_content')
          .upsert({ id: 1, content: next }, { onConflict: 'id' });
        if (error) {
          console.error('Supabase save error:', error.message, error);
          setSaveError(error.message);
          // Fallback to localStorage
          try { localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(next)); } catch (e) {}
        }
      } else {
        // No Supabase — use localStorage only
        try { localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(next)); } catch (e) {}
      }
    } catch (e) {
      console.error('persist failed', e);
      setSaveError(e.message);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const save = useCallback(
    (partial) => {
      setContent((prev) => {
        const next = { ...prev, ...partial };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const login = (email, password) => {
    const emailOk = ADMIN_EMAILS.includes(email.trim().toLowerCase());
    const passOk = password === ADMIN_PASSWORD;
    if (emailOk && passOk) {
      setIsAdmin(true);
      try { sessionStorage.setItem(SS_KEY, '1'); } catch (e) {}
      return { success: true };
    }
    if (!emailOk) return { success: false, field: 'email' };
    return { success: false, field: 'password' };
  };

  const logout = () => {
    setIsAdmin(false);
    try { sessionStorage.removeItem(SS_KEY); } catch (e) {}
  };

  const resetToDefaults = useCallback(async () => {
    setContent(DEFAULT_CONTENT);
    // Clear localStorage
    try { localStorage.removeItem(LS_FALLBACK_KEY); } catch (e) {}
    // Clear Supabase
    if (supabase) {
      try {
        await supabase
          .from('site_content')
          .upsert({ id: 1, content: DEFAULT_CONTENT }, { onConflict: 'id' });
      } catch (e) {
        console.warn('Reset to Supabase failed:', e);
      }
    }
  }, []);

  const t = (key) => {
    const v = content[key];
    if (isObj(v)) {
      if (UNIVERSAL_KEYS.includes(key)) {
        // Universal key: use current lang, or fallback to any customized lang
        return v[lang] || v.fr || v.nl || v.en || DEFAULT_CONTENT[key]?.[lang] || key;
      }
      if (v[lang] !== undefined && v[lang] !== '') return v[lang];
    }
    const d = DEFAULT_CONTENT[key];
    if (isObj(d) && d[lang] !== undefined) return d[lang];
    return key;
  };

  const setText = (key, value) => {
    setContent((prev) => {
      const def = isObj(DEFAULT_CONTENT[key]) ? DEFAULT_CONTENT[key] : {};
      const cur = isObj(prev[key]) ? prev[key] : {};

      let updated;
      if (UNIVERSAL_KEYS.includes(key)) {
        // Numbers, stats and email are always synced across all languages
        updated = { fr: value, nl: value, en: value };
      } else {
        // Start with current lang update
        updated = { ...def, ...cur, [lang]: value };
        // Cascade to other languages that still match their default (were never customized)
        ['fr', 'nl', 'en'].forEach((l) => {
          if (l !== lang) {
            const curVal = cur[l];
            const defVal = def[l];
            if (!curVal || curVal === defVal) {
              updated[l] = value;
            }
          }
        });
      }

      const next = { ...prev, [key]: updated };
      persist(next);
      return next;
    });
  };

  const img = (key) => content[key] || DEFAULT_CONTENT[key] || '';
  const setImage = (key, url) => save({ [key]: url });

  // helper to resolve text with fallback to any available language if current lang is empty
  const resolveLang = (obj) => {
    if (!isObj(obj)) return obj ?? '';
    return obj[lang] || obj.fr || obj.nl || obj.en || '';
  };

  // resolved arrays for current lang
  const services = (content.services ?? DEFAULT_CONTENT.services).map((s) => ({
    image: s.image,
    name: resolveLang(s.name),
    desc: resolveLang(s.desc),
  }));
  const realisations = (content.realisations ?? DEFAULT_CONTENT.realisations).map((r) => ({
    image: r.image,
    cat: resolveLang(r.cat),
    desc: resolveLang(r.desc),
    colSpan: r.colSpan,
    rowSpan: r.rowSpan,
  }));
  const processSteps = (content.process_steps ?? DEFAULT_CONTENT.process_steps).map((s) => ({
    title: resolveLang(s.title),
    desc: resolveLang(s.desc),
  }));
  const contactTypes = (content.contact_types ?? DEFAULT_CONTENT.contact_types).map((c) => resolveLang(c));

  // services CRUD
  const updateService = (i, { name, desc, image }) => {
    const raw = content.services ?? DEFAULT_CONTENT.services;
    const a = raw.map((s, idx) => {
      if (idx !== i) return s;
      const next = { ...s };
      if (name !== undefined) {
        const cur = isObj(s.name) ? s.name : { fr: s.name, nl: s.name, en: s.name };
        const updated = { ...cur, [lang]: name };
        ['fr', 'nl', 'en'].forEach((l) => {
          if (l !== lang && (!cur[l] || cur[l] === cur[lang])) updated[l] = name;
        });
        next.name = updated;
      }
      if (desc !== undefined) {
        const cur = isObj(s.desc) ? s.desc : { fr: s.desc, nl: s.desc, en: s.desc };
        const updated = { ...cur, [lang]: desc };
        ['fr', 'nl', 'en'].forEach((l) => {
          if (l !== lang && (!cur[l] || cur[l] === cur[lang])) updated[l] = desc;
        });
        next.desc = updated;
      }
      if (image !== undefined) next.image = image;
      return next;
    });
    save({ services: a });
  };
  const addService = ({ name, desc, image }) => {
    const a = [...arr('services', content), { image, name: { fr: name, nl: name, en: name }, desc: { fr: desc, nl: desc, en: desc } }];
    save({ services: a });
  };
  const deleteService = (i) => save({ services: arr('services', content).filter((_, idx) => idx !== i) });
  const updateServiceImage = (i, url) => {
    const a = arr('services', content).map((s, idx) => (idx === i ? { ...s, image: url } : s));
    const slugList = [
      'electricite-generale',
      'renovation-electrique',
      'mise-en-conformite',
      'depannage-electrique',
      'eclairage',
      'panneaux-solaires',
    ];
    const slug = slugList[i];
    const sp = { ...(content.service_pages ?? DEFAULT_CONTENT.service_pages) };
    if (slug && sp[slug]) {
      sp[slug] = { ...sp[slug], image: url };
    }
    save({ services: a, service_pages: sp });
  };

  // realisations CRUD
  const updateRealisation = (i, partial) => {
    const raw = content.realisations ?? DEFAULT_CONTENT.realisations;
    const a = raw.map((r, idx) => {
      if (idx !== i) return r;
      const next = { ...r };
      if (partial.cat !== undefined) {
        const cur = isObj(r.cat) ? r.cat : { fr: r.cat, nl: r.cat, en: r.cat };
        const updated = { ...cur, [lang]: partial.cat };
        ['fr', 'nl', 'en'].forEach((l) => {
          if (l !== lang && (!cur[l] || cur[l] === cur[lang])) {
            updated[l] = partial.cat;
          }
        });
        next.cat = updated;
      }
      if (partial.desc !== undefined) {
        const cur = isObj(r.desc) ? r.desc : { fr: r.desc, nl: r.desc, en: r.desc };
        const updated = { ...cur, [lang]: partial.desc };
        ['fr', 'nl', 'en'].forEach((l) => {
          if (l !== lang && (!cur[l] || cur[l] === cur[lang])) {
            updated[l] = partial.desc;
          }
        });
        next.desc = updated;
      }
      return next;
    });
    save({ realisations: a });
  };
  const updateRealisationMeta = (i, meta) => {
    // Always use raw content.realisations (with i18n objects intact)
    const raw = content.realisations ?? DEFAULT_CONTENT.realisations;
    const a = raw.map((r, idx) => (idx === i ? { ...r, ...meta } : r));
    save({ realisations: a });
  };
  const addRealisation = ({ image, cat, desc, colSpan, rowSpan }) => {
    const a = [...arr('realisations', content), {
      image,
      cat: { fr: cat, nl: cat, en: cat },
      desc: { fr: desc, nl: desc, en: desc },
      colSpan, rowSpan,
    }];
    save({ realisations: a });
  };
  const deleteRealisation = (i) => {
    const raw = content.realisations ?? DEFAULT_CONTENT.realisations;
    save({ realisations: raw.filter((_, idx) => idx !== i) });
  };
  // reorderRealisations expects the RAW array (with i18n objects), not the resolved one
  const reorderRealisations = (newArr) => save({ realisations: newArr });

  // process steps CRUD
  const updateStep = (i, { title, desc }) => {
    const a = arr('process_steps', content).map((s, idx) =>
      idx === i ? { ...s, title: { ...s.title, [lang]: title }, desc: { ...s.desc, [lang]: desc } } : s
    );
    save({ process_steps: a });
  };
  const addStep = ({ title, desc }) => {
    const a = [...arr('process_steps', content), { title: { fr: title, nl: title, en: title }, desc: { fr: desc, nl: desc, en: desc } }];
    save({ process_steps: a });
  };
  const deleteStep = (i) => save({ process_steps: arr('process_steps', content).filter((_, idx) => idx !== i) });

  // contact types CRUD
  const addContactType = (label) => save({ contact_types: [...arr('contact_types', content), { fr: label, nl: label, en: label }] });
  const deleteContactType = (i) => save({ contact_types: arr('contact_types', content).filter((_, idx) => idx !== i) });

  // FAQs CRUD
  const rawFaqs = content.faqs ?? DEFAULT_CONTENT.faqs;
  const faqs = (rawFaqs || []).map((item) => ({
    q: isObj(item.q) ? item.q[lang] || item.q.fr || '' : item.q,
    a: isObj(item.a) ? item.a[lang] || item.a.fr || '' : item.a,
  }));

  const updateFaq = (i, { q, a }) => {
    const raw = content.faqs ?? DEFAULT_CONTENT.faqs;
    const next = raw.map((item, idx) => {
      if (idx !== i) return item;
      const curQ = isObj(item.q) ? item.q : { fr: item.q, nl: item.q, en: item.q };
      const curA = isObj(item.a) ? item.a : { fr: item.a, nl: item.a, en: item.a };
      return {
        q: { ...curQ, [lang]: q },
        a: { ...curA, [lang]: a },
      };
    });
    save({ faqs: next });
  };

  const addFaq = ({ q, a }) => {
    const raw = content.faqs ?? DEFAULT_CONTENT.faqs;
    const next = [
      ...raw,
      {
        q: { fr: q, nl: q, en: q },
        a: { fr: a, nl: a, en: a },
      },
    ];
    save({ faqs: next });
  };

  const deleteFaq = (i) => {
    const raw = content.faqs ?? DEFAULT_CONTENT.faqs;
    save({ faqs: raw.filter((_, idx) => idx !== i) });
  };

  // Mapping between service slugs and indexes in "Nos métiers"
  const SLUG_TO_INDEX = {
    'electricite-generale': 0,
    'electricite': 0,
    'installation-electrique': 0,
    'renovation-electrique': 1,
    'mise-en-conformite': 2,
    'depannage-electrique': 3,
    'depannage': 3,
    'eclairage': 4,
    'panneaux-solaires': 5,
  };

  // Service Pages Data & CRUD
  const getServicePage = (slug) => {
    const sp = content.service_pages ?? DEFAULT_CONTENT.service_pages;
    let targetKey = slug;
    let target = sp[targetKey];
    if (!target) {
      for (const k in sp) {
        if (sp[k].aliases?.includes(slug)) {
          targetKey = k;
          target = sp[k];
          break;
        }
      }
    }
    const def = SERVICES_SEO_DATA[targetKey] || SERVICES_SEO_DATA[slug] || {};
    const base = target || def;

    const resolveField = (val, defaultVal) => {
      if (isObj(val)) {
        return val[lang] || val.fr || (isObj(defaultVal) ? (defaultVal[lang] || defaultVal.fr) : '') || '';
      }
      if (typeof val === 'string' && val.trim() !== '') {
        if (isObj(defaultVal)) {
          if (val === defaultVal.fr || val === defaultVal.nl || val === defaultVal.en) {
            return defaultVal[lang] || defaultVal.fr || val;
          }
          if (lang === 'fr') return val;
          return defaultVal[lang] || val;
        }
        return val;
      }
      if (isObj(defaultVal)) {
        return defaultVal[lang] || defaultVal.fr || '';
      }
      return typeof defaultVal === 'string' ? defaultVal : '';
    };

    // Get matching image from "Nos métiers" if available
    const idx = SLUG_TO_INDEX[slug] !== undefined ? SLUG_TO_INDEX[slug] : SLUG_TO_INDEX[targetKey];
    const srvList = arr('services', content);
    const serviceImg = idx !== undefined && srvList[idx]?.image ? srvList[idx].image : (base.image || def.image);

    // Resolve highlights for current language
    let resolvedHighlights = [];
    const defHighlights = isObj(def.highlights) ? (def.highlights[lang] || def.highlights.fr || []) : [];
    
    if (isObj(base.highlights) && !Array.isArray(base.highlights)) {
      resolvedHighlights = (base.highlights[lang] || base.highlights.fr || defHighlights).map((item, i) => resolveField(item, defHighlights[i]));
    } else if (Array.isArray(base.highlights)) {
      if (lang !== 'fr' && defHighlights.length && base.highlights.length === def.highlights?.fr?.length) {
        resolvedHighlights = defHighlights;
      } else {
        resolvedHighlights = base.highlights.map((item, i) => resolveField(item, defHighlights[i]));
      }
    } else {
      resolvedHighlights = defHighlights;
    }

    // Resolve detailed sections for current language
    let resolvedSections = [];
    const defSections = isObj(def.sections) ? (def.sections[lang] || def.sections.fr || []) : [];
    
    if (isObj(base.sections) && !Array.isArray(base.sections)) {
      const rawSecs = base.sections[lang] || base.sections.fr || defSections;
      resolvedSections = rawSecs.map((sec, i) => ({
        title: resolveField(sec.title, defSections[i]?.title),
        text: resolveField(sec.text, defSections[i]?.text),
      }));
    } else if (Array.isArray(base.sections)) {
      if (lang !== 'fr' && defSections.length && base.sections.length === def.sections?.fr?.length) {
        resolvedSections = defSections;
      } else {
        resolvedSections = base.sections.map((sec, i) => ({
          title: resolveField(sec.title, defSections[i]?.title),
          text: resolveField(sec.text, defSections[i]?.text),
        }));
      }
    } else {
      resolvedSections = defSections;
    }

    // Resolve FAQs for current language
    let resolvedFaqs = [];
    const defFaqs = def.faqs || [];
    if (Array.isArray(base.faqs) && base.faqs.length) {
      resolvedFaqs = base.faqs.map((faq, i) => {
        const dFaq = defFaqs[i];
        return {
          q: resolveField(faq.q, dFaq?.q),
          a: resolveField(faq.a, dFaq?.a),
        };
      });
    } else {
      resolvedFaqs = defFaqs.map((faq) => ({
        q: resolveField(faq.q),
        a: resolveField(faq.a),
      }));
    }

    return {
      slug: base.slug || targetKey,
      aliases: base.aliases || def.aliases || [],
      title: resolveField(base.title, def.title),
      metaDescription: resolveField(base.metaDescription, def.metaDescription),
      h1: resolveField(base.h1, def.h1),
      badge: resolveField(base.badge, def.badge),
      lead: resolveField(base.lead, def.lead),
      alt: resolveField(base.alt, def.alt),
      highlights: resolvedHighlights,
      sections: resolvedSections,
      faqs: resolvedFaqs,
      image: serviceImg || base.image || def.image,
    };
  };

  const updateServicePage = (slug, partial) => {
    const sp = { ...(content.service_pages ?? DEFAULT_CONTENT.service_pages) };
    let targetKey = slug;
    if (!sp[targetKey]) {
      for (const k in sp) {
        if (sp[k].aliases?.includes(slug)) {
          targetKey = k;
          break;
        }
      }
    }
    const current = sp[targetKey] || DEFAULT_CONTENT.service_pages[targetKey] || {};
    const updated = { ...current };

    ['title', 'metaDescription', 'h1', 'badge', 'lead', 'alt'].forEach((field) => {
      if (partial[field] !== undefined) {
        const val = partial[field];
        if (typeof val === 'string') {
          const curObj = isObj(current[field]) ? current[field] : { fr: current[field], nl: current[field], en: current[field] };
          updated[field] = { ...curObj, [lang]: val };
        } else {
          updated[field] = val;
        }
      }
    });

    if (partial.highlights !== undefined) {
      if (isObj(current.highlights) && !Array.isArray(current.highlights)) {
        updated.highlights = { ...current.highlights, [lang]: partial.highlights };
      } else {
        updated.highlights = partial.highlights;
      }
    }

    if (partial.sections !== undefined) {
      if (isObj(current.sections) && !Array.isArray(current.sections)) {
        updated.sections = { ...current.sections, [lang]: partial.sections };
      } else {
        updated.sections = partial.sections;
      }
    }

    if (partial.faqs !== undefined) {
      updated.faqs = partial.faqs;
    }

    if (partial.image !== undefined) {
      updated.image = partial.image;
    }

    sp[targetKey] = updated;

    const idx = SLUG_TO_INDEX[slug] !== undefined ? SLUG_TO_INDEX[slug] : SLUG_TO_INDEX[targetKey];
    if (partial.image && idx !== undefined) {
      const srvList = arr('services', content).map((s, i) => (i === idx ? { ...s, image: partial.image } : s));
      save({ service_pages: sp, services: srvList });
    } else {
      save({ service_pages: sp });
    }
  };

  return (
    <ContentContext.Provider
      value={{
        isLoading, isSaving, saveError,
        isAdmin, login, logout, resetToDefaults,
        lang,
        t, setText, img, setImage,
        services, updateService, addService, deleteService, updateServiceImage,
        realisations, rawRealisations: content.realisations ?? DEFAULT_CONTENT.realisations,
        updateRealisation, updateRealisationMeta, addRealisation, deleteRealisation, reorderRealisations,
        processSteps, updateStep, addStep, deleteStep,
        contactTypes, addContactType, deleteContactType,
        faqs, rawFaqs, updateFaq, addFaq, deleteFaq,
        getServicePage, updateServicePage,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}