import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function FaqModal({ open, onClose, initial, onSave }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (open) {
      setQuestion(initial?.q || '');
      setAnswer(initial?.a || '');
    }
  }, [open, initial]);

  const submit = (e) => {
    e?.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    onSave({ q: question.trim(), a: answer.trim() });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier la question fréquente' : 'Ajouter une question fréquente'}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
            Question <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex : Quel est le délai d'intervention ?"
            className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
            Réponse <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Rédigez une réponse claire et détaillée..."
            className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={!question.trim() || !answer.trim()}
            className="flex-1 bg-electric text-white py-3 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-colors disabled:opacity-40"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 border border-navy/25 text-navy text-[12px] font-bold uppercase tracking-label hover:border-navy transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
