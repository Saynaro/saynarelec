import React, { useRef, useState } from 'react';
import { Image } from '@/components/ui/image';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';
import { useContent } from '@/lib/content';
import ConfirmModal from './ConfirmModal';

export default function EditableImage({ src, onChange, onClear, alt, className, fittingType = 'fill' }) {
  const { isAdmin } = useContent();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (e) {
      console.error('upload failed', e);
      setError(isCloudinaryConfigured() ? 'Erreur upload.' : 'Cloudinary non configuré.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <Image src={src} alt={alt} fittingType={fittingType} className={className} />
      {isAdmin && (
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-30">
          <div className="flex gap-1.5">
            <button
              onClick={() => isCloudinaryConfigured() ? inputRef.current?.click() : setError('Cloudinary non configuré dans .env')}
              disabled={uploading}
              className="bg-electric text-white text-[10px] uppercase tracking-label px-2.5 py-1.5 hover:bg-navy disabled:opacity-60 cursor-pointer"
            >
              {uploading ? '…' : 'Remplacer'}
            </button>
            {onClear && (
              <button
                onClick={() => setConfirmClearOpen(true)}
                className="bg-white text-navy text-[10px] uppercase tracking-label px-2.5 py-1.5 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            )}
          </div>
          {error && (
            <span className="bg-red-500 text-white text-[9px] px-2 py-1 max-w-[180px] text-right">{error}</span>
          )}
        </div>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-navy/40 flex items-center justify-center z-30">
          <span className="text-white text-sm">Upload…</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <ConfirmModal
        open={confirmClearOpen}
        title="Supprimer l'image"
        message="Êtes-vous sûr de vouloir supprimer cette image ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={() => {
          setConfirmClearOpen(false);
          onClear();
        }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}