import React, { useState } from 'react';
import { DraftSlot, PlayerEditionPerformance } from '../../types/football';
import { isPlayerPositionCompatible } from '../../engine/draftEngine';
import { formatPlayerName } from '../../utils/formatters';

interface FootballPitchProps {
  slots: DraftSlot[];
  activeSlotId: string | null;
  draggedPlayer: PlayerEditionPerformance | null;
  onSelectSlot: (slotId: string) => void;
  onDropOnSlot: (targetSlotId: string, player: PlayerEditionPerformance, fromSlotId: string | null) => void;
  onDragStartSlotPlayer?: (player: PlayerEditionPerformance, fromSlotId: string) => void;
  onDragEndSlotPlayer?: () => void;
}

export const FootballPitch: React.FC<FootballPitchProps> = ({
  slots,
  activeSlotId,
  draggedPlayer,
  onSelectSlot,
  onDropOnSlot,
  onDragStartSlotPlayer,
  onDragEndSlotPlayer,
}) => {
  const ACCENT = '#C9F31D';
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setHoveredSlotId(slotId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setHoveredSlotId(null);
  };

  const handleDrop = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault();
    setHoveredSlotId(null);

    const rawData = e.dataTransfer.getData('application/json');
    if (!rawData) return;

    try {
      const { player, fromSlotId } = JSON.parse(rawData) as {
        player: PlayerEditionPerformance;
        fromSlotId: string | null;
      };

      if (player) {
        onDropOnSlot(targetSlotId, player, fromSlotId);
      }
    } catch (err) {
      console.error('Failed to parse drag drop payload', err);
    }
  };

  return (
    <div className="relative w-full fx-turf rounded-sm overflow-hidden border border-[#C9F31D]/20 shadow-2xl" style={{ aspectRatio: '0.72' }}>
      {/* SVG Turf Lines */}
      <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <rect x="1.5" y="1.5" width="97" height="137" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
        <line x1="1.5" y1="70" x2="98.5" y2="70" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
        <circle cx="50" cy="70" r="9.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
        <circle cx="50" cy="70" r="0.6" fill="rgba(255,255,255,0.3)" />
        <rect x="27" y="1.5" width="46" height="18" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
        <rect x="27" y="120.5" width="46" height="18" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
        <path d="M 38 19.5 A 12 12 0 0 0 62 19.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
        <path d="M 38 120.5 A 12 12 0 0 1 62 120.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      </svg>

      {/* 11 Formation Slots */}
      {slots.map(slot => {
        const perf = slot.assignedPerformance;
        const isActive = activeSlotId === slot.slotConfig.id;
        const isHovered = hoveredSlotId === slot.slotConfig.id;

        // Position eligibility check when dragging a player
        const isEligibleTarget = draggedPlayer
          ? isPlayerPositionCompatible(draggedPlayer.position, draggedPlayer.secondaryPositions || [], slot.slotConfig.position)
          : false;

        const displayName = perf ? formatPlayerName(perf.name, perf.playerId) : slot.slotConfig.label;

        return (
          <button
            key={slot.slotConfig.id}
            onClick={() => onSelectSlot(slot.slotConfig.id)}
            draggable={!!perf}
            onDragStart={(e) => {
              if (!perf) return;
              e.dataTransfer.setData('application/json', JSON.stringify({ player: perf, fromSlotId: slot.slotConfig.id }));
              onDragStartSlotPlayer?.(perf, slot.slotConfig.id);
            }}
            onDragEnd={() => onDragEndSlotPlayer?.()}
            onDragOver={(e) => handleDragOver(e, slot.slotConfig.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, slot.slotConfig.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group select-none transition-transform hover:scale-110"
            style={{ left: `${slot.slotConfig.x}%`, top: `${slot.slotConfig.y}%` }}
          >
            <div
              className={`fx-pop w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm fx-display font-extrabold transition-all ${
                draggedPlayer && isEligibleTarget
                  ? 'ring-4 ring-[#C9F31D] bg-[#C9F31D]/30 border-[#C9F31D]'
                  : draggedPlayer && !isEligibleTarget
                  ? 'opacity-40 border-red-500/50'
                  : isActive || isHovered
                  ? 'ring-2 ring-offset-2 ring-offset-[#0B1A14]'
                  : ''
              }`}
              style={{
                background: perf ? '#142A22' : 'rgba(255,255,255,0.06)',
                borderColor: perf ? ACCENT : isActive ? ACCENT : 'rgba(255,255,255,0.35)',
                color: perf ? ACCENT : 'rgba(255,255,255,0.6)',
                boxShadow: isActive ? `0 0 0 3px rgba(201,243,29,0.25)` : 'none',
              }}
            >
              {perf ? perf.overall : slot.slotConfig.position}
            </div>

            <div className="text-[10px] fx-display font-bold text-white/90 mt-1 max-w-[80px] truncate text-center uppercase tracking-wide bg-black/70 px-1.5 py-0.5 rounded border border-white/10">
              {displayName}
            </div>
          </button>
        );
      })}
    </div>
  );
};
