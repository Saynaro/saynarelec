import React, { useRef, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import EditableImage from './cms/EditableImage';
import EditableText from './cms/EditableText';
import ConfirmModal from './cms/ConfirmModal';
import { Trash2, GripVertical, ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';

const ROW_H = 10;

export default function RealisationItem({
  index,
  item,
  isAdmin,
  isDesktop,
  total,
  onUpdate,
  onMeta,
  onDelete,
  onMove,
  onOpenLightbox,
}) {
  const ref = useRef(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const startResizeW = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startCol = item.colSpan;
    const grid = ref.current?.parentElement;
    const gridW = grid?.getBoundingClientRect().width || 1200;
    const colW = gridW / 12;
    const move = (ev) => {
      const newCol = Math.max(2, Math.min(12, startCol + Math.round((ev.clientX - startX) / colW)));
      onMeta({ colSpan: newCol });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const startResizeH = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startRow = item.rowSpan;
    const move = (ev) => {
      const newRow = Math.max(12, Math.min(100, startRow + Math.round((ev.clientY - startY) / ROW_H)));
      onMeta({ rowSpan: newRow });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const desktopStyle = isDesktop
    ? {
        gridColumn: `span ${item.colSpan || 6}`,
        gridRow: `span ${item.rowSpan || 36}`,
      }
    : {};

  return (
    <Draggable draggableId={String(index)} index={index} isDragDisabled={!isAdmin || !isDesktop}>
      {(prov) => (
        <div
          ref={(r) => {
            prov.innerRef(r);
            ref.current = r;
          }}
          {...prov.draggableProps}
          style={{
            ...prov.draggableProps.style,
            ...desktopStyle,
          }}
          onClick={!isAdmin && onOpenLightbox ? () => onOpenLightbox(index) : undefined}
          className={`real-fade group relative overflow-hidden ${
            isDesktop ? '' : 'w-full aspect-[16/10] sm:aspect-[16/9]'
          } ${!isAdmin ? 'cursor-pointer' : ''}`}
        >
          <div className="relative w-full h-full overflow-hidden">
            <EditableImage
              src={item.image}
              alt={item.cat}
              onChange={(url) => onMeta({ image: url })}
              onClear={() => onMeta({ image: '' })}
              className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-85 group-hover:opacity-95 pointer-events-none" />

            {/* Project labels / details */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 md:p-7">
              <span className="inline-block text-[10px] uppercase tracking-label text-solar font-bold mb-1.5 md:mb-2">
                <EditableText as="span" value={item.cat} onChange={(v) => onUpdate({ cat: v })} />
              </span>
              <div className="text-white font-heading text-base sm:text-lg md:text-2xl tracking-tight max-w-md leading-snug md:leading-tight">
                <EditableText as="span" multiline value={item.desc} onChange={(v) => onUpdate({ desc: v })} />
              </div>
            </div>

            {/* Counter + Zoom indicator on mobile/desktop */}
            {!isAdmin && (
              <div className="absolute top-3.5 right-3.5 flex items-center gap-2 pointer-events-none">
                <span className="text-white/70 font-heading text-xs md:text-sm tabular-nums bg-navy/40 px-2 py-0.5 rounded-sm backdrop-blur-xs">
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <span className="text-white/60 group-hover:text-solar transition-colors p-1 bg-navy/40 rounded-sm">
                  <Maximize2 size={13} />
                </span>
              </div>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <>
                <div
                  {...prov.dragHandleProps}
                  className="absolute top-3 left-3 z-30 bg-white/80 text-navy p-1 cursor-grab active:cursor-grabbing"
                  title="Déplacer"
                >
                  <GripVertical size={16} />
                </div>
                <div className="absolute top-3 right-3 z-30 flex gap-1">
                  <button onClick={() => onMove(-1)} className="bg-white/80 text-navy p-1 hover:bg-solar" title="Précédent">
                    <ArrowLeft size={14} />
                  </button>
                  <button onClick={() => onMove(1)} className="bg-white/80 text-navy p-1 hover:bg-solar" title="Suivant">
                    <ArrowRight size={14} />
                  </button>
                  <button onClick={() => setConfirmDeleteOpen(true)} className="bg-white text-navy hover:bg-red-500 hover:text-white p-1" title="Supprimer">
                    <Trash2 size={14} />
                  </button>
                </div>

                <ConfirmModal
                  open={confirmDeleteOpen}
                  title="Supprimer la réalisation"
                  message={`Êtes-vous sûr de vouloir supprimer le projet « ${item.cat || 'cette réalisation'} » ?`}
                  confirmText="Supprimer"
                  cancelText="Annuler"
                  onConfirm={() => {
                    setConfirmDeleteOpen(false);
                    onDelete();
                  }}
                  onCancel={() => setConfirmDeleteOpen(false)}
                />
                {isDesktop && (
                  <>
                    <div
                      onPointerDown={startResizeW}
                      className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize hover:bg-electric/50 z-20"
                      title="Largeur"
                    />
                    <div
                      onPointerDown={startResizeH}
                      className="absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize hover:bg-electric/50 z-20"
                      title="Hauteur"
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}