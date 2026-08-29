import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-navy/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-warm w-full ${maxWidth} max-h-[92vh] my-auto flex flex-col relative shadow-2xl rounded-sm border border-navy/15`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10 bg-warm/95 sticky top-0 z-10 shrink-0">
          <h3 className="font-heading font-semibold text-navy text-lg sm:text-xl">{title}</h3>
          <button
            onClick={onClose}
            className="text-navy/45 hover:text-navy p-1 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}