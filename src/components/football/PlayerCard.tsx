import React from 'react';
import { PlayerEditionPerformance } from '../../types/football';
import { PLAYERS } from '../../data/players';
import { formatPlayerName } from '../../utils/formatters';

interface PlayerCardProps {
  performance: PlayerEditionPerformance;
  size?: 'sm' | 'md' | 'lg';
  positionFit?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  performance,
  size = 'md',
  positionFit,
  isSelected = false,
  onClick,
}) => {
  const player = PLAYERS[performance.playerId] || {
    name: performance.name || performance.playerId,
    nationality: 'Global',
    flag: '⚽',
  };

  const displayName = formatPlayerName(performance.name || player.name, performance.playerId);

  const dims = size === 'lg' ? 'w-60' : size === 'sm' ? 'w-28' : 'w-44';

  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isGold = performance.overall >= 88;

  return (
    <div
      onClick={onClick}
      className={`
        fx-card ${dims} bg-gradient-to-b from-[#132821] to-[#0A1512] border p-3 relative select-none transition-all duration-200
        ${isGold ? 'border-[#F2B705] ring-2 ring-[#F2B705]/40 shadow-amber-500/20' : isSelected ? 'border-[#C9F31D] ring-2 ring-[#C9F31D]/40 scale-105 z-10' : 'border-[#C9F31D]/25'}
        ${onClick ? 'cursor-pointer hover:brightness-110 hover:-translate-y-0.5' : ''}
      `}
    >
      {/* Top Bar: Flag & Overall */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg">{player.flag}</span>
        <div className="flex flex-col items-end">
          <span className="fx-display text-2xl font-extrabold" style={{ color: isGold ? '#F2B705' : '#C9F31D' }}>
            {performance.overall}
          </span>
          {positionFit !== undefined && positionFit < 100 && (
            <span
              className={`px-1 py-0.2 rounded text-[9px] font-bold fx-display ${
                positionFit < 60
                  ? 'bg-red-900/80 text-red-200'
                  : positionFit < 85
                  ? 'bg-amber-900/80 text-amber-200'
                  : 'bg-emerald-900/80 text-emerald-200'
              }`}
            >
              {positionFit}%
            </span>
          )}
        </div>
      </div>

      {/* Center Initials Graphic */}
      <div className="text-center py-2">
        <div className="fx-display text-3xl font-extrabold text-white/90 leading-none tracking-wider">
          {initials}
        </div>
      </div>

      {/* Name */}
      <div className="text-center fx-display font-bold text-sm text-white truncate">
        {displayName}
      </div>

      {/* Position */}
      <div className="text-center text-[11px] fx-display tracking-widest text-white/50 mt-0.5 uppercase">
        {performance.position}
        {performance.secondaryPositions && performance.secondaryPositions.length > 0
          ? ` / ${performance.secondaryPositions.join('/')}`
          : ''}
      </div>

      {/* Attribute Stats Grid (MD & LG sizes) */}
      {size !== 'sm' && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white/50 fx-display font-semibold tracking-wide">PAC</span>
            <span className="fx-display font-bold text-white">{performance.pace}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 fx-display font-semibold tracking-wide">DRI</span>
            <span className="fx-display font-bold text-white">{performance.dribbling}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 fx-display font-semibold tracking-wide">SHO</span>
            <span className="fx-display font-bold text-white">{performance.shooting}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 fx-display font-semibold tracking-wide">DEF</span>
            <span className="fx-display font-bold text-white">{performance.defending}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 fx-display font-semibold tracking-wide">PAS</span>
            <span className="fx-display font-bold text-white">{performance.passing}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 fx-display font-semibold tracking-wide">PHY</span>
            <span className="fx-display font-bold text-white">{performance.physical}</span>
          </div>
        </div>
      )}
    </div>
  );
};
