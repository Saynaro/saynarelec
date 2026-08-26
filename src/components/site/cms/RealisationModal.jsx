import React, { useState, useEffect, useRef } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Image } from '@/components/ui/image';
import Modal from './Modal';

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

  const submit = () => {
    if (!image || !cat) return;
    const s = SIZES.find((x) => x.id === size);
    onSave({ image, cat, desc, colSpan: s.col, rowSpan: s.row });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajouter une réalisation">
      <div className="space-y-4">
        <div className="aspect-[4/3] bg-skyblue relative overflow-hidden">
          {image ? (
            <Image src={image} alt="" fittingType="fill" className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy/40 text-sm">
              Aucune image
            </div>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 left-2 bg-electric text-white text-[10px] uppercase tracking-label px-3 py-1.5"
          >
            {uploading ? '…' : 'Choisir image'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <input
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            placeholder="Ex : Électricité, Solaire…"
            className="w-full border-b border-navy/25 py-2 text-navy focus:border-electric focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
            placeholder="Court descriptif du chantier"
            className="w-full border-b border-navy/25 py-2 text-navy focus:border-electric focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">
            Taille dans le collage
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSize(s.id)}
                className={`py-2 text-[10px] uppercase tracking-label border transition-colors ${
                  size === s.id
                    ? 'bg-electric text-white border-electric'
                    : 'border-navy/25 text-navy hover:border-electric'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-navy/45 mt-1">
            Astuce : une fois ajoutée, vous pouvez la déplacer et ajuster sa largeur/hauteur en tirant ses bords.
          </p>
        </div>

        <button
          onClick={submit}
          disabled={!image || !cat}
          className="w-full bg-electric text-white py-3 text-[12px] font-bold uppercase tracking-label disabled:opacity-40"
        >
          Ajouter au collage
        </button>
      </div>
    </Modal>
  );
}