import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useContent } from '@/lib/content';
import { useLang } from '@/lib/i18n';
import EditField from './cms/EditField';
import RealisationItem from './RealisationItem';
import RealisationModal from './cms/RealisationModal';
import Lightbox from './Lightbox';
import { Plus } from 'lucide-react';

const INITIAL_DESKTOP_ROWS = 3;
const INITIAL_MOBILE_ITEMS = 5;

const useIsDesktop = () => {
  const [d, setD] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  useEffect(() => {
    const on = () => setD(window.innerWidth >= 1024);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return d;
};

/**
 * Calculates how many items fit into `targetRows` based on their colSpan (12 cols per row).
 */
function getCountForRows(items, targetRows) {
  if (!items || items.length === 0) return 0;
  let rowCount = 0;
  let currentCols = 0;
  let count = 0;

  for (let i = 0; i < items.length; i++) {
    const span = Math.max(2, Math.min(12, Number(items[i].colSpan) || 6));
    // If this card pushes past the 12-column boundary, advance to next row
    if (currentCols + span > 12 && currentCols > 0) {
      rowCount++;
      currentCols = 0;
    }
    if (rowCount >= targetRows) {
      break;
    }
    currentCols += span;
    count++;
    if (currentCols >= 12) {
      rowCount++;
      currentCols = 0;
    }
  }

  return count > 0 ? count : items.length;
}

export default function Realisations() {
  const { t, lang } = useLang();
  const { realisations, rawRealisations, isAdmin, updateRealisation, updateRealisationMeta, addRealisation, deleteRealisation, reorderRealisations } = useContent();
  const isDesktop = useIsDesktop();

  // Desktop row-based pagination & mobile item-based pagination
  const [desktopRows, setDesktopRows] = useState(INITIAL_DESKTOP_ROWS);
  const [mobileItems, setMobileItems] = useState(INITIAL_MOBILE_ITEMS);
  const [addOpen, setAddOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const visibleCount = isDesktop
    ? getCountForRows(realisations, desktopRows)
    : mobileItems;

  const shown = realisations.slice(0, visibleCount);
  const hasMore = visibleCount < realisations.length;
  const isExpanded = isDesktop
    ? desktopRows > INITIAL_DESKTOP_ROWS
    : mobileItems > INITIAL_MOBILE_ITEMS;

  const onDragEnd = (res) => {
    if (!res.destination || res.destination.index === res.source.index) return;
    const raw = rawRealisations ?? realisations;
    const arr = Array.from(raw);
    const [moved] = arr.splice(res.source.index, 1);
    arr.splice(res.destination.index, 0, moved);
    reorderRealisations(arr);
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= (rawRealisations ?? realisations).length) return;
    const raw = rawRealisations ?? realisations;
    const arr = Array.from(raw);
    [arr[i], arr[j]] = [arr[j], arr[i]];
    reorderRealisations(arr);
  };

  const handleShowMore = () => {
    if (isDesktop) {
      setDesktopRows((r) => r + 2); // show +2 rows on PC
    } else {
      setMobileItems((m) => Math.min(realisations.length, m + 5)); // show +5 items on mobile
    }
  };

  const handleShowLess = () => {
    if (isDesktop) {
      setDesktopRows(INITIAL_DESKTOP_ROWS);
    } else {
      setMobileItems(INITIAL_MOBILE_ITEMS);
    }
    // Smoothly scroll to the bottom of the collapsed collage
    setTimeout(() => {
      const el = document.getElementById('realisations-bottom');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 60);
  };

  return (
    <section id="realisations" className="bg-warm py-20 md:py-28 border-t border-navy/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-solar" />
              <EditField k="real_label" as="span" className="text-solar font-bold tracking-label text-[11px] uppercase" />
            </div>
            <h2 className="font-heading font-semibold tracking-tightest text-navy text-4xl md:text-6xl leading-[0.95]">
              <EditField k="real_title" as="span" />
            </h2>
          </div>
          <p className="text-lg text-navy/70 max-w-sm md:text-right">
            <EditField k="real_subtitle" as="span" multiline />
          </p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="realisations" direction={isDesktop ? 'horizontal' : 'vertical'} isDropDisabled={!isAdmin || !isDesktop}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={
                  isDesktop
                    ? 'grid grid-cols-12 gap-4 md:gap-6 auto-rows-[10px] grid-flow-dense'
                    : 'flex flex-col gap-5 w-full'
                }
              >
                {shown.map((p, i) => (
                  <RealisationItem
                    key={i}
                    index={i}
                    item={p}
                    isAdmin={isAdmin}
                    isDesktop={isDesktop}
                    total={realisations.length}
                    onUpdate={(partial) => updateRealisation(i, partial)}
                    onMeta={(meta) => updateRealisationMeta(i, meta)}
                    onDelete={() => deleteRealisation(i)}
                    onMove={(dir) => move(i, dir)}
                    onOpenLightbox={(idx) => setLightboxIdx(idx)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div id="realisations-bottom" className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {hasMore && (
            <button
              onClick={handleShowMore}
              className="border border-navy/25 text-navy px-7 py-3.5 text-[12px] font-bold uppercase tracking-label hover:border-electric hover:text-electric transition-all cursor-pointer"
            >
              {t('real_show_more')} →
            </button>
          )}

          {!hasMore && isExpanded && realisations.length > (isDesktop ? getCountForRows(realisations, INITIAL_DESKTOP_ROWS) : INITIAL_MOBILE_ITEMS) && (
            <button
              onClick={handleShowLess}
              className="border border-navy/25 text-navy px-7 py-3.5 text-[12px] font-bold uppercase tracking-label hover:border-electric hover:text-electric transition-all cursor-pointer"
            >
              {t('real_show_less')} ↑
            </button>
          )}

          <p className="text-xs text-navy/45 italic">
            <EditField k="real_disclaimer" as="span" />
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setAddOpen(true)}
            className="mt-6 inline-flex items-center gap-2 border border-dashed border-navy/30 text-navy/70 hover:border-electric hover:text-electric px-5 py-3 text-[12px] font-bold uppercase tracking-label transition-all"
          >
            <Plus size={16} /> {lang === 'fr' ? 'Ajouter une réalisation' : lang === 'nl' ? 'Realisatie toevoegen' : 'Add a project'}
          </button>
        )}

        <RealisationModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={(item) => {
            addRealisation(item);
            setDesktopRows((r) => r + 1);
            setMobileItems((m) => m + 1);
          }}
        />

        {/* Lightbox full-screen viewer */}
        {lightboxIdx !== null && (
          <Lightbox
            items={realisations}
            initialIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </div>
    </section>
  );
}