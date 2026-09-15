import React from 'react';
import { TournamentState, Match } from '../../types/football';
import { getTeamLogoUrl } from '../../utils/teamLogos';
import { Trophy, Play, FastForward, Info } from 'lucide-react';

interface TournamentBracketProps {
  state: TournamentState;
  onSimulateMatch: (stage: 'quarterFinals' | 'semiFinals' | 'thirdPlace' | 'final', idx: number) => void;
  onSimulateAllKnockout?: (stage: 'quarterFinals' | 'semiFinals') => void;
  onSelectMatch?: (match: Match) => void;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  state,
  onSimulateMatch,
  onSimulateAllKnockout,
  onSelectMatch,
}) => {
  const { knockouts, currentStage } = state;
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  const renderMatchCard = (
    match: Match,
    stageKey: 'quarterFinals' | 'semiFinals' | 'thirdPlace' | 'final',
    idx: number
  ) => {
    const isUserMatch = match.isUserHome || match.isUserAway;
    const homeLogo = getTeamLogoUrl(match.homeTeamId, match.homeTeamName);
    const awayLogo = getTeamLogoUrl(match.awayTeamId, match.awayTeamName);

    const isHomeWinner =
      match.completed &&
      (match.homeScore > match.awayScore ||
        (match.homePenalties !== undefined && match.homePenalties > (match.awayPenalties || 0)));
    const isAwayWinner =
      match.completed &&
      (match.awayScore > match.homeScore ||
        (match.awayPenalties !== undefined && match.awayPenalties > (match.homePenalties || 0)));

    return (
      <div
        key={match.id}
        className={`
          fx-panel p-3 shadow-xl flex flex-col justify-between space-y-2 transition-all
          ${isUserMatch ? 'border-[#C9F31D]/40' : ''}
          ${match.completed ? 'cursor-pointer hover:border-white/40' : ''}
        `}
        onClick={() => {
          if (match.completed && onSelectMatch) onSelectMatch(match);
        }}
      >
        <div className="text-[10px] fx-display font-extrabold uppercase tracking-wider text-white/50 border-b border-white/10 pb-1 flex justify-between items-center">
          <span style={{ color: isUserMatch ? ACCENT : undefined }}>{match.stage}</span>
          {match.completed ? (
            <span className="text-[9px] text-white/40 flex items-center gap-1 font-mono">
              <Info className="w-3 h-3 text-white/40" /> DETAILS
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSimulateMatch(stageKey, idx);
              }}
              className="fx-btn px-2 py-0.5 text-black text-[10px] font-extrabold flex items-center gap-1"
              style={{ background: ACCENT }}
            >
              <Play className="w-2.5 h-2.5 fill-current" /> PLAY
            </button>
          )}
        </div>

        {/* Home Team */}
        <div
          className={`flex items-center justify-between py-1.5 px-2 rounded ${
            isHomeWinner ? 'bg-[#C9F31D]/20 font-bold' : 'text-white/80'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {homeLogo ? (
              <img src={homeLogo} alt="" className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0" />
            ) : (
              <span className="text-base">{match.homeTeamFlag}</span>
            )}
            <span className={`fx-display font-bold text-xs truncate ${match.isUserHome ? 'text-[#C9F31D]' : ''}`}>
              {match.homeTeamName}
            </span>
          </div>
          <div className="flex items-center gap-1 fx-display font-extrabold text-xs">
            {match.completed && <span>{match.homeScore}</span>}
            {match.homePenalties !== undefined && (
              <span className="text-[10px] text-[#C9F31D]">({match.homePenalties})</span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div
          className={`flex items-center justify-between py-1.5 px-2 rounded ${
            isAwayWinner ? 'bg-[#C9F31D]/20 font-bold' : 'text-white/80'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {awayLogo ? (
              <img src={awayLogo} alt="" className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0" />
            ) : (
              <span className="text-base">{match.awayTeamFlag}</span>
            )}
            <span className={`fx-display font-bold text-xs truncate ${match.isUserAway ? 'text-[#C9F31D]' : ''}`}>
              {match.awayTeamName}
            </span>
          </div>
          <div className="flex items-center gap-1 fx-display font-extrabold text-xs">
            {match.completed && <span>{match.awayScore}</span>}
            {match.awayPenalties !== undefined && (
              <span className="text-[10px] text-[#C9F31D]">({match.awayPenalties})</span>
            )}
          </div>
        </div>

        {/* Goal Scorers */}
        {match.completed && match.events.length > 0 && (
          <div className="pt-2 border-t border-white/10 text-[10px] text-white/40 font-mono space-y-0.5">
            {match.events.filter(e => e.type === 'GOAL').slice(0, 3).map((ev, i) => (
              <div key={i} className="truncate">
                ⚽ {ev.minute}' {ev.playerName}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* SIMULATE ALL BUTTON FOR QUARTER FINALS / SEMI FINALS */}
      {onSimulateAllKnockout && (currentStage === 'QUARTER_FINALS' || currentStage === 'SEMI_FINALS') && (
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
          <div>
            <div className="text-xs fx-display font-extrabold uppercase text-white/80">
              Active Stage: {currentStage === 'QUARTER_FINALS' ? 'Quarter Finals' : 'Semi Finals'}
            </div>
            <div className="text-[11px] text-white/50">
              Simulate all matches in this knockout round at once
            </div>
          </div>
          <button
            onClick={() => onSimulateAllKnockout(currentStage === 'QUARTER_FINALS' ? 'quarterFinals' : 'semiFinals')}
            className="fx-btn px-4 py-2 text-black font-bold text-xs flex items-center gap-2"
            style={{ background: GOLD }}
          >
            <FastForward className="w-4 h-4 fill-current" />
            <span>SIMULATE ALL {currentStage === 'QUARTER_FINALS' ? 'QUARTER FINALS' : 'SEMI FINALS'}</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Quarter Finals Column */}
        <div className="space-y-4">
          <h3 className="fx-display font-extrabold text-sm text-[#C9F31D] uppercase tracking-wider border-b border-white/10 pb-2">
            Quarter Finals
          </h3>
          {knockouts.quarterFinals.length === 0 ? (
            <p className="text-xs text-white/30 font-mono italic">Awaiting Group Stage results...</p>
          ) : (
            knockouts.quarterFinals.map((m, idx) => renderMatchCard(m, 'quarterFinals', idx))
          )}
        </div>

        {/* Semi Finals Column */}
        <div className="space-y-4">
          <h3 className="fx-display font-extrabold text-sm text-[#C9F31D] uppercase tracking-wider border-b border-white/10 pb-2">
            Semi Finals
          </h3>
          {knockouts.semiFinals.length === 0 ? (
            <p className="text-xs text-white/30 font-mono italic">Awaiting Quarter Final winners...</p>
          ) : (
            knockouts.semiFinals.map((m, idx) => renderMatchCard(m, 'semiFinals', idx))
          )}
        </div>

        {/* Finals & 3rd Place Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="fx-display font-extrabold text-sm text-[#F2B705] uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4" /> World Cup Final
            </h3>
            {knockouts.final.length === 0 ? (
              <p className="text-xs text-white/30 font-mono italic">Awaiting Semi Final winners...</p>
            ) : (
              knockouts.final.map((m, idx) => renderMatchCard(m, 'final', idx))
            )}
          </div>

          <div className="space-y-4">
            <h3 className="fx-display font-extrabold text-xs text-white/60 uppercase tracking-wider border-b border-white/10 pb-1">
              3rd Place Playoff
            </h3>
            {knockouts.thirdPlace.length === 0 ? (
              <p className="text-xs text-white/30 font-mono italic">Awaiting Semi Final runners-up...</p>
            ) : (
              knockouts.thirdPlace.map((m, idx) => renderMatchCard(m, 'thirdPlace', idx))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
