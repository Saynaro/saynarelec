import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-warm w-full max-w-lg p-6 md:p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-semibold text-navy text-xl">{title}</h3>
          <button onClick={onClose} className="text-navy/50 hover:text-navy">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}