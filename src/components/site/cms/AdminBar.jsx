import React from 'react';
import { LogOut, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useContent } from '@/lib/content';

export default function AdminBar() {
  const { isAdmin, logout, isSaving, saveError } = useContent();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[90] bg-electric text-white px-5 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-label font-bold hidden sm:inline">
          Mode édition · Saynarelec
        </span>
        <span className="text-[11px] uppercase tracking-label font-bold sm:hidden">Édition</span>

        {/* Save status indicator */}
        {isSaving && (
          <span className="flex items-center gap-1.5 text-white/70 text-[10px] uppercase tracking-label animate-pulse">
            <Loader2 size={12} className="animate-spin" />
            Sauvegarde…
          </span>
        )}
        {!isSaving && saveError && (
          <span className="flex items-center gap-1.5 text-red-300 text-[10px] uppercase tracking-label" title={saveError}>
            <CloudOff size={12} />
            Erreur BD
          </span>
        )}
        {!isSaving && !saveError && (
          <span className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase tracking-label">
            <Cloud size={12} />
            Supabase
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={logout}
          className="bg-solar text-navy text-[11px] uppercase tracking-label font-bold px-3.5 py-2 inline-flex items-center gap-1.5 hover:bg-white transition-colors cursor-pointer shadow-xs"
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </div>
  );
}