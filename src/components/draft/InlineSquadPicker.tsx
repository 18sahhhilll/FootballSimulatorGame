import React from 'react';
import { PlayerEditionPerformance, DraftSlot } from '../../types/football';
import { evaluatePlayerSlotAvailability } from '../../engine/draftEngine';
import { formatPlayerName } from '../../utils/formatters';
import { Crown, GripVertical } from 'lucide-react';

interface InlineSquadPickerProps {
  squad: PlayerEditionPerformance[];
  slots: DraftSlot[];
  draftedIds: string[];
  onSelectPlayer: (player: PlayerEditionPerformance) => void;
  onDragStartPlayer?: (player: PlayerEditionPerformance) => void;
  onDragEndPlayer?: () => void;
}

export const InlineSquadPicker: React.FC<InlineSquadPickerProps> = ({
  squad,
  slots,
  draftedIds,
  onSelectPlayer,
  onDragStartPlayer,
  onDragEndPlayer,
}) => {
  const hasLegendPlayer = squad.some(p => p.isLegend === true);

  return (
    <div className="flex-1 flex flex-col min-h-0 fx-panel p-4 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <span className="text-xs fx-display font-extrabold tracking-widest text-white/70 uppercase">
          Pick One Player
        </span>
        {hasLegendPlayer && (
          <span className="text-[10px] fx-display font-bold text-[#F2B705] flex items-center gap-1 bg-[#F2B705]/10 px-2 py-0.5 rounded border border-[#F2B705]/25">
            <Crown className="w-3 h-3 fill-[#F2B705]" />
            <span>Gold = Legend</span>
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 fx-scroll">
        {squad.map((player, idx) => {
          const availability = evaluatePlayerSlotAvailability(player, slots, draftedIds);
          const isAvailable = availability === 'AVAILABLE';
          const isGold = Boolean(player.isLegend);
          const displayName = formatPlayerName(player.name, player.playerId);

          // 4 Distinct Visual States
          let cardStyle = '';
          let nameStyle = '';
          let badgeStyle = '';

          if (isGold && isAvailable) {
            cardStyle = 'bg-gradient-to-r from-[#F2B705]/25 via-[#F2B705]/15 to-transparent border-[#F2B705] shadow-[#F2B705]/20 shadow-md cursor-grab active:cursor-grabbing hover:brightness-110';
            nameStyle = 'text-white font-extrabold';
            badgeStyle = 'bg-[#F2B705]/30 text-[#F2B705] border-[#F2B705]';
          } else if (isGold && !isAvailable) {
            cardStyle = 'bg-[#F2B705]/5 border-[#F2B705]/25 opacity-55 cursor-not-allowed';
            nameStyle = 'text-slate-400 font-semibold';
            badgeStyle = 'bg-[#F2B705]/10 text-[#F2B705]/50 border-[#F2B705]/20';
          } else if (!isGold && isAvailable) {
            cardStyle = 'bg-white/5 border-white/15 hover:border-[#C9F31D] hover:bg-white/10 cursor-grab active:cursor-grabbing hover:shadow-md';
            nameStyle = 'text-white font-bold';
            badgeStyle = '';
          } else {
            cardStyle = 'bg-white/5 border-white/10 opacity-40 cursor-not-allowed';
            nameStyle = 'text-slate-400 font-normal';
            badgeStyle = '';
          }

          return (
            <div
              key={player.id || idx}
              draggable={isAvailable}
              onDragStart={(e) => {
                if (!isAvailable) return;
                e.dataTransfer.setData('application/json', JSON.stringify({ player, fromSlotId: null }));
                onDragStartPlayer?.(player);
              }}
              onDragEnd={() => onDragEndPlayer?.()}
              onClick={() => isAvailable && onSelectPlayer(player)}
              className={`flex items-center justify-between p-2.5 rounded border transition-all duration-150 relative select-none ${cardStyle}`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                {isAvailable && (
                  <GripVertical className="w-4 h-4 text-white/40 shrink-0" />
                )}
                <span className={`text-xs font-mono font-bold w-5 ${isGold ? (isAvailable ? 'text-[#F2B705]' : 'text-[#F2B705]/50') : 'text-white/40'}`}>
                  #{idx + 1}
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className={`fx-display text-sm truncate ${nameStyle}`}>
                      {displayName}
                    </span>
                    {isGold && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] fx-display font-black tracking-wider uppercase border flex items-center gap-0.5 ${badgeStyle}`}>
                        <Crown className="w-2.5 h-2.5 fill-current" /> LEGEND
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-white/50">
                    {player.position}
                    {player.secondaryPositions && player.secondaryPositions.length > 0 && ` / ${player.secondaryPositions.join(', ')}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 ml-2">
                <span className="text-xs fx-display font-bold text-white/40 uppercase">
                  {player.position}
                </span>
                <span className={`text-lg fx-display font-black font-mono ${isGold ? (isAvailable ? 'text-[#F2B705]' : 'text-[#F2B705]/60') : 'text-white'}`}>
                  {player.overall}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
