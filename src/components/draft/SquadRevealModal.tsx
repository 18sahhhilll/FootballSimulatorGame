import React from 'react';
import { 
  HistoricalTeamEdition, 
  PlayerEditionPerformance, 
  DraftSlot,
  PlayerSlotAvailabilityState 
} from '../../types/football';
import { PlayerCard } from '../football/PlayerCard';
import { evaluatePlayerSlotAvailability, findBestSlotForPlayer } from '../../engine/draftEngine';
import { calculatePositionFit } from '../../engine/ratingEngine';
import { X, Check, Lock } from 'lucide-react';

interface SquadRevealModalProps {
  isOpen: boolean;
  teamEdition: HistoricalTeamEdition;
  currentSlots: DraftSlot[];
  draftedPerformanceIds: string[];
  onPickPlayer: (perf: PlayerEditionPerformance) => void;
  onClose: () => void;
}

export const SquadRevealModal: React.FC<SquadRevealModalProps> = ({
  isOpen,
  teamEdition,
  currentSlots,
  draftedPerformanceIds,
  onPickPlayer,
  onClose,
}) => {
  if (!isOpen || !teamEdition) return null;

  const ACCENT = '#C9F31D';

  const goalkeepers = teamEdition.squad.filter(p => p.position === 'GK');
  const defenders = teamEdition.squad.filter(p => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position));
  const midfielders = teamEdition.squad.filter(p => ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(p.position));
  const forwards = teamEdition.squad.filter(p => ['LW', 'RW', 'ST'].includes(p.position));

  const renderSection = (title: string, players: PlayerEditionPerformance[]) => {
    if (players.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-xs fx-display font-extrabold uppercase tracking-widest text-white/50 border-b border-white/10 pb-1 flex items-center justify-between">
          <span style={{ color: ACCENT }}>{title}</span>
          <span className="text-[11px] text-white/40 font-mono">({players.length} Players)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {players.map(player => {
            const state: PlayerSlotAvailabilityState = evaluatePlayerSlotAvailability(
              player,
              currentSlots,
              draftedPerformanceIds
            );

            const isAvailable = state === 'AVAILABLE';
            const bestSlot = isAvailable ? findBestSlotForPlayer(player, currentSlots) : null;
            const fit = bestSlot ? calculatePositionFit(bestSlot.slotConfig.position, player) : 100;

            return (
              <div
                key={player.id}
                className={`
                  fx-panel p-3 flex flex-col justify-between gap-3 transition-all duration-150
                  ${isAvailable ? 'hover:brightness-110' : 'opacity-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <PlayerCard
                    performance={player}
                    size="sm"
                    positionFit={isAvailable ? fit : undefined}
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="fx-display font-extrabold text-sm text-white truncate block">
                      {player.playerId.toUpperCase()}
                    </span>
                    <div className="text-[11px] fx-display tracking-widest text-white/50">
                      POS: <span style={{ color: ACCENT }} className="font-bold">{player.position}</span>
                      {player.secondaryPositions && player.secondaryPositions.length > 0 && (
                        <span> ({player.secondaryPositions.join('/')})</span>
                      )}
                    </div>
                    <div className="text-[11px] fx-display tracking-wide text-white/50">
                      OVR: <span style={{ color: ACCENT }} className="font-extrabold">{player.overall}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  {isAvailable ? (
                    <button
                      onClick={() => onPickPlayer(player)}
                      className="fx-btn w-full py-2 px-3 text-black text-xs flex items-center justify-center gap-1.5"
                      style={{ background: ACCENT }}
                    >
                      <Check className="w-4 h-4" /> PICK PLAYER
                    </button>
                  ) : state === 'SLOTS_FULL' ? (
                    <button
                      disabled
                      className="fx-btn w-full py-2 px-3 bg-white/5 text-white/40 text-[10px] flex items-center justify-center gap-1.5 cursor-not-allowed border border-white/10"
                    >
                      <Lock className="w-3.5 h-3.5" /> 🔒 SLOTS FULL
                    </button>
                  ) : state === 'ALREADY_IN_XI' ? (
                    <button
                      disabled
                      className="fx-btn w-full py-2 px-3 bg-white/5 text-white/40 text-[10px] flex items-center justify-center gap-1.5 cursor-not-allowed border border-white/10"
                    >
                      <Lock className="w-3.5 h-3.5" /> ✓ IN YOUR XI
                    </button>
                  ) : (
                    <button
                      disabled
                      className="fx-btn w-full py-2 px-3 bg-white/5 text-white/40 text-[10px] flex items-center justify-center gap-1.5 cursor-not-allowed border border-white/10"
                    >
                      <Lock className="w-3.5 h-3.5" /> 🔒 NO OPEN POSITION
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081310]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] fx-panel p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{teamEdition.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="fx-display text-2xl font-extrabold text-white uppercase">
                  {teamEdition.teamName}
                </h2>
                <span className="px-2.5 py-0.5 rounded text-xs fx-display font-bold border border-[#C9F31D]/30" style={{ color: ACCENT, background: 'rgba(201,243,29,0.1)' }}>
                  WORLD CUP {teamEdition.year}
                </span>
              </div>
              <p className="text-xs text-white/50">
                Choose any available player for an open slot in your XI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Categories */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 fx-scroll">
          {renderSection('Goalkeepers', goalkeepers)}
          {renderSection('Defenders', defenders)}
          {renderSection('Midfielders', midfielders)}
          {renderSection('Forwards', forwards)}
        </div>
      </div>
    </div>
  );
};
