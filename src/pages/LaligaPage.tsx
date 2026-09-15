import React, { useState, useEffect } from 'react';
import { UserSquad, LaligaState, LaligaFixture, SimulationMode } from '../types/football';
import { 
  initializeLaligaSeason, 
  simulateLaligaFixture, 
  simulateLaligaMatchday, 
  calculateLaligaAwards 
} from '../engine/laligaSimulator';
import { 
  loadLaligaStateFromStorage, 
  saveLaligaStateToStorage 
} from '../utils/storage';
import { getTeamLogoUrl, getLaligaLogoUrl } from '../utils/teamLogos';
import { LaligaMatchdayView } from '../components/laliga/LaligaMatchdayView';
import { LaligaTableSection } from '../components/laliga/LaligaTableSection';
import { LaligaAwardsView } from '../components/laliga/LaligaAwardsView';
import { LaligaTeamDetailsModal } from '../components/laliga/LaligaTeamDetailsModal';
import { LiveMatchModal } from '../components/simulation/LiveMatchModal';
import { MatchSummaryModal } from '../components/simulation/MatchSummaryModal';
import { Trophy, Calendar, FastForward, LayoutGrid, Award, Shield, Zap, Tv, RotateCcw, Crown } from 'lucide-react';

interface LaligaPageProps {
  userSquad: UserSquad;
  onRestart: () => void;
}

export const LaligaPage: React.FC<LaligaPageProps> = ({
  userSquad,
  onRestart,
}) => {
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  const [laligaState, setLaligaState] = useState<LaligaState | null>(() => {
    const saved = loadLaligaStateFromStorage();
    if (saved && saved.userSquad?.editionId === userSquad.editionId) {
      return saved;
    }
    return initializeLaligaSeason('2026-27', userSquad);
  });

  const [activeTab, setActiveTab] = useState<'MATCHDAYS' | 'TABLE' | 'AWARDS' | 'HISTORY'>('MATCHDAYS');
  const [simMode, setSimMode] = useState<SimulationMode>('DIRECT');
  const [activeLiveMatch, setActiveLiveMatch] = useState<LaligaFixture | null>(null);
  const [selectedSummaryMatch, setSelectedSummaryMatch] = useState<LaligaFixture | null>(null);
  const [selectedTeamIdForModal, setSelectedTeamIdForModal] = useState<string | null>(null);

  // Sync state to storage
  useEffect(() => {
    if (laligaState) {
      saveLaligaStateToStorage(laligaState);
    }
  }, [laligaState]);

  if (!laligaState) return null;

  const totalMatchdays = laligaState.matchdays.length;
  const firstIncompleteIndex = laligaState.matchdays.findIndex(md => !md.completed);
  const activeSeasonIndex = firstIncompleteIndex === -1 ? totalMatchdays - 1 : firstIncompleteIndex;
  const currentMatchdayIndex = laligaState.currentMatchdayIndex;

  const handleSimulateFixture = (matchdayIndex: number, matchIndex: number) => {
    if (!laligaState) return;

    if (simMode === 'LIVE') {
      const updatedState = simulateLaligaFixture(laligaState, matchdayIndex, matchIndex);
      const simulatedFixture = updatedState.matchdays[matchdayIndex].matches[matchIndex];
      const nextIncomplete = updatedState.matchdays.findIndex(md => !md.completed);
      const nextIndex = nextIncomplete === -1 ? totalMatchdays - 1 : nextIncomplete;

      setLaligaState({
        ...updatedState,
        currentMatchdayIndex: nextIndex,
      });
      setActiveLiveMatch(simulatedFixture);
    } else {
      setLaligaState(prev => {
        if (!prev) return prev;
        const updated = simulateLaligaFixture(prev, matchdayIndex, matchIndex);
        const nextIncomplete = updated.matchdays.findIndex(md => !md.completed);
        const nextIndex = nextIncomplete === -1 ? totalMatchdays - 1 : nextIncomplete;
        return {
          ...updated,
          currentMatchdayIndex: nextIndex,
        };
      });
    }
  };

  const handleSimulateAllMatchday = (matchdayIndex: number) => {
    setLaligaState(prev => {
      if (!prev) return prev;
      const updated = simulateLaligaMatchday(prev, matchdayIndex);
      const nextIncomplete = updated.matchdays.findIndex(md => !md.completed);
      const nextIndex = nextIncomplete === -1 ? totalMatchdays - 1 : nextIncomplete;
      return {
        ...updated,
        currentMatchdayIndex: nextIndex,
      };
    });
  };

  const handleSimulateEntireSeason = () => {
    if (!laligaState) return;
    let currentState = { ...laligaState };
    const firstIncomplete = currentState.matchdays.findIndex(md => !md.completed);
    const startIdx = firstIncomplete === -1 ? 0 : firstIncomplete;
    for (let m = startIdx; m < totalMatchdays; m++) {
      currentState = simulateLaligaMatchday(currentState, m);
    }
    setLaligaState({
      ...currentState,
      currentMatchdayIndex: totalMatchdays - 1,
    });
    setActiveTab('TABLE');
  };

  const championEntry = laligaState.table[0];
  const awards = calculateLaligaAwards(laligaState.stats);

  return (
    <div className="min-h-screen fx-turf fx-vignette px-3 sm:px-6 py-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="fx-panel p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0">
              {getLaligaLogoUrl() ? (
                <img src={getLaligaLogoUrl()} alt="LaLiga" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              ) : (
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#C9F31D]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="fx-display font-extrabold text-base sm:text-xl text-white uppercase">
                  LALIGA {laligaState.seasonId} SEASON
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-white/50 font-mono flex items-center gap-1.5 flex-wrap mt-0.5">
                {getTeamLogoUrl('user-xi', userSquad.userTeamName || 'Fantasy XI') && (
                  <img
                    src={getTeamLogoUrl('user-xi', userSquad.userTeamName || 'Fantasy XI')}
                    alt="Fantasy XI"
                    className="w-4 h-4 object-contain inline-block shrink-0"
                  />
                )}
                <span>YOUR XI: <span style={{ color: ACCENT }} className="font-bold">{userSquad.overall} OVR</span></span>
                <span>| CHEM: <span style={{ color: GOLD }} className="font-bold">{userSquad.chemistry}%</span></span>
                <span>| MATCHDAY: <span className="font-bold text-white">{activeSeasonIndex + 1} / {totalMatchdays}</span></span>
              </p>
            </div>
          </div>

          {/* SIMULATION MODE TOGGLES & TABS */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="flex bg-[#081310] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setSimMode('DIRECT')}
                className={`fx-btn px-2.5 sm:px-3 py-1.5 text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  simMode === 'DIRECT' ? 'text-black shadow-md' : 'text-white/60 hover:text-white'
                }`}
                style={{ background: simMode === 'DIRECT' ? ACCENT : undefined }}
              >
                <Zap className="w-3.5 h-3.5" /> DIRECT
              </button>
              <button
                onClick={() => setSimMode('LIVE')}
                className={`fx-btn px-2.5 sm:px-3 py-1.5 text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  simMode === 'LIVE' ? 'text-black shadow-md' : 'text-white/60 hover:text-white'
                }`}
                style={{ background: simMode === 'LIVE' ? ACCENT : undefined }}
              >
                <Tv className="w-3.5 h-3.5" /> LIVE SIM
              </button>
            </div>

            <div className="flex bg-[#081310] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveTab('MATCHDAYS')}
                className={`fx-btn px-2.5 sm:px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'MATCHDAYS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> MATCHDAYS
              </button>
              <button
                onClick={() => setActiveTab('TABLE')}
                className={`fx-btn px-2.5 sm:px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'TABLE' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> STANDINGS
              </button>
              <button
                onClick={() => setActiveTab('AWARDS')}
                className={`fx-btn px-2.5 sm:px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'AWARDS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-purple-400" /> AWARDS
              </button>
            </div>

            {!laligaState.isCompleted && (
              <button
                onClick={handleSimulateEntireSeason}
                className="fx-btn px-3 sm:px-4 py-2 text-black font-bold text-xs flex items-center gap-1.5 ml-auto md:ml-0 cursor-pointer"
                style={{ background: GOLD }}
              >
                <FastForward className="w-3.5 h-3.5 fill-current" /> SIM ENTIRE SEASON
              </button>
            )}
          </div>
        </div>

        {/* CHAMPION BANNER (WHEN SEASON COMPLETED) */}
        {laligaState.isCompleted && (
          <div className="fx-panel p-6 border-2 border-amber-400 bg-amber-950/40 text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="inline-flex p-3 rounded-full bg-amber-400 text-black shadow-lg">
              <Crown className="w-8 h-8 fill-current" />
            </div>
            <div>
              <div className="text-xs fx-display font-bold tracking-widest text-amber-400 uppercase">
                SEASON COMPLETED • LALIGA CHAMPION
              </div>
              <h2 className="text-3xl sm:text-4xl fx-display font-black text-white tracking-tight uppercase mt-1">
                {championEntry.teamName}
              </h2>
              <p className="text-sm font-mono text-white/70 mt-1">
                {championEntry.played} Matches • {championEntry.won} Wins • {championEntry.drawn} Draws • {championEntry.lost} Losses • {championEntry.points} Points ({championEntry.gd > 0 ? `+${championEntry.gd}` : championEntry.gd} GD)
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={onRestart}
                className="px-6 py-2.5 fx-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 cursor-pointer"
                style={{ background: ACCENT }}
              >
                <RotateCcw className="w-4 h-4" /> START NEW SEASON
              </button>
            </div>
          </div>
        )}

        {/* TAB CONTENTS */}
        {activeTab === 'MATCHDAYS' && (
          <LaligaMatchdayView
            matchdays={laligaState.matchdays}
            activeMatchdayIndex={currentMatchdayIndex}
            onSelectMatchdayIndex={idx => setLaligaState(prev => prev ? { ...prev, currentMatchdayIndex: idx } : prev)}
            onSimulateFixture={handleSimulateFixture}
            onSimulateAllMatchday={handleSimulateAllMatchday}
            onViewFixtureSummary={f => setSelectedSummaryMatch(f)}
          />
        )}

        {activeTab === 'TABLE' && (
          <LaligaTableSection
            table={laligaState.table}
            onSelectTeam={teamId => setSelectedTeamIdForModal(teamId)}
          />
        )}

        {activeTab === 'AWARDS' && (
          <LaligaAwardsView state={laligaState} />
        )}

        {/* TEAM DETAILS MODAL */}
        {selectedTeamIdForModal && (
          <LaligaTeamDetailsModal
            teamId={selectedTeamIdForModal}
            state={laligaState}
            onClose={() => setSelectedTeamIdForModal(null)}
          />
        )}

        {/* LIVE MATCH MODAL */}
        {activeLiveMatch && (
          <LiveMatchModal
            isOpen={activeLiveMatch !== null}
            match={activeLiveMatch}
            onClose={() => setActiveLiveMatch(null)}
          />
        )}

        {/* MATCH SUMMARY MODAL */}
        {selectedSummaryMatch && (
          <MatchSummaryModal
            isOpen={selectedSummaryMatch !== null}
            match={selectedSummaryMatch}
            onClose={() => setSelectedSummaryMatch(null)}
          />
        )}
      </div>
    </div>
  );
};
