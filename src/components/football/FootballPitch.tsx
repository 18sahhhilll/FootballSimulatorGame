import React, { useState } from 'react';
import { DraftSlot, PlayerEditionPerformance, ActiveSelectedPlayer } from '../../types/football';
import { isPlayerPositionCompatible } from '../../engine/draftEngine';
import { formatPlayerName } from '../../utils/formatters';

interface FootballPitchProps {
  slots: DraftSlot[];
  activeSlotId: string | null;
  selectedPlacement: ActiveSelectedPlayer | null;
  onSelectSlot: (slotId: string) => void;
  onSelectPlacedPlayer?: (player: PlayerEditionPerformance, slotId: string) => void;
  onCancelSelection?: () => void;
}

export const FootballPitch: React.FC<FootballPitchProps> = ({
  slots,
  activeSlotId,
  selectedPlacement,
  onSelectSlot,
  onSelectPlacedPlayer,
  onCancelSelection,
}) => {
  const ACCENT = '#C9F31D';
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);

  const selectedPlayer = selectedPlacement?.player || null;
  const selectedFromSlotId = selectedPlacement?.fromSlotId || null;

  return (
    <div 
      onClick={() => onCancelSelection?.()}
      className="relative w-full fx-turf rounded-sm overflow-hidden border border-[#C9F31D]/20 shadow-2xl cursor-pointer" 
      style={{ aspectRatio: '0.72' }}
    >
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
        const isOccupied = perf !== undefined;
        const isSlotSelectedPlayer = Boolean(perf && selectedPlayer && selectedFromSlotId === slot.slotConfig.id);
        const isActive = activeSlotId === slot.slotConfig.id;
        const isHovered = hoveredSlotId === slot.slotConfig.id;

        // Position compatibility check when a player is active for placement
        const isCompatiblePosition = selectedPlayer
          ? isPlayerPositionCompatible(selectedPlayer.position, selectedPlayer.secondaryPositions || [], slot.slotConfig.position)
          : false;

        // Target position condition: Slot MUST be EMPTY (!isOccupied) AND position-compatible!
        const isTargetPosition = Boolean(selectedPlayer && isCompatiblePosition && !isOccupied && !isSlotSelectedPlayer);
        // Disabled position: When a player is selected, any slot that is NOT an empty target position and NOT the selected player is disabled
        const isDisabledPosition = Boolean(selectedPlayer && !isTargetPosition && !isSlotSelectedPlayer);

        const displayName = perf ? formatPlayerName(perf.name, perf.playerId) : slot.slotConfig.label;

        let slotClass = '';
        let badgeLabel = displayName;
        let badgeClass = 'bg-black/70 text-white/90 border-white/10';

        if (isSlotSelectedPlayer) {
          slotClass = 'ring-4 ring-cyan-400 bg-cyan-950/90 border-cyan-400 shadow-2xl shadow-cyan-500/80 scale-115 z-30 animate-pulse';
          badgeLabel = 'SELECTED';
          badgeClass = 'bg-cyan-400 text-black font-black border-cyan-400 shadow-md';
        } else if (isTargetPosition) {
          slotClass = 'ring-4 ring-[#C9F31D] bg-[#C9F31D]/40 border-[#C9F31D] animate-pulse shadow-xl shadow-[#C9F31D]/50 scale-110 cursor-pointer z-20';
          badgeLabel = 'PLACE HERE';
          badgeClass = 'bg-[#C9F31D] text-black font-black border-[#C9F31D] shadow-md animate-bounce';
        } else if (isDisabledPosition) {
          slotClass = isOccupied ? 'opacity-50 border-white/10 cursor-not-allowed pointer-events-none' : 'opacity-25 border-white/5 cursor-not-allowed pointer-events-none';
        } else if (isActive || isHovered) {
          slotClass = 'ring-2 ring-offset-2 ring-offset-[#0B1A14]';
        }

        return (
          <button
            key={slot.slotConfig.id}
            onClick={(e) => {
              e.stopPropagation(); // Prevent turf container deselect from firing!

              if (selectedPlacement) {
                // If user clicks the currently selected player token on pitch, deselect it!
                if (isSlotSelectedPlayer) {
                  onCancelSelection?.();
                  return;
                }
                // If user clicks a valid target position, execute placement/swap!
                if (isTargetPosition) {
                  onSelectSlot(slot.slotConfig.id);
                  return;
                }
                // If user clicks another placed player in an incompatible position, switch selection to that player!
                if (perf) {
                  onSelectPlacedPlayer?.(perf, slot.slotConfig.id);
                  return;
                }
                onCancelSelection?.();
                return;
              }

              // No player currently selected:
              if (perf) {
                // Click placed player -> select for position placement!
                onSelectPlacedPlayer?.(perf, slot.slotConfig.id);
              } else {
                onSelectSlot(slot.slotConfig.id);
              }
            }}
            onMouseEnter={() => setHoveredSlotId(slot.slotConfig.id)}
            onMouseLeave={() => setHoveredSlotId(null)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group select-none transition-all ${
              isSlotSelectedPlayer ? 'scale-115 z-30' : isTargetPosition ? 'scale-110 z-20 cursor-pointer' : 'hover:scale-105'
            }`}
            style={{ left: `${slot.slotConfig.x}%`, top: `${slot.slotConfig.y}%` }}
          >
            <div
              className={`fx-pop w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm fx-display font-extrabold transition-all ${slotClass}`}
              style={{
                background: isSlotSelectedPlayer
                  ? '#082f49'
                  : isTargetPosition
                  ? 'rgba(201,243,29,0.3)'
                  : perf
                  ? '#142A22'
                  : 'rgba(255,255,255,0.06)',
                borderColor: isSlotSelectedPlayer
                  ? '#22d3ee'
                  : isTargetPosition
                  ? ACCENT
                  : perf
                  ? ACCENT
                  : isActive
                  ? ACCENT
                  : 'rgba(255,255,255,0.35)',
                color: isSlotSelectedPlayer
                  ? '#22d3ee'
                  : isTargetPosition
                  ? ACCENT
                  : perf
                  ? ACCENT
                  : 'rgba(255,255,255,0.6)',
              }}
            >
              {perf ? perf.overall : slot.slotConfig.position}
            </div>

            <div className={`text-[10px] fx-display font-bold mt-1 max-w-[90px] truncate text-center uppercase tracking-wide px-1.5 py-0.5 rounded border transition-all ${badgeClass}`}>
              {badgeLabel}
            </div>
          </button>
        );
      })}
    </div>
  );
};
