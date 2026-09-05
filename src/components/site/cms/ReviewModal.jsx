import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Star } from 'lucide-react';

const CATEGORIES = [
  { value: 'conformite', label: 'Mise en conformité' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'solaire', label: 'Panneaux solaires' },
  { value: 'depannage', label: 'Dépannage' },
  { value: 'eclairage', label: 'Éclairage' },
  { value: 'generale', label: 'Électricité générale' },
];

export default function ReviewModal({ open, onClose, initial, onSave }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [project, setProject] = useState('');
  const [category, setCategory] = useState('conformite');
  const [rating, setRating] = useState(5);
  const [date, setDate] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      setName(initial?.name || '');
      setLocation(initial?.location || '');
      setProject(initial?.project || '');
      setCategory(initial?.category || 'conformite');
      setRating(Number(initial?.rating) || 5);
      setDate(initial?.date || '');
      setText(initial?.text || '');
    }
  }, [open, initial]);

  const submit = (e) => {
    e?.preventDefault();
    if (!name.trim() || !text.trim()) return;
    onSave({
      name: name.trim(),
      location: location.trim() || 'Belgique',
      project: project.trim() || 'Prestation Saynarelec',
      category,
      rating: Number(rating) || 5,
      date: date.trim() || 'Récemment',
      text: text.trim(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier le témoignage client' : 'Ajouter un avis client'}
    >
      <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
              Nom du client <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Sophie & Laurent M."
              className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
              Localisation (Ville en Belgique)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex : Bruxelles (Uccle), Waterloo..."
              className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
              Catégorie de prestation
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-b border-navy/25 py-2 text-navy text-sm bg-transparent focus:border-electric focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
              Note (Étoiles)
            </label>
            <div className="flex items-center gap-1.5 py-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-solar transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={20}
                    className={star <= rating ? 'fill-solar text-solar' : 'text-navy/20'}
                  />
                </button>
              ))}
              <span className="text-xs text-navy/70 ml-2 font-bold">{rating}/5</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
              Titre du projet / Travaux réalisés
            </label>
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="Ex : Mise en conformité RGIE & Nouveau coffret"
              className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
              Date ou période
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Ex : Février 2025"
              className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1 font-bold">
            Témoignage client <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Texte détaillé du retour d'expérience du client..."
            className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={!name.trim() || !text.trim()}
            className="flex-1 bg-electric text-white py-3 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-colors disabled:opacity-40 cursor-pointer"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 border border-navy/25 text-navy text-[12px] font-bold uppercase tracking-label hover:border-navy transition-colors cursor-pointer"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
