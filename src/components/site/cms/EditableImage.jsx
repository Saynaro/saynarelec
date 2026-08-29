import React, { useRef, useState } from 'react';
import { Image } from '@/components/ui/image';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useContent } from '@/lib/content';
import { cn } from '@/lib/utils';
import ConfirmModal from './ConfirmModal';

export default function EditableImage({
  src,
  onChange,
  onClear = null,
  alt = '',
  className = '',
  btnClassName = '',
  fittingType = 'fill',
}) {
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
      console.error('Upload error:', e);
      setError("Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fittingType={fittingType}
        className={cn("w-full h-full object-cover", className)}
      />
      {isAdmin && (
        <div className={cn("absolute top-3 right-3 flex flex-col items-end gap-1.5 z-20", btnClassName)}>
          <div className="flex gap-1.5">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="bg-electric text-white text-[10px] uppercase tracking-label px-2.5 py-1.5 hover:bg-navy disabled:opacity-60 cursor-pointer shadow-md"
            >
              {uploading ? '…' : 'Remplacer'}
            </button>
            {onClear && (
              <button
                onClick={() => setConfirmClearOpen(true)}
                className="bg-white text-navy text-[10px] uppercase tracking-label px-2.5 py-1.5 hover:bg-red-600 hover:text-white transition-colors cursor-pointer shadow-md"
              >
                Supprimer
              </button>
            )}
          </div>
          {error && (
            <span className="bg-red-500 text-white text-[9px] px-2 py-1 max-w-[180px] text-right shadow">
              {error}
            </span>
          )}
        </div>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-navy/50 backdrop-blur-xs flex items-center justify-center z-30">
          <span className="text-white text-xs font-bold uppercase tracking-label animate-pulse">
            Téléversement…
          </span>
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