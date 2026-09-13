import React, { useState, useEffect } from 'react';
import { UserSquad, TournamentState, Match, SimulationMode } from '../types/football';
import { 
  initializeTournament, 
  simulateGroupStageMatch, 
  simulateAllGroupMatches, 
  simulateKnockoutMatch,
  simulateAllKnockoutMatches 
} from '../engine/tournamentSimulator';
import { 
  loadTournamentStateFromStorage, 
  saveTournamentStateToStorage 
} from '../utils/storage';
import { GroupStageView } from '../components/simulation/GroupStageView';
import { TournamentBracket } from '../components/simulation/TournamentBracket';
import { TournamentResults } from '../components/simulation/TournamentResults';
import { LiveMatchModal } from '../components/simulation/LiveMatchModal';
import { MatchSummaryModal } from '../components/simulation/MatchSummaryModal';
import { LiveLeaderboardView } from '../components/simulation/LiveLeaderboardView';
import { COMPETITION_EDITIONS } from '../data/editions';
import { Trophy, FastForward, LayoutGrid, GitBranch, Zap, Tv, Award } from 'lucide-react';

interface TournamentPageProps {
  userSquad: UserSquad;
  onRestart: () => void;
}

export const TournamentPage: React.FC<TournamentPageProps> = ({
  userSquad,
  onRestart,
}) => {
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  const [tournamentState, setTournamentState] = useState<TournamentState | null>(() => {
    const saved = loadTournamentStateFromStorage();
    if (saved && saved.userSquad?.editionId === userSquad.editionId) {
      return saved;
    }
    return initializeTournament(userSquad.editionId, userSquad);
  });

  const [activeTab, setActiveTab] = useState<'GROUPS' | 'KNOCKOUTS' | 'LEADERBOARDS'>('GROUPS');
  const [simMode, setSimMode] = useState<SimulationMode>('DIRECT');
  const [activeLiveMatch, setActiveLiveMatch] = useState<Match | null>(null);
  const [selectedSummaryMatch, setSelectedSummaryMatch] = useState<Match | null>(null);

  // Sync tournamentState to localStorage
  useEffect(() => {
    if (tournamentState) {
      saveTournamentStateToStorage(tournamentState);
    }
  }, [tournamentState]);

  if (!tournamentState) return null;

  const compEdition = COMPETITION_EDITIONS.find(e => e.id === userSquad.editionId) || COMPETITION_EDITIONS[0];
  const isGroupStageDone = tournamentState.groups.every(g => g.matches.every(m => m.completed));

  const handleSimulateGroupMatch = (groupIndex: number, matchIndex: number) => {
    if (!tournamentState) return;

    if (simMode === 'LIVE') {
      const updatedState = simulateGroupStageMatch(tournamentState, groupIndex, matchIndex);
      const simulatedMatch = updatedState.groups[groupIndex].matches[matchIndex];

      setTournamentState(updatedState);
      setActiveLiveMatch(simulatedMatch);
    } else {
      setTournamentState(prev => prev ? simulateGroupStageMatch(prev, groupIndex, matchIndex) : prev);
    }
  };

  const handleSimulateAllGroups = () => {
    setTournamentState(prev => prev ? simulateAllGroupMatches(prev) : prev);
    setActiveTab('KNOCKOUTS');
  };

  const handleSimulateKnockoutMatch = (
    stage: 'quarterFinals' | 'semiFinals' | 'thirdPlace' | 'final',
    matchIndex: number
  ) => {
    if (!tournamentState) return;

    if (simMode === 'LIVE') {
      const updatedState = simulateKnockoutMatch(tournamentState, stage, matchIndex);
      const simulatedMatch = updatedState.knockouts[stage][matchIndex];

      setTournamentState(updatedState);
      setActiveLiveMatch(simulatedMatch);
    } else {
      setTournamentState(prev => prev ? simulateKnockoutMatch(prev, stage, matchIndex) : prev);
    }
  };

  const handleSimulateAllKnockout = (stage: 'quarterFinals' | 'semiFinals') => {
    setTournamentState(prev => prev ? simulateAllKnockoutMatches(prev, stage) : prev);
  };

  if (tournamentState.currentStage === 'COMPLETED') {
    return <TournamentResults state={tournamentState} onRestart={onRestart} />;
  }

  return (
    <div className="min-h-screen fx-turf fx-vignette px-3 sm:px-6 py-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="fx-panel p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-white/10 text-[#C9F31D] rounded-xl border border-[#C9F31D]/30">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">{compEdition.hostFlag}</span>
                <h2 className="fx-display font-extrabold text-base sm:text-xl text-white uppercase">
                  FANTASY WORLD CUP TOURNAMENT
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-white/50 font-mono">
                YOUR XI OVERALL: <span style={{ color: ACCENT }} className="font-bold">{userSquad.overall} OVR</span> | CHEM: <span style={{ color: GOLD }} className="font-bold">{userSquad.chemistry}%</span>
              </p>
            </div>
          </div>

          {/* Mode Toggles & Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="flex bg-[#081310] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setSimMode('DIRECT')}
                className={`
                  fx-btn px-2.5 sm:px-3 py-1.5 text-xs flex items-center gap-1 transition-all
                  ${simMode === 'DIRECT' ? 'text-black shadow-md' : 'text-white/60 hover:text-white'}
                `}
                style={{ background: simMode === 'DIRECT' ? ACCENT : undefined }}
              >
                <Zap className="w-3.5 h-3.5" /> DIRECT
              </button>
              <button
                onClick={() => setSimMode('LIVE')}
                className={`
                  fx-btn px-2.5 sm:px-3 py-1.5 text-xs flex items-center gap-1 transition-all
                  ${simMode === 'LIVE' ? 'text-black shadow-md' : 'text-white/60 hover:text-white'}
                `}
                style={{ background: simMode === 'LIVE' ? ACCENT : undefined }}
              >
                <Tv className="w-3.5 h-3.5" /> LIVE SIM
              </button>
            </div>

            <div className="flex bg-[#081310] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveTab('GROUPS')}
                className={`
                  fx-btn px-2.5 sm:px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition-all
                  ${activeTab === 'GROUPS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}
                `}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> GROUPS
              </button>
              <button
                onClick={() => setActiveTab('KNOCKOUTS')}
                className={`
                  fx-btn px-2.5 sm:px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition-all
                  ${activeTab === 'KNOCKOUTS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}
                `}
              >
                <GitBranch className="w-3.5 h-3.5" /> KNOCKOUTS
              </button>
              <button
                onClick={() => setActiveTab('LEADERBOARDS')}
                className={`
                  fx-btn px-2.5 sm:px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition-all
                  ${activeTab === 'LEADERBOARDS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}
                `}
              >
                <Award className="w-3.5 h-3.5 text-purple-400" /> AWARDS
              </button>
            </div>

            {!isGroupStageDone && (
              <button
                onClick={handleSimulateAllGroups}
                className="fx-btn px-3 sm:px-4 py-2 text-black font-bold text-xs flex items-center gap-1.5 ml-auto md:ml-0"
                style={{ background: GOLD }}
              >
                <FastForward className="w-3.5 h-3.5 fill-current" /> SIM ALL GROUPS
              </button>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'GROUPS' && (
          <GroupStageView
            groups={tournamentState.groups}
            onSimulateMatch={handleSimulateGroupMatch}
            onSelectMatch={m => setSelectedSummaryMatch(m)}
          />
        )}

        {activeTab === 'KNOCKOUTS' && (
          <div className="fx-panel p-4 sm:p-6 shadow-2xl overflow-x-auto">
            <TournamentBracket
              state={tournamentState}
              onSimulateMatch={handleSimulateKnockoutMatch}
              onSimulateAllKnockout={handleSimulateAllKnockout}
              onSelectMatch={m => setSelectedSummaryMatch(m)}
            />
          </div>
        )}

        {activeTab === 'LEADERBOARDS' && (
          <LiveLeaderboardView state={tournamentState} />
        )}

        {/* Live Match Simulation Modal */}
        {activeLiveMatch && (
          <LiveMatchModal
            isOpen={activeLiveMatch !== null}
            match={activeLiveMatch}
            onClose={() => setActiveLiveMatch(null)}
          />
        )}

        {/* Finished Match Summary Modal */}
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
