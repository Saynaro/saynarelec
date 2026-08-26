import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { DEFAULT_CONTENT } from '@/lib/content-defaults';

const ContentContext = createContext(null);
const ADMIN_EMAIL = 'saynarelec@gmail.com';
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
    const emailOk = email.trim().toLowerCase() === ADMIN_EMAIL;
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
    save({ services: a });
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