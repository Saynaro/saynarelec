import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function Lightbox({ items, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);

  const total = items.length;
  const currentItem = items[currentIndex];

  const goTo = (idx) => {
    if (idx >= 0 && idx < total) {
      setCurrentIndex(idx);
    }
  };

  const onPrev = currentIndex > 0 ? () => goTo(currentIndex - 1) : null;
  const onNext = currentIndex < total - 1 ? () => goTo(currentIndex + 1) : null;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKey);

    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = origOverflow;
    };
  }, [currentIndex, onClose, onPrev, onNext]);

  // Touch Swipe Handling
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Only drag horizontally if horizontal movement is dominant
    if (Math.abs(diffX) > Math.abs(diffY)) {
      touchDeltaX.current = diffX;
      // Resistance at edges
      if ((currentIndex === 0 && diffX > 0) || (currentIndex === total - 1 && diffX < 0)) {
        setDragOffset(diffX * 0.25);
      } else {
        setDragOffset(diffX);
      }
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    const threshold = 45;

    if (touchDeltaX.current < -threshold && currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (touchDeltaX.current > threshold && currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }

    setDragOffset(0);
    touchDeltaX.current = 0;
  };

  if (!currentItem) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex flex-col justify-between select-none touch-pan-y"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        backgroundColor: '#0b1b2b',
        paddingTop: 'max(14px, env(safe-area-inset-top))',
        paddingBottom: 'max(18px, env(safe-area-inset-bottom))',
      }}
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full max-w-5xl mx-auto flex items-center justify-between text-white px-4 py-2 z-20 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-heading text-xs sm:text-sm uppercase tracking-label font-bold text-solar flex items-center gap-2">
          {currentItem.cat}
          {total > 1 && (
            <span className="text-white/50 ml-1 font-normal tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          )}
        </span>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white transition-all cursor-pointer"
          title="Fermer"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Slider Track Viewport */}
      <div
        className="relative w-full flex-1 flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Prev Arrow Button */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-navy/80 sm:bg-navy/70 hover:bg-electric text-white border border-white/15 transition-all active:scale-90 cursor-pointer shadow-lg"
            title="Précédent"
          >
            <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Sliding Multi-Item Track */}
        <div
          className="w-full h-full max-h-[72vh] flex items-center"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {items.map((it, idx) => (
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 flex items-center justify-center px-0"
              style={{ width: '100%' }}
            >
              <Image
                src={it.image}
                alt={it.cat || ''}
                fittingType="contain"
                className="w-full h-auto max-h-[72vh] object-contain pointer-events-none select-none"
              />
            </div>
          ))}
        </div>

        {/* Next Arrow Button */}
        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-navy/80 sm:bg-navy/70 hover:bg-electric text-white border border-white/15 transition-all active:scale-90 cursor-pointer shadow-lg"
            title="Suivant"
          >
            <ChevronRight size={22} className="sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom bar: description & swipe hint on mobile */}
      <div
        className="w-full max-w-3xl mx-auto text-center z-20 px-4 pt-2 pb-1 shrink-0 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.desc && (
          <p className="text-white/95 font-heading text-sm sm:text-base md:text-lg leading-snug">
            {currentItem.desc}
          </p>
        )}
        {total > 1 && (
          <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1 sm:hidden">
            ← Glissez pour naviguer →
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
