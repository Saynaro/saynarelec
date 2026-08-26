import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  open,
  title = 'Confirmer la suppression',
  message = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  confirmText = 'Supprimer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  destructive = true,
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener('keydown', handleKey);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = origOverflow;
    };
  }, [open, onConfirm, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm animate-fadeIn select-none"
      onClick={onCancel}
    >
      <div
        className="bg-white max-w-md w-full shadow-2xl overflow-hidden border-t-4 border-red-500 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-navy text-lg leading-snug">
                {title}
              </h3>
              <span className="text-[10px] uppercase tracking-label font-bold text-navy/40">
                Action irréversible
              </span>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-navy/40 hover:text-navy p-1 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Message */}
        <div className="px-6 py-2">
          <p className="text-sm text-navy/75 leading-relaxed font-normal">
            {message}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 mt-2 bg-warm/50 border-t border-navy/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-navy/20 text-navy text-xs font-bold uppercase tracking-label hover:border-navy/50 hover:bg-white transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 text-white text-xs font-bold uppercase tracking-label inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              destructive
                ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                : 'bg-electric hover:bg-navy'
            }`}
          >
            <Trash2 size={14} />
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
