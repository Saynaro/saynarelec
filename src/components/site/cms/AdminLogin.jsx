import React, { useState } from 'react';
import { useContent } from '@/lib/content';
import Modal from './Modal';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin({ open, onClose }) {
  const { login } = useContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (result.field === 'email') {
      setError('Adresse e-mail incorrecte.');
    } else {
      setError('Mot de passe incorrect.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Espace administrateur">
      <p className="text-sm text-navy/60 mb-5">
        Connectez-vous pour modifier le contenu du site.
      </p>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border-l-2 border-red-500">{error}</div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-navy/25 py-2 pl-9 pr-3 text-navy focus:border-electric focus:outline-none text-sm"
              placeholder="contact@saynarelec.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">Mot de passe</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-navy/25 py-2 pl-9 pr-9 text-navy focus:border-electric focus:outline-none text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-navy/40 hover:text-navy transition-colors cursor-pointer"
              title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-electric text-white py-3 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-colors cursor-pointer mt-2"
        >
          Se connecter
        </button>
      </form>
    </Modal>
  );
}