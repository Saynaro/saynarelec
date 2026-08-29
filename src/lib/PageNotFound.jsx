import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { ArrowLeft, Home, Zap, Shield, Sun } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between">
      <SEO
        title="Page Non Trouvée (404) | Saynarelec"
        description="La page demandée n'existe pas ou a été déplacée. Retrouvez tous nos services d'électricité en Belgique."
        noindex={true}
      />

      <header className="border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-2xl tracking-tightest text-white">
            SAYNARELEC
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-solar uppercase tracking-label font-bold">
            <ArrowLeft size={14} /> Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <span className="font-heading font-extrabold text-7xl sm:text-9xl text-solar/20 tracking-widest block select-none">
          404
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mt-4 mb-4">
          Page introuvable
        </h1>
        <p className="text-white/70 text-base sm:text-lg max-w-md mx-auto mb-8">
          La page que vous recherchez semble avoir été déplacée ou n'existe plus.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-solar text-navy font-semibold px-6 py-3 rounded-xl hover:bg-solar/90 transition-all shadow-lg shadow-solar/20 text-sm"
          >
            <Home size={16} /> Page d'accueil
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all border border-white/15 text-sm"
          >
            Demander un devis
          </Link>
        </div>

        <div className="border-t border-white/10 pt-10 text-left">
          <p className="text-xs uppercase tracking-label text-solar font-bold mb-4 text-center">
            NOS PRINCIPALES PRESTATIONS EN BELGIQUE
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-sm">
            <Link to="/services/electricite-generale" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-solar transition-colors flex items-center gap-2">
              <Zap size={14} className="text-solar" /> Électricité générale
            </Link>
            <Link to="/services/renovation-electrique" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-solar transition-colors flex items-center gap-2">
              <Zap size={14} className="text-solar" /> Rénovation électrique
            </Link>
            <Link to="/services/mise-en-conformite" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-solar transition-colors flex items-center gap-2">
              <Shield size={14} className="text-solar" /> Mise en conformité RGIE
            </Link>
            <Link to="/services/panneaux-solaires" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-solar transition-colors flex items-center gap-2">
              <Sun size={14} className="text-solar" /> Panneaux solaires
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Saynarelec — Électricité & Solaire · Belgique
      </footer>
    </div>
  );
}