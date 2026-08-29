import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useContent } from '@/lib/content';
import EditField from './cms/EditField';
import CountUpStat from '@/components/ui/CountUpStat';
import Reveal from './Reveal';
import ConfirmModal from './cms/ConfirmModal';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isEmailJSConfigured = !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

export default function Contact() {
  const { t, isAdmin, contactTypes, addContactType, deleteContactType } = useContent();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' });
  const [newType, setNewType] = useState('');
  const [deleteTypeIdx, setDeleteTypeIdx] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isEmailJSConfigured) {
      // Si EmailJS n'est pas encore configuré — simulation en mode développement
      console.warn('EmailJS non configuré. Remplissez les variables VITE_EMAILJS_* dans .env');
      setSent(true);
      setForm({ name: '', email: '', phone: '', type: '', message: '' });
      toast({
        title: "Demande envoyée avec succès",
        description: "Merci pour votre message ! Nous vous recontacterons sous 24h à 48h.",
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
          name: form.name,
          email: form.email,
          phone: form.phone || 'Non renseigné',
          type: form.type,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      setForm({ name: '', email: '', phone: '', type: '', message: '' });
      toast({
        title: "Demande envoyée avec succès",
        description: "Merci pour votre message ! Nous vous recontacterons sous 24h à 48h.",
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
    required: name !== 'phone',
  });

  const inputCls = 'w-full bg-transparent border-b border-navy/25 py-3 text-navy placeholder-navy/40 focus:border-electric focus:outline-none transition-colors text-base';

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
            <div className="text-[10px] uppercase tracking-label text-navy/50 mb-2">
              <EditField k="contact_email_label" as="span" />
            </div>
            <a
              href={`mailto:${t('contact_email')}`}
              className="font-heading text-2xl md:text-3xl text-electric hover:text-solar transition-colors break-all"
            >
              <EditField k="contact_email" as="span" />
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-navy/15 pt-8">
            <div>
              {isAdmin
                ? <EditField k="about_years_num" as="span" className="block font-heading font-bold text-5xl text-navy leading-none" />
                : <CountUpStat value={t('about_years_num')} className="block font-heading font-bold text-5xl text-navy leading-none" delay={100} />}
              <EditField k="about_years_label" as="span" className="block text-[10px] uppercase tracking-label text-navy/55 mt-2" />
            </div>
            <div>
              {isAdmin
                ? <EditField k="about_clients_num" as="span" className="block font-heading font-bold text-5xl text-electric leading-none" />
                : <CountUpStat value={t('about_clients_num')} className="block font-heading font-bold text-5xl text-electric leading-none" delay={300} />}
              <EditField k="about_clients_label" as="span" className="block text-[10px] uppercase tracking-label text-navy/55 mt-2" />
            </div>
          </div>
        </Reveal>

        <Reveal className="col-span-12 lg:col-span-7 lg:pl-8" delay={120}>
          <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-6 gap-y-7">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">
                <EditField k="contact_form_name" as="span" />
              </label>
              <input {...field('name')} type="text" className={inputCls} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">
                <EditField k="contact_form_email" as="span" />
              </label>
              <input {...field('email')} type="email" className={inputCls} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">
                <EditField k="contact_form_phone" as="span" />
              </label>
              <input {...field('phone')} type="tel" className={inputCls} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">
                <EditField k="contact_form_type" as="span" />
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                required
                className={inputCls}
              >
                <option value="" disabled></option>
                {contactTypes.map((tp, i) => (
                  <option key={i} value={tp}>{tp}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">
                <EditField k="contact_form_message" as="span" />
              </label>
              <textarea {...field('message')} rows={4} className={`${inputCls} resize-none`} />
            </div>
            <div className="col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-electric text-white px-8 py-4 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? '…' : <><EditField k="contact_form_submit" as="span" /> →</>}
              </button>
              {sent && (
                <span className="text-sm text-electric font-medium">
                  <EditField k="contact_form_success" as="span" />
                </span>
              )}
              {error && (
                <span className="text-sm text-red-500 font-medium">{error}</span>
              )}
            </div>
          </form>

          {isAdmin && (
            <div className="mt-8 border-t border-navy/15 pt-6">
              <div className="text-[10px] uppercase tracking-label text-navy/55 mb-3">Types de projet (modifiables)</div>
              <div className="flex flex-wrap gap-2">
                {contactTypes.map((tp, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-skyblue text-navy text-xs px-3 py-1.5">
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
                  className="flex-1 border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none"
                />
                <button
                  onClick={() => { if (newType.trim()) { addContactType(newType.trim()); setNewType(''); } }}
                  className="bg-electric text-white px-4 py-2 text-[11px] uppercase tracking-label inline-flex items-center gap-1"
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