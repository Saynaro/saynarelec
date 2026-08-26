import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Check, X } from 'lucide-react';
import { useContent } from '@/lib/content';

// Modal portal — always renders outside the DOM tree in document.body
function EditModal({ label, value, multiline, onSave, onClose }) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // select all text on open
    if (inputRef.current) {
      inputRef.current.select?.();
    }
  }, []);

  const save = () => { onSave(draft); onClose(); };

  const handleKey = (e) => {
    if (e.key === 'Escape') { onClose(); }
    if (e.key === 'Enter' && !multiline && !e.shiftKey) { e.preventDefault(); save(); }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4"
      style={{ background: 'rgba(10,18,40,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white shadow-2xl w-full max-w-lg"
        style={{ borderTop: '3px solid #e6a817' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-navy/10">
          <span className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-navy/50 font-bold">
            <Pencil size={12} className="text-solar" />
            Modifier le texte
          </span>
          <button
            onClick={onClose}
            className="text-navy/40 hover:text-navy transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Input */}
        <div className="p-5">
          {/* Preview of what's being edited */}
          {label && (
            <p className="text-[10px] uppercase tracking-label text-navy/40 mb-3">{label}</p>
          )}
          {multiline ? (
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              rows={5}
              className="w-full border border-navy/20 focus:border-electric focus:outline-none p-3 text-navy text-base resize-none font-sans leading-relaxed"
              style={{ fontFamily: 'inherit', fontSize: '15px' }}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              className="w-full border border-navy/20 focus:border-electric focus:outline-none p-3 text-navy text-base font-sans"
              style={{ fontFamily: 'inherit', fontSize: '15px' }}
            />
          )}
          {!multiline && (
            <p className="mt-1.5 text-[10px] text-navy/35">Appuyez sur Entrée pour enregistrer · Échap pour annuler</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={save}
            className="flex-1 bg-electric text-white py-2.5 text-[11px] font-bold uppercase tracking-label hover:bg-navy transition-colors flex items-center justify-center gap-2"
          >
            <Check size={14} /> Enregistrer
          </button>
          <button
            onClick={onClose}
            className="px-5 border border-navy/20 text-navy text-[11px] uppercase tracking-label hover:border-navy/50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function EditableText({
  value,
  onChange,
  className = '',
  as: Tag = 'p',
  multiline = false,
  placeholder = '',
  label = '',
}) {
  const { isAdmin } = useContent();
  const [editing, setEditing] = useState(false);

  if (!isAdmin) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  return (
    <>
      <Tag className={className} style={{ position: 'relative' }}>
        {value || placeholder}
        <span
          role="button"
          tabIndex={0}
          onClick={() => setEditing(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setEditing(true);
            }
          }}
          className="inline-flex items-center ml-2 align-middle text-solar/70 hover:text-solar cursor-pointer transition-colors"
          title="Modifier"
        >
          <Pencil size={13} />
        </span>
      </Tag>

      {editing && (
        <EditModal
          label={label}
          value={value || ''}
          multiline={multiline}
          onSave={onChange}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}