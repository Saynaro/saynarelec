import React, { useState, useEffect, useRef } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Image } from '@/components/ui/image';
import Modal from './Modal';

export default function ServiceModal({ open, onClose, initial, onSave }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name || '');
      setDesc(initial?.desc || '');
      setImage(initial?.image || '');
    }
  }, [open, initial]);

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
    if (!name) return;
    onSave({ name, desc, image });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Modifier le métier' : 'Ajouter un métier'}>
      <div className="space-y-4">
        <div className="aspect-[16/10] bg-skyblue relative overflow-hidden">
          {image ? (
            <Image src={image} alt="" fittingType="fill" className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy/40 text-sm">Aucune image</div>
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
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-navy/25 py-2 text-navy focus:border-electric focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-label text-navy/55 mb-1">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            className="w-full border-b border-navy/25 py-2 text-navy focus:border-electric focus:outline-none resize-none"
          />
        </div>
        <button
          onClick={submit}
          disabled={!name}
          className="w-full bg-electric text-white py-3 text-[12px] font-bold uppercase tracking-label disabled:opacity-40"
        >
          Enregistrer
        </button>
      </div>
    </Modal>
  );
}