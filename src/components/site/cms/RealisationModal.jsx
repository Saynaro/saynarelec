import React, { useState, useEffect, useRef } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Image } from '@/components/ui/image';
import Modal from './Modal';
import { Upload, Check, Image as ImageIcon } from 'lucide-react';

const SIZES = [
  { id: 'compact', label: 'Compact', col: 4, row: 30 },
  { id: 'standard', label: 'Standard', col: 6, row: 36 },
  { id: 'grand', label: 'Grand', col: 8, row: 44 },
  { id: 'paysage', label: 'Paysage', col: 7, row: 28 },
  { id: 'portrait', label: 'Portrait', col: 5, row: 48 },
];

export default function RealisationModal({ open, onClose, onSave }) {
  const [image, setImage] = useState('');
  const [cat, setCat] = useState('');
  const [desc, setDesc] = useState('');
  const [size, setSize] = useState('standard');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setImage('');
      setCat('');
      setDesc('');
      setSize('standard');
    }
  }, [open]);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImage(url);
    } catch (e) {
      console.error('upload failed', e);
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e?.preventDefault();
    if (!image || !cat.trim()) return;
    const s = SIZES.find((x) => x.id === size) || SIZES[1];
    onSave({
      image,
      cat: cat.trim(),
      desc: desc.trim(),
      colSpan: s.col,
      rowSpan: s.row,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter une réalisation"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Image Upload & Preview */}
        <div className="md:col-span-6 space-y-3">
          <label className="block text-[10px] uppercase tracking-label text-navy/60 font-bold">
            Photo du projet <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            className="relative aspect-[4/3] w-full bg-skyblue/70 border-2 border-dashed border-navy/20 hover:border-electric transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-sm group"
          >
            {image ? (
              <>
                <Image src={image} alt="" fittingType="fill" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-label gap-1.5">
                  <Upload size={14} /> Changer la photo
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <ImageIcon size={32} className="mx-auto text-navy/30 mb-2 group-hover:text-electric transition-colors" />
                <p className="text-xs text-navy/70 font-medium">
                  {uploading ? 'Téléversement…' : 'Cliquez pour choisir une photo'}
                </p>
                <p className="text-[10px] text-navy/40 mt-1">PNG, JPG, WebP</p>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {/* Size selector */}
          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/60 font-bold mb-1.5">
              Format dans le collage
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`py-1.5 px-1 text-[9px] uppercase tracking-label border font-medium transition-colors cursor-pointer text-center ${
                    size === s.id
                      ? 'bg-electric text-white border-electric font-bold'
                      : 'border-navy/20 text-navy/70 hover:border-electric hover:text-navy bg-white/60'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:col-span-6 flex flex-col justify-between h-full space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/60 font-bold mb-1">
              Catégorie / Titre court <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              placeholder="Ex : Tableau Électrique, Éclairage LED…"
              className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none bg-transparent"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-label text-navy/60 font-bold mb-1">
              Description du projet
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Ex : Rénovation complète du coffret électrique avec mise aux normes RGIE..."
              className="w-full border-b border-navy/25 py-2 text-navy text-sm focus:border-electric focus:outline-none resize-none leading-relaxed bg-transparent"
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={!image || !cat.trim() || uploading}
              className="w-full bg-electric text-white py-3 text-[12px] font-bold uppercase tracking-label hover:bg-navy transition-colors disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Check size={16} /> Ajouter au collage
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-navy/20 text-navy py-2.5 text-[11px] font-bold uppercase tracking-label hover:border-navy transition-colors cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}