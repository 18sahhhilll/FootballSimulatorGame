import React from 'react';
import { Match } from '../../types/football';
import { getTeamLogoUrl } from '../../utils/teamLogos';

interface CompletedMatchCardProps {
  match: Match;
  stageName?: string;
  className?: string;
}

export const CompletedMatchCard: React.FC<CompletedMatchCardProps> = ({
  match,
  stageName,
  className = '',
}) => {
  const events = match.events || [];
  
  // Extract goals and cards sorted chronologically by minute
  const matchEvents = events
    .filter(e => e.type === 'GOAL' || e.type === 'YELLOW' || e.type === 'RED')
    .sort((a, b) => a.minute - b.minute);

  const hasEvents = matchEvents.length > 0;

  const homeLogo = getTeamLogoUrl(match.homeTeamId, match.homeTeamName);
  const awayLogo = getTeamLogoUrl(match.awayTeamId, match.awayTeamName);

  return (
    <div className={`bg-slate-950/90 border border-white/15 rounded-2xl p-5 shadow-2xl font-sans text-white ${className}`}>
      
      {/* TOP HEADER BAR */}
      <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/10 pb-3 mb-4 font-mono">
        <span className="font-semibold tracking-wide">
          {stageName || match.stage || 'LaLiga'}
        </span>
        <span className="text-white/80 font-extrabold uppercase bg-white/10 px-2.5 py-0.5 rounded text-[11px]">
          Full-time
        </span>
      </div>

      {/* SCOREBOARD ROW */}
      <div className="flex items-center justify-between px-2 py-2">
        {/* Home Team */}
        <div className="flex-1 flex items-center justify-end space-x-2.5 text-right truncate">
          {homeLogo && (
            <img src={homeLogo} alt={match.homeTeamName} className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
          )}
          <span className={`fx-display font-extrabold text-base sm:text-lg uppercase tracking-tight truncate ${match.isUserHome ? 'text-[#C9F31D]' : 'text-white'}`}>
            {match.homeTeamName}
          </span>
        </div>

        {/* Big Score */}
        <div className="px-5 flex items-center space-x-3 text-center shrink-0 select-none">
          <span className="fx-display font-black text-3xl sm:text-4xl text-white">
            {match.homeScore}
          </span>
          <span className="text-white/30 text-2xl font-mono">-</span>
          <span className="fx-display font-black text-3xl sm:text-4xl text-white">
            {match.awayScore}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex items-center justify-start space-x-2.5 text-left truncate">
          {awayLogo && (
            <img src={awayLogo} alt={match.awayTeamName} className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
          )}
          <span className={`fx-display font-extrabold text-base sm:text-lg uppercase tracking-tight truncate ${match.isUserAway ? 'text-[#C9F31D]' : 'text-white'}`}>
            {match.awayTeamName}
          </span>
        </div>
      </div>

      {/* PENALTY SHOOTOUT NOTATION */}
      {match.homePenalties !== undefined && match.awayPenalties !== undefined && (
        <div className="text-center text-xs font-mono text-white/60 mt-1 mb-2 font-bold">
          ({match.homePenalties} - {match.awayPenalties} pens)
        </div>
      )}

      {/* EVENTS BREAKDOWN (2 COLUMNS WITH CENTER ICON - NO TITLE HEADERS) */}
      {hasEvents && (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          {matchEvents.map((e, idx) => {
            const isHome = e.teamId === match.homeTeamId;
            const icon = e.type === 'GOAL' ? '⚽' : e.type === 'RED' ? '🟥' : '🟨';
            const playerName = e.playerName || 'Player';
            const minuteText = `${e.minute}'${e.goalType === 'penalty' ? ' (P)' : ''}`;

            return (
              <div key={e.id || idx} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-mono">
                {/* Left Column (Home Event) */}
                <div className="text-right truncate">
                  {isHome ? (
                    <span className="text-white/90 font-semibold truncate">
                      <strong className="text-white font-bold">{playerName}</strong>{' '}
                      <span className="text-lime-400 font-extrabold">{minuteText}</span>
                    </span>
                  ) : (
                    <span className="opacity-0">—</span>
                  )}
                </div>

                {/* Center Icon */}
                <div className="w-6 text-center select-none text-sm shrink-0">
                  {icon}
                </div>

                {/* Right Column (Away Event) */}
                <div className="text-left truncate">
                  {!isHome ? (
                    <span className="text-white/90 font-semibold truncate">
                      <strong className="text-white font-bold">{playerName}</strong>{' '}
                      <span className="text-lime-400 font-extrabold">{minuteText}</span>
                    </span>
                  ) : (
                    <span className="opacity-0">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
