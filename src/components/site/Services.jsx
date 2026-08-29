import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/lib/content';
import { useLang } from '@/lib/i18n';
import EditableImage from './cms/EditableImage';
import EditField from './cms/EditField';
import Reveal from './Reveal';
import { Pencil, Trash2, Plus, ChevronDown } from 'lucide-react';
import ServiceModal from './cms/ServiceModal';
import ConfirmModal from './cms/ConfirmModal';
import { Image } from '@/components/ui/image';

export default function Services() {
  const { t, lang } = useLang();
  const { services, isAdmin, updateService, addService, deleteService, updateServiceImage } = useContent();
  const [active, setActive] = useState(0);       // desktop hover
  const [mobileOpen, setMobileOpen] = useState(null); // mobile accordion (index or null)
  const [editIdx, setEditIdx] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTargetIdx, setDeleteTargetIdx] = useState(null);

  const getServiceSlug = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('générale') || n.includes('general') || n.includes('algemene')) return 'electricite-generale';
    if (n.includes('rénovation') || n.includes('renovation') || n.includes('renovatie')) return 'renovation-electrique';
    if (n.includes('conformité') || n.includes('conformite') || n.includes('arei')) return 'mise-en-conformite';
    if (n.includes('dépannage') || n.includes('depannage') || n.includes('herstelling')) return 'depannage-electrique';
    if (n.includes('éclairage') || n.includes('eclairage') || n.includes('verlichting') || n.includes('lighting')) return 'eclairage';
    if (n.includes('solaire') || n.includes('solar') || n.includes('zon')) return 'panneaux-solaires';
    return 'electricite-generale';
  };

  const safeActive = Math.min(active, services.length - 1);
  const go = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const del = (i) => {
    deleteService(i);
    setActive((a) => (a >= i ? Math.max(0, a - 1) : a));
    setMobileOpen((m) => (m === i ? null : m !== null && m > i ? m - 1 : m));
  };

  const toggleMobile = (i) => {
    setMobileOpen((prev) => (prev === i ? null : i));
  };

  return (
    <section id="services" className="bg-warm py-20 md:py-28 border-t border-navy/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-solar" />
              <EditField k="services_label" as="span" className="text-solar font-bold tracking-label text-[11px] uppercase" />
            </div>
            <h2 className="font-heading font-semibold tracking-tightest text-navy text-4xl md:text-6xl leading-[0.95]">
              <EditField k="services_title" as="span" />
            </h2>
          </div>
          <p className="text-lg text-navy/70 max-w-sm md:text-right">
            <EditField k="services_subtitle" as="span" multiline />
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 lg:col-span-7">
            <ul className="border-t border-navy/15">
              {services.map((s, i) => {
                const isActiveDesktop = safeActive === i;
                const isMobileExpanded = mobileOpen === i;

                return (
                  <Reveal as="li" key={i} delay={i * 70} className="border-b border-navy/15">

                    {/* ── Row ─────────────────────────────────────────── */}
                    <div
                      className={`transition-colors duration-200 ${isActiveDesktop ? 'bg-skyblue/60' : ''}`}
                      onMouseEnter={() => setActive(i)}
                    >
                      <div className="w-full text-left py-6 md:py-7 px-2 md:px-4 flex items-center gap-5 md:gap-8">
                        {/* Clickable row — desktop: hover only, mobile: toggles accordion */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setActive(i);
                            toggleMobile(i);
                          }}
                          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMobile(i)}
                          className="flex items-center gap-5 md:gap-8 flex-1 text-left cursor-pointer select-none"
                        >
                          <span className={`font-heading font-semibold text-2xl md:text-3xl tabular-nums transition-colors duration-200 ${isActiveDesktop ? 'text-solar' : 'text-navy/30'}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="flex-1">
                            <span className={`block font-heading font-medium text-xl md:text-3xl tracking-tight transition-colors duration-200 ${isActiveDesktop ? 'text-electric' : 'text-navy'}`}>
                              {s.name}
                            </span>
                            {/* Description — desktop: visible on hover */}
                            <span className={`hidden md:block text-sm md:text-base text-navy/60 mt-1 overflow-hidden transition-all duration-300 ${isActiveDesktop ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                              {s.desc}
                              <Link
                                to={`/services/${getServiceSlug(s.name)}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-block ml-2 text-xs font-bold uppercase tracking-label text-electric hover:text-solar underline transition-colors"
                              >
                                En savoir plus →
                              </Link>
                            </span>
                          </span>
                        </div>

                        {/* ── Mobile chevron ── only visible on mobile ─── */}
                        <button
                          onClick={() => toggleMobile(i)}
                          className="md:hidden shrink-0 w-9 h-9 flex items-center justify-center text-navy/40 hover:text-electric active:scale-90 transition-all cursor-pointer"
                          aria-label={isMobileExpanded ? 'Fermer' : 'Ouvrir'}
                        >
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ease-out ${isMobileExpanded ? 'rotate-180 text-electric' : 'rotate-0'
                              }`}
                          />
                        </button>

                        {/* Admin controls */}
                        {isAdmin && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setEditIdx(i)} className="text-electric/60 hover:text-solar p-1" title="Modifier">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => setDeleteTargetIdx(i)} className="text-red-400/70 hover:text-red-600 p-1" title="Supprimer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Mobile accordion panel (60fps GPU Grid Animation) ───── */}
                    <div
                      className={`md:hidden accordion-grid ${isMobileExpanded ? 'is-expanded' : 'pointer-events-none'
                        }`}
                    >
                      <div className="overflow-hidden">
                        <div
                          className={`px-4 pb-6 space-y-4 transform transition-transform duration-300 ease-out ${isMobileExpanded ? 'translate-y-0' : '-translate-y-2'
                            }`}
                        >
                          {/* Description */}
                          {s.desc && (
                            <p className="text-sm text-navy/70 leading-relaxed font-normal">
                              {s.desc}
                            </p>
                          )}
                          {/* Image */}
                          {s.image && (
                            <div className="relative aspect-[16/11] w-full min-h-[240px] max-h-[360px] overflow-hidden rounded-none bg-skyblue">
                              <Image
                                src={s.image}
                                alt={s.name}
                                fittingType="fill"
                                className="w-full h-full object-cover"
                              />
                              {/* Overlay label */}
                              <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-navy/70 via-navy/30 to-transparent pointer-events-none flex items-end justify-between">
                                <span className="text-white font-heading text-sm tracking-tight">{s.name}</span>
                                <span className="text-solar font-heading font-bold text-lg tabular-nums">
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          )}
                          {/* Link to dedicated service page */}
                          <div className="pt-2">
                            <Link
                              to={`/services/${getServiceSlug(s.name)}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-label text-electric hover:text-solar transition-colors"
                            >
                              Découvrir la prestation complète →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                  </Reveal>
                );
              })}
            </ul>

            {isAdmin && (
              <button
                onClick={() => setAddOpen(true)}
                className="mt-5 inline-flex items-center gap-2 border border-dashed border-navy/30 text-navy/70 hover:border-electric hover:text-electric px-5 py-3 text-[12px] font-bold uppercase tracking-label transition-all"
              >
                <Plus size={16} /> {lang === 'fr' ? 'Ajouter un métier' : lang === 'nl' ? 'Vak toevoegen' : 'Add a trade'}
              </button>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => go('#contact')}
                className="bg-electric text-white px-7 py-4 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-all hover:-translate-y-0.5"
              >
                {t('cta_quote')} →
              </button>
              <span className="text-xs text-navy/45">
                <EditField k="services_hover_hint" as="span" />
              </span>
            </div>
          </div>

          {/* ── Desktop image panel ─────────────────────────────────── */}
          <div className="hidden lg:block col-span-12 lg:col-span-5">
            <div className="relative aspect-[4/4.4] max-h-[540px] w-full overflow-hidden bg-skyblue shadow-lg">
              <EditableImage
                src={services[safeActive]?.image || ''}
                alt={services[safeActive]?.name || ''}
                onChange={(url) => updateServiceImage(safeActive, url)}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between bg-gradient-to-t from-navy/70 via-navy/30 to-transparent pointer-events-none">
                <span className="text-white font-heading text-lg tracking-tight">{services[safeActive]?.name}</span>
                <span className="text-solar font-heading font-bold text-2xl tabular-nums">
                  {String(safeActive + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ServiceModal
        open={editIdx !== null}
        initial={editIdx !== null ? services[editIdx] : null}
        onClose={() => setEditIdx(null)}
        onSave={(data) => {
          if (editIdx !== null) updateService(editIdx, data);
          setEditIdx(null);
        }}
      />
      <ServiceModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(data) => {
          addService(data);
          setActive(services.length);
          setAddOpen(false);
        }}
      />

      <ConfirmModal
        open={deleteTargetIdx !== null}
        title="Supprimer ce métier"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTargetIdx !== null ? services[deleteTargetIdx]?.name : ''} » des services proposés ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={() => {
          if (deleteTargetIdx !== null) del(deleteTargetIdx);
          setDeleteTargetIdx(null);
        }}
        onCancel={() => setDeleteTargetIdx(null)}
      />
    </section>
  );
}