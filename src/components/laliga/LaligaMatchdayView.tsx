import React from 'react';
import { LaligaMatchday, LaligaFixture } from '../../types/football';
import { getTeamLogoUrl, getLaligaLogoUrl } from '../../utils/teamLogos';
import { ChevronLeft, ChevronRight, Play, FastForward, CheckCircle2 } from 'lucide-react';

interface LaligaMatchdayViewProps {
  matchdays: LaligaMatchday[];
  activeMatchdayIndex: number;
  onSelectMatchdayIndex: (index: number) => void;
  onSimulateFixture: (matchdayIndex: number, matchIndex: number) => void;
  onSimulateAllMatchday: (matchdayIndex: number) => void;
  onViewFixtureSummary: (fixture: LaligaFixture) => void;
}

export const LaligaMatchdayView: React.FC<LaligaMatchdayViewProps> = ({
  matchdays,
  activeMatchdayIndex,
  onSelectMatchdayIndex,
  onSimulateFixture,
  onSimulateAllMatchday,
  onViewFixtureSummary,
}) => {
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  const activeMatchday = matchdays[activeMatchdayIndex];
  if (!activeMatchday) return null;

  const isCurrentDone = activeMatchday.matches.every(m => m.completed);

  const totalMatchdays = matchdays.length;
  const firstIncompleteIndex = matchdays.findIndex(md => !md.completed);
  const maxPlayableIndex = firstIncompleteIndex === -1 ? totalMatchdays - 1 : firstIncompleteIndex;
  const canPlayCurrent = activeMatchdayIndex === maxPlayableIndex && !isCurrentDone;

  return (
    <div className="space-y-4 font-sans">
      {/* MATCHDAY NAVIGATION BAR */}
      <div className="fx-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectMatchdayIndex(Math.max(0, activeMatchdayIndex - 1))}
            disabled={activeMatchdayIndex === 0}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:text-white disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
            title="Previous Matchday"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              {getLaligaLogoUrl() && (
                <img src={getLaligaLogoUrl()} alt="LaLiga" className="w-4 h-4 object-contain shrink-0" />
              )}
              <span className="text-xs fx-display font-bold tracking-widest text-[#C9F31D] uppercase">
                LALIGA MATCHDAY SCHEDULE
              </span>
              {isCurrentDone && (
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono text-[10px] font-bold border border-green-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> COMPLETED
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl fx-display font-black text-white tracking-tight uppercase">
              MATCHDAY {activeMatchday.matchdayNumber} <span className="text-white/40 text-base font-normal">/ {totalMatchdays}</span>
            </h2>
          </div>

          <button
            onClick={() => onSelectMatchdayIndex(Math.min(totalMatchdays - 1, activeMatchdayIndex + 1))}
            disabled={activeMatchdayIndex === totalMatchdays - 1}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:text-white disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
            title="Next Matchday"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* SIMULATE ALL MATCHDAY BUTTON */}
        {!isCurrentDone && (
          <button
            onClick={() => canPlayCurrent && onSimulateAllMatchday(activeMatchdayIndex)}
            disabled={!canPlayCurrent}
            className={`w-full sm:w-auto px-5 py-2.5 fx-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform ${
              canPlayCurrent ? 'hover:scale-105 cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ background: GOLD }}
            title={!canPlayCurrent ? `Complete Matchday ${maxPlayableIndex + 1} first to simulate this matchday` : undefined}
          >
            <FastForward className="w-4 h-4 fill-current" />
            <span>SIMULATE ALL MATCHDAY {activeMatchday.matchdayNumber}</span>
          </button>
        )}
      </div>

      {/* FIXTURE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeMatchday.matches.map((fixture, idx) => {
          const isUserMatch = fixture.isUserHome || fixture.isUserAway;
          const homeLogo = getTeamLogoUrl(fixture.homeTeamId, fixture.homeTeamName);
          const awayLogo = getTeamLogoUrl(fixture.awayTeamId, fixture.awayTeamName);

          return (
            <div
              key={fixture.id}
              className={`fx-panel p-3.5 flex items-center justify-between gap-3 border transition-all ${
                isUserMatch
                  ? 'bg-white/10 border-[#C9F31D]/60 shadow-lg'
                  : 'bg-[#081310]/80 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Home Team */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {homeLogo && (
                  <img
                    src={homeLogo}
                    alt={fixture.homeTeamName}
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                  />
                )}
                <span
                  className={`fx-display font-extrabold text-xs sm:text-sm truncate ${
                    fixture.isUserHome ? 'text-[#C9F31D]' : 'text-white'
                  }`}
                  title={fixture.homeTeamName}
                >
                  {fixture.homeTeamName}
                </span>
              </div>

              {/* Score / Status / Action */}
              <div className="flex flex-col items-center justify-center px-2 shrink-0">
                {fixture.completed ? (
                  <button
                    onClick={() => onViewFixtureSummary(fixture)}
                    className="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <span className="fx-display font-extrabold text-base sm:text-lg tracking-wider text-white">
                      {fixture.homeScore} - {fixture.awayScore}
                    </span>
                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest mt-0.5">
                      FT • SUMMARY
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-mono font-bold text-white/40 uppercase">VS</span>
                    <button
                      onClick={() => canPlayCurrent && onSimulateFixture(activeMatchdayIndex, idx)}
                      disabled={!canPlayCurrent}
                      className={`px-3 py-1 rounded fx-btn text-black font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 ${
                        canPlayCurrent ? 'hover:brightness-110 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                      }`}
                      style={{ background: ACCENT }}
                      title={!canPlayCurrent ? `Complete Matchday ${maxPlayableIndex + 1} first to play this match` : undefined}
                    >
                      <Play className="w-3 h-3 fill-current" /> PLAY
                    </button>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex items-center justify-end gap-2.5 flex-1 min-w-0 text-right">
                <span
                  className={`fx-display font-extrabold text-xs sm:text-sm truncate ${
                    fixture.isUserAway ? 'text-[#C9F31D]' : 'text-white'
                  }`}
                  title={fixture.awayTeamName}
                >
                  {fixture.awayTeamName}
                </span>
                {awayLogo && (
                  <img
                    src={awayLogo}
                    alt={fixture.awayTeamName}
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
