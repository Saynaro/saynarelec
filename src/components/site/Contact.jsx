import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content';
import EditField from './cms/EditField';
import CountUpStat from '@/components/ui/CountUpStat';
import Reveal from './Reveal';
import ConfirmModal from './cms/ConfirmModal';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isEmailJSConfigured = !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

const PHONE_COUNTRIES = [
  { code: 'BE', flag: '🇧🇪', dial: '+32', name: { fr: 'Belgique (+32)', nl: 'België (+32)', en: 'Belgium (+32)' }, placeholder: '470 12 34 56' },
  { code: 'FR', flag: '🇫🇷', dial: '+33', name: { fr: 'France (+33)', nl: 'Frankrijk (+33)', en: 'France (+33)' }, placeholder: '6 12 34 56 78' },
  { code: 'NL', flag: '🇳🇱', dial: '+31', name: { fr: 'Pays-Bas (+31)', nl: 'Nederland (+31)', en: 'Netherlands (+31)' }, placeholder: '6 12 34 56 78' },
  { code: 'LU', flag: '🇱🇺', dial: '+352', name: { fr: 'Luxembourg (+352)', nl: 'Luxemburg (+352)', en: 'Luxembourg (+352)' }, placeholder: '621 123 456' },
];

const formatPhoneDigits = (rawInput, countryCode) => {
  let d = rawInput.replace(/\D/g, '');
  
  // Strip leading 0 if user enters 06... or 0470...
  if (d.startsWith('0')) {
    d = d.slice(1);
  }

  if (countryCode === 'FR' || countryCode === 'NL') {
    d = d.slice(0, 9);
    if (d.length <= 1) return d;
    if (d.length <= 3) return `${d.slice(0, 1)} ${d.slice(1)}`;
    if (d.length <= 5) return `${d.slice(0, 1)} ${d.slice(1, 3)} ${d.slice(3)}`;
    if (d.length <= 7) return `${d.slice(0, 1)} ${d.slice(1, 3)} ${d.slice(3, 5)} ${d.slice(5)}`;
    return `${d.slice(0, 1)} ${d.slice(1, 3)} ${d.slice(3, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
  }

  if (countryCode === 'LU') {
    d = d.slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
  }

  // BE (default)
  d = d.slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
};

const PLACEHOLDERS = {
  fr: {
    name: "Nom Prenom",
    email: "nom@exemple.com",
    type_default: "Sélectionnez votre type de projet...",
    message: "Décrivez brièvement vos besoins, délais ou adresse du chantier...",
  },
  nl: {
    name: "Bijv. Jan Janssen",
    email: "naam@voorbeeld.com",
    type_default: "Selecteer uw type project...",
    message: "Beschrijf kort uw wensen, planning of werfadres...",
  },
  en: {
    name: "Name Surname",
    email: "name@example.com",
    type_default: "Select your project type...",
    message: "Briefly describe your project, timeline, or job site location...",
  },
};

export default function Contact() {
  const { lang } = useLang();
  const { t, isAdmin, contactTypes, addContactType, deleteContactType } = useContent();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState(PHONE_COUNTRIES[0]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' });
  const [newType, setNewType] = useState('');
  const [deleteTypeIdx, setDeleteTypeIdx] = useState(null);

  const ph = PLACEHOLDERS[lang] || PLACEHOLDERS.fr;

  const handlePhoneChange = (e) => {
    let raw = e.target.value;
    let targetCountry = phoneCountry;

    // Auto-detect country code if pasted with dial prefix
    for (const c of PHONE_COUNTRIES) {
      if (raw.startsWith(c.dial)) {
        targetCountry = c;
        setPhoneCountry(c);
        raw = raw.slice(c.dial.length);
        break;
      } else if (raw.startsWith(c.dial.replace('+', '00'))) {
        targetCountry = c;
        setPhoneCountry(c);
        raw = raw.slice(c.dial.replace('+', '00').length);
        break;
      }
    }

    const formatted = formatPhoneDigits(raw, targetCountry.code);
    setForm((f) => ({ ...f, phone: formatted }));
  };

  const handleCountryChange = (countryCode) => {
    const found = PHONE_COUNTRIES.find((c) => c.code === countryCode);
    if (found) {
      setPhoneCountry(found);
      // Re-format existing digits for the new country
      if (form.phone) {
        setForm((f) => ({ ...f, phone: formatPhoneDigits(form.phone, found.code) }));
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedName = (form.name || '').trim();
    const trimmedEmail = (form.email || '').trim();
    
    // Clean and normalize phone number
    let cleanPhone = (form.phone || '').trim().replace(/^0+/, '');
    if (cleanPhone.startsWith(phoneCountry.dial)) {
      cleanPhone = cleanPhone.slice(phoneCountry.dial.length).trim().replace(/^0+/, '');
    }

    if (!trimmedName) {
      const msg =
        lang === 'nl'
          ? "Vul uw naam en voornaam in"
          : lang === 'en'
            ? "Please enter your full name"
            : "Veuillez renseigner votre nom et prénom";
      setError(msg);
      toast({ title: msg, variant: "destructive", duration: 5000 });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      const invalidEmailMsg =
        lang === 'nl'
          ? "Voer een geldig e-mailadres in (met @ en een geldig domein, bijv. naam@domein.com)"
          : lang === 'en'
            ? "Please enter a valid email address (with @ and a valid domain, e.g. name@domain.com)"
            : "Veuillez saisir une adresse e-mail valide (avec @ et un nom de domaine, ex. nom@domaine.com)";
      setError(invalidEmailMsg);
      toast({
        title: lang === 'nl' ? "Ongeldig e-mailadres" : lang === 'en' ? "Invalid email address" : "Adresse e-mail invalide",
        description: invalidEmailMsg,
        variant: "destructive",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 6) {
      const msg =
        lang === 'nl'
          ? "Vul een geldig telefoonnummer in"
          : lang === 'en'
            ? "Please enter a valid phone number"
            : "Veuillez renseigner un numéro de téléphone valide";
      setError(msg);
      toast({ title: msg, variant: "destructive", duration: 5000 });
      setLoading(false);
      return;
    }

    const fullPhoneFormatted = `${phoneCountry.dial} ${cleanPhone}`;

    if (!isEmailJSConfigured) {
      // Simulation in dev
      console.warn('EmailJS non configuré. Remplissez les variables VITE_EMAILJS_* dans .env');
      setSent(true);
      setForm({ name: '', email: '', phone: '', type: '', message: '' });
      toast({
        title: lang === 'nl' ? "Aanvraag succesvol verzonden" : lang === 'en' ? "Request sent successfully" : "Demande envoyée avec succès",
        description: lang === 'nl' ? "Bedankt voor uw bericht! We nemen binnen 24u-48u contact met u op." : lang === 'en' ? "Thank you for your message! We will get back to you within 24-48 hours." : "Merci pour votre message ! Nous vous recontacterons sous 24h à 48h.",
        duration: 5000,
      });
      setTimeout(() => setSent(false), 6000);
      setLoading(false);
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: trimmedName,
          email: trimmedEmail,
          phone: fullPhoneFormatted,
          type: form.type || 'Général',
          message: form.message || '',
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      setForm({ name: '', email: '', phone: '', type: '', message: '' });
      toast({
        title: lang === 'nl' ? "Aanvraag succesvol verzonden" : lang === 'en' ? "Request sent successfully" : "Demande envoyée avec succès",
        description: lang === 'nl' ? "Bedankt voor uw bericht! We nemen binnen 24u-48u contact met u op." : lang === 'en' ? "Thank you for your message! We will get back to you within 24-48 hours." : "Merci pour votre message ! Nous vous recontacterons sous 24h à 48h.",
        duration: 5000,
      });
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      console.error('EmailJS error:', err);
      const errMsg = t('contact_form_error') || "Erreur lors de l'envoi. Veuillez réessayer ou nous contacter par e-mail.";
      setError(errMsg);
      toast({
        title: "Erreur lors de l'envoi",
        description: errMsg,
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
    required: true,
  });

  const inputCls = 'w-full bg-transparent border-b border-navy/25 py-3 text-navy font-medium placeholder-navy/30 focus:border-electric focus:outline-none transition-colors text-base';

  return (
    <section id="contact" className="bg-warm py-20 md:py-28 border-t border-navy/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-12 gap-6 md:gap-12">
        <Reveal className="col-span-12 lg:col-span-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-solar" />
            <EditField k="contact_label" as="span" className="text-solar font-bold tracking-label text-[11px] uppercase" />
          </div>
          <h2 className="font-heading font-semibold tracking-tightest text-navy text-4xl md:text-6xl leading-[0.95]">
            <EditField k="contact_title" as="span" />
          </h2>

          <div className="mt-10 border-t border-navy/15 pt-8">
            <div className="text-[10px] uppercase tracking-label text-navy/70 mb-2 font-bold">
              <EditField k="contact_email_label" as="span" />
            </div>
            <a
              href={`mailto:${t('contact_email')}`}
              className="font-heading text-2xl md:text-3xl text-electric hover:text-solar transition-colors break-all font-semibold"
            >
              <EditField k="contact_email" as="span" />
            </a>
          </div>

          <div className="hidden lg:grid mt-8 grid-cols-2 gap-6 border-t border-navy/15 pt-8">
            <div>
              {isAdmin
                ? <EditField k="about_years_num" as="span" className="block font-heading font-bold text-5xl text-navy leading-none" />
                : <CountUpStat value={t('about_years_num')} className="block font-heading font-bold text-5xl text-navy leading-none" delay={100} />}
              <EditField k="about_years_label" as="span" className="block text-[10px] uppercase tracking-label text-navy/75 font-semibold mt-2" />
            </div>
            <div>
              {isAdmin
                ? <EditField k="about_clients_num" as="span" className="block font-heading font-bold text-5xl text-electric leading-none" />
                : <CountUpStat value={t('about_clients_num')} className="block font-heading font-bold text-5xl text-electric leading-none" delay={300} />}
              <EditField k="about_clients_label" as="span" className="block text-[10px] uppercase tracking-label text-navy/75 font-semibold mt-2" />
            </div>
          </div>
        </Reveal>

        <Reveal className="col-span-12 lg:col-span-7 lg:pl-8 mt-6 lg:mt-0 pt-4 lg:pt-0" delay={120}>
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <span className="text-solar font-bold tracking-label text-[10px] uppercase whitespace-nowrap">
              <EditField k="contact_or_form" as="span" />
            </span>
            <span className="flex-1 h-px bg-navy/15" />
          </div>
          <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-6 gap-y-7">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] uppercase tracking-label text-navy/80 font-bold mb-1">
                <EditField k="contact_form_name" as="span" /> <span className="text-solar">*</span>
              </label>
              <input
                {...field('name')}
                type="text"
                placeholder={ph.name}
                className={inputCls}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] uppercase tracking-label text-navy/80 font-bold mb-1">
                <EditField k="contact_form_email" as="span" /> <span className="text-solar">*</span>
              </label>
              <input
                {...field('email')}
                type="email"
                placeholder={ph.email}
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                className={inputCls}
              />
            </div>

            {/* Compact Country Selector + Phone Input with Auto-formatting Mask */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] uppercase tracking-label text-navy/80 font-bold mb-1">
                <EditField k="contact_form_phone" as="span" /> <span className="text-solar">*</span>
              </label>
              <div className="flex items-center border-b border-navy/25 focus-within:border-electric transition-colors">
                <div className="relative shrink-0 flex items-center pr-2 border-r border-navy/15 mr-3">
                  <select
                    value={phoneCountry.code}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="bg-transparent py-3 text-navy font-semibold text-base appearance-none cursor-pointer focus:outline-none pr-4.5 rounded-none select-none"
                    title="Indicatif pays"
                  >
                    {PHONE_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="text-navy bg-white py-1">
                        {c.flag} {c.dial}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-1 bottom-3.5 pointer-events-none text-navy/40">
                    <ChevronDown size={14} />
                  </div>
                </div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder={phoneCountry.placeholder}
                  required
                  className="w-full bg-transparent py-3 text-navy font-medium placeholder-navy/30 focus:outline-none text-base tracking-wide"
                />
              </div>
            </div>

            {/* Type of Project */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] uppercase tracking-label text-navy/80 font-bold mb-1">
                <EditField k="contact_form_type" as="span" /> <span className="text-solar">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  required
                  className={`w-full bg-transparent border-b border-navy/25 py-3 pr-8 focus:border-electric focus:outline-none transition-colors text-base appearance-none cursor-pointer rounded-none ${
                    form.type ? 'text-navy font-medium' : 'text-navy/30 font-medium'
                  }`}
                >
                  <option value="" disabled className="text-navy/40">
                    {ph.type_default}
                  </option>
                  {contactTypes.map((tp, i) => (
                    <option key={i} value={tp} className="text-navy bg-white">
                      {tp}
                    </option>
                  ))}
                </select>
                <div className="absolute right-0 bottom-3.5 pointer-events-none text-navy/40">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="col-span-2">
              <label className="block text-[11px] uppercase tracking-label text-navy/80 font-bold mb-1">
                <EditField k="contact_form_message" as="span" />
              </label>
              <textarea
                {...field('message')}
                required={false}
                rows={4}
                placeholder={ph.message}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-electric text-white px-8 py-4 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-all hover:-translate-y-0.5 disabled:opacity-60 shadow-md cursor-pointer"
              >
                {loading ? '…' : <><EditField k="contact_form_submit" as="span" /> →</>}
              </button>
              {sent && (
                <span className="text-sm text-electric font-semibold">
                  <EditField k="contact_form_success" as="span" />
                </span>
              )}
              {error && (
                <span className="text-sm text-red-500 font-semibold">{error}</span>
              )}
            </div>
          </form>

          {isAdmin && (
            <div className="mt-8 border-t border-navy/15 pt-6">
              <div className="text-[10px] uppercase tracking-label text-navy/70 font-bold mb-3">Types de projet (modifiables)</div>
              <div className="flex flex-wrap gap-2">
                {contactTypes.map((tp, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-skyblue text-navy text-xs px-3 py-1.5 font-medium">
                    {tp}
                    <button onClick={() => setDeleteTypeIdx(i)} className="text-red-400 hover:text-red-600 cursor-pointer" title="Supprimer"><Trash2 size={12} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="Nouveau type"
                  className="flex-1 border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none placeholder-navy/30"
                />
                <button
                  onClick={() => { if (newType.trim()) { addContactType(newType.trim()); setNewType(''); } }}
                  className="bg-electric text-white px-4 py-2 text-[11px] uppercase tracking-label inline-flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Plus size={14} /> Ajouter
                </button>
              </div>
            </div>
          )}
        </Reveal>
      </div>

      <ConfirmModal
        open={deleteTypeIdx !== null}
        title="Supprimer ce type de projet"
        message={`Êtes-vous sûr de vouloir supprimer le type « ${deleteTypeIdx !== null ? contactTypes[deleteTypeIdx] : ''} » ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={() => {
          if (deleteTypeIdx !== null) deleteContactType(deleteTypeIdx);
          setDeleteTypeIdx(null);
        }}
        onCancel={() => setDeleteTypeIdx(null)}
      />
    </section>
  );
}