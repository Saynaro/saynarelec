import React, { useState } from 'react';
import { useContent } from '@/lib/content';
import { useLang } from '@/lib/i18n';
import EditField from './cms/EditField';
import EditableText from './cms/EditableText';
import Reveal from './Reveal';
import ConfirmModal from './cms/ConfirmModal';
import { Plus, Trash2, Pencil } from 'lucide-react';

export default function Process() {
  const { t, lang } = useLang();
  const { processSteps, isAdmin, updateStep, addStep, deleteStep } = useContent();
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState({ title: '', desc: '' });
  const [deleteTargetIdx, setDeleteTargetIdx] = useState(null);

  const startEdit = (i) => {
    setEditIdx(i);
    setDraft({ title: processSteps[i].title, desc: processSteps[i].desc });
  };
  const saveEdit = () => {
    if (editIdx !== null) updateStep(editIdx, draft);
    setEditIdx(null);
  };

  return (
    <section className="bg-warm py-20 md:py-28 border-t border-navy/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <Reveal className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-solar" />
            <EditField k="process_label" as="span" className="text-solar font-bold tracking-label text-[11px] uppercase" />
          </div>
          <h2 className="font-heading font-semibold tracking-tightest text-navy text-4xl md:text-6xl leading-[0.95] max-w-2xl">
            <EditField k="process_title" as="span" />
          </h2>
        </Reveal>

        <div className="hidden md:grid grid-cols-5 gap-0 border-t border-navy/15">
          {processSteps.map((s, i) => (
            <Reveal key={i} delay={i * 90} className="relative pt-8 pr-6 border-r border-navy/15 last:border-r-0">
              <span className="font-heading font-bold text-5xl text-electric block tabular-nums leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="mt-6">
                {editIdx === i ? (
                  <div>
                    <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full border-b border-electric/50 py-1 text-navy font-heading font-semibold text-lg focus:outline-none" />
                    <textarea value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} rows={2} className="w-full mt-2 border-b border-electric/50 py-1 text-sm text-navy/70 resize-none focus:outline-none" />
                    <button onClick={saveEdit} className="mt-2 bg-electric text-white px-3 py-1 text-[10px] uppercase tracking-label cursor-pointer">OK</button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-heading font-semibold text-navy text-lg">{s.title}</h3>
                    <p className="mt-2 text-sm text-navy/60 leading-relaxed">{s.desc}</p>
                  </>
                )}
              </div>
              {i < processSteps.length - 1 && <span className="absolute top-8 right-3 text-solar">→</span>}
              {isAdmin && editIdx !== i && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => startEdit(i)} className="text-electric/60 hover:text-solar p-1 cursor-pointer"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTargetIdx(i)} className="text-red-400/70 hover:text-red-600 p-1 cursor-pointer" title="Supprimer"><Trash2 size={14} /></button>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <div className="md:hidden border-t border-navy/15">
          {processSteps.map((s, i) => (
            <Reveal key={i} className="py-6 border-b border-navy/15 flex gap-5">
              <span className="font-heading font-bold text-4xl text-electric tabular-nums leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-navy text-lg">{s.title}</h3>
                <p className="mt-1 text-sm text-navy/60 leading-relaxed">{s.desc}</p>
              </div>
              {isAdmin && (
                <div className="flex flex-col gap-1">
                  <button onClick={() => startEdit(i)} className="text-electric/60 hover:text-solar cursor-pointer"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTargetIdx(i)} className="text-red-400/70 hover:text-red-600 cursor-pointer" title="Supprimer"><Trash2 size={14} /></button>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={() => addStep({ title: lang === 'fr' ? 'Nouvelle étape' : lang === 'nl' ? 'Nieuwe stap' : 'New step', desc: '' })}
            className="mt-6 inline-flex items-center gap-2 border border-dashed border-navy/30 text-navy/70 hover:border-electric hover:text-electric px-5 py-3 text-[12px] font-bold uppercase tracking-label transition-all cursor-pointer"
          >
            <Plus size={16} /> {lang === 'fr' ? 'Ajouter une étape' : lang === 'nl' ? 'Stap toevoegen' : 'Add a step'}
          </button>
        )}

        <ConfirmModal
          open={deleteTargetIdx !== null}
          title="Supprimer cette étape"
          message={`Êtes-vous sûr de vouloir supprimer l'étape « ${deleteTargetIdx !== null ? processSteps[deleteTargetIdx]?.title : ''} » ?`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={() => {
            if (deleteTargetIdx !== null) deleteStep(deleteTargetIdx);
            setDeleteTargetIdx(null);
          }}
          onCancel={() => setDeleteTargetIdx(null)}
        />
      </div>
    </section>
  );
}