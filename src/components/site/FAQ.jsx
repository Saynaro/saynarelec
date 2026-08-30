import React, { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content';
import Reveal from './Reveal';
import FaqModal from './cms/FaqModal';
import ConfirmModal from './cms/ConfirmModal';
import { ChevronDown, Pencil, Trash2, Plus } from 'lucide-react';

export default function FAQ({ customFaqs = null, onUpdateCustomFaqs = null, className = "" }) {
  const { lang } = useLang();
  const { isAdmin, faqs, updateFaq, addFaq, deleteFaq } = useContent();
  const [openIndex, setOpenIndex] = useState(0);

  // CMS modal state
  const [editIdx, setEditIdx] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);

  // List of FAQs to render
  const list = customFaqs || faqs || [];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleSave = ({ q, a }) => {
    if (editIdx !== null) {
      if (onUpdateCustomFaqs && customFaqs) {
        const next = customFaqs.map((item, i) => (i === editIdx ? { q, a } : item));
        onUpdateCustomFaqs(next);
      } else {
        updateFaq(editIdx, { q, a });
      }
      setEditIdx(null);
    } else if (addOpen) {
      if (onUpdateCustomFaqs && customFaqs) {
        const next = [...customFaqs, { q, a }];
        onUpdateCustomFaqs(next);
        setOpenIndex(customFaqs.length);
      } else {
        addFaq({ q, a });
        setOpenIndex(list.length);
      }
      setAddOpen(false);
    }
  };

  const handleDelete = () => {
    if (deleteIdx === null) return;
    if (onUpdateCustomFaqs && customFaqs) {
      const next = customFaqs.filter((_, i) => i !== deleteIdx);
      onUpdateCustomFaqs(next);
    } else {
      deleteFaq(deleteIdx);
    }
    if (openIndex === deleteIdx) setOpenIndex(null);
    setDeleteIdx(null);
  };

  const resolveFaqText = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val[lang] || val.fr || val.nl || val.en || '';
    return String(val);
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
            <span className="w-8 h-px bg-solar" />
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
              <Reveal key={idx} delay={idx * 40}>
                <div
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-electric bg-white shadow-md' : 'border-navy/15 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between p-5 sm:p-6 gap-3">
                    <button
                      onClick={() => toggle(idx)}
                      className="flex-1 text-left flex items-center justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-heading font-medium text-navy text-lg sm:text-xl pr-2">
                        {resolveFaqText(item.q)}
                      </span>
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? 'bg-electric text-white rotate-180' : 'bg-navy/5 text-navy/60'
                        }`}
                      >
                        <ChevronDown size={18} />
                      </span>
                    </button>

                    {/* Admin Action Buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0 ml-2 border-l border-navy/10 pl-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditIdx(idx);
                          }}
                          className="p-1.5 text-navy/40 hover:text-solar transition-colors cursor-pointer"
                          title="Modifier cette question"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteIdx(idx);
                          }}
                          className="p-1.5 text-red-400/60 hover:text-red-600 transition-colors cursor-pointer"
                          title="Supprimer cette question"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100 px-5 sm:px-6 pb-6' : 'max-h-0 opacity-0 overflow-hidden px-5 sm:px-6 pb-0'
                    }`}
                  >
                    <div className="pt-2 border-t border-navy/10 text-navy/75 text-sm sm:text-base leading-relaxed">
                      {resolveFaqText(item.a)}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}

          {/* Admin Add FAQ Button */}
          {isAdmin && (
            <div className="pt-4 text-center">
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-2 border border-dashed border-navy/30 hover:border-electric text-navy/70 hover:text-electric px-6 py-3 text-xs font-bold uppercase tracking-label transition-all cursor-pointer bg-white/50"
              >
                <Plus size={16} /> {lang === 'nl' ? 'Vraag toevoegen' : lang === 'en' ? 'Add FAQ item' : 'Ajouter une question fréquente'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit & Add Modals */}
      <FaqModal
        open={editIdx !== null}
        onClose={() => setEditIdx(null)}
        initial={editIdx !== null ? list[editIdx] : null}
        onSave={handleSave}
      />

      <FaqModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        initial={null}
        onSave={handleSave}
      />

      <ConfirmModal
        open={deleteIdx !== null}
        title="Supprimer cette question"
        message="Êtes-vous sûr de vouloir supprimer cette question fréquente ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDelete}
        onCancel={() => setDeleteIdx(null)}
      />
    </section>
  );
}
