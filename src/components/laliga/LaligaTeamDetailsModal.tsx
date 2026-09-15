import React, { useState } from 'react';
import { LaligaState, LaligaFixture, DraftSlot, FormationId } from '../../types/football';
import { getLaligaTeamStats, getTeamInfo } from '../../engine/laligaSimulator';
import { buildBestPlayingXI, FORMATION_CONFIGS } from '../../engine/draftEngine';
import { loadAllLaligaTeams } from '../../data/jsonLoader';
import { formatPlayerName } from '../../utils/formatters';
import { getTeamLogoUrl } from '../../utils/teamLogos';
import { X, Shield, Calendar, UserCheck, LayoutGrid, Award } from 'lucide-react';

interface LaligaTeamDetailsModalProps {
  teamId: string | null;
  state: LaligaState;
  onClose: () => void;
}

export const LaligaTeamDetailsModal: React.FC<LaligaTeamDetailsModalProps> = ({
  teamId,
  state,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'PITCH' | 'LIST'>('PITCH');

  if (!teamId) return null;

  const tableEntry = state.table.find(t => t.teamId === teamId);
  if (!tableEntry) return null;

  const isUserTeam = teamId === 'user-xi';
  const teamStats = getLaligaTeamStats(
    teamId,
    state.userSquad,
    state.suspendedPlayerIds,
    state.currentMatchdayIndex + 1
  );

  const teamInfo = isUserTeam
    ? { manager: 'User Manager', formation: state.userSquad.formation }
    : getTeamInfo(teamId, tableEntry.teamName);

  const formation: FormationId = (tableEntry.formation || teamStats.formation || teamInfo.formation) as FormationId;
  const managerName = tableEntry.managerName || teamStats.managerName || teamInfo.manager;

  // Build starting XI slots for pitch layout
  let startingSlots: DraftSlot[] = [];
  let benchPlayers: typeof teamStats.squad = [];

  if (isUserTeam) {
    startingSlots = state.userSquad.slots;
  } else {
    const datasetTeams = loadAllLaligaTeams();
    const opp = datasetTeams.find(t => t.id === teamId || t.teamId === teamId);
    if (opp) {
      const suspendedSet = new Set(
        Object.keys(state.suspendedPlayerIds || {}).filter(
          pId => state.suspendedPlayerIds![pId] >= state.currentMatchdayIndex + 1
        )
      );
      startingSlots = buildBestPlayingXI(opp, formation, suspendedSet);
      
      const startingPlayerIds = new Set(
        startingSlots
          .map(s => s.assignedPerformance?.id)
          .filter((id): id is string => Boolean(id))
      );
      benchPlayers = opp.squad.filter(p => !startingPlayerIds.has(p.id));
    }
  }

  // Collect team matches across all matchdays
  const teamMatches: { fixture: LaligaFixture; matchdayNumber: number }[] = [];
  state.matchdays.forEach(md => {
    md.matches.forEach(m => {
      if (m.homeTeamId === teamId || m.awayTeamId === teamId) {
        teamMatches.push({ fixture: m, matchdayNumber: md.matchdayNumber });
      }
    });
  });

  const ACCENT = '#C9F31D';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-white/15 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-white font-sans">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 via-lime-500/20 to-emerald-500/20 border border-yellow-500/40 flex items-center justify-center font-extrabold text-2xl font-mono text-yellow-400 shadow-inner">
              #{tableEntry.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {getTeamLogoUrl(teamId, tableEntry.teamName) && (
                  <img
                    src={getTeamLogoUrl(teamId, tableEntry.teamName)}
                    alt=""
                    className="w-7 h-7 object-contain shrink-0"
                  />
                )}
                <h2 className="text-xl sm:text-2xl fx-display font-black tracking-wide text-white uppercase">
                  {tableEntry.teamName}
                </h2>
                {tableEntry.isUserTeam && (
                  <span className="text-[10px] bg-lime-400/20 text-lime-400 border border-lime-400/40 px-2 py-0.5 rounded font-mono font-bold">
                    YOUR XI
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs mt-1">
                <span className="text-white/70 font-semibold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-lime-400" />
                  <span>Manager:</span> <strong className="text-white font-mono">{managerName}</strong>
                </span>
                <span className="text-white/30">•</span>
                <span className="text-lime-400 font-mono font-extrabold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/25">
                  FORMATION: {formation}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 fx-scroll">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center shadow-md">
              <div className="text-[10px] fx-display text-white/50 uppercase font-bold">Overall</div>
              <div className="text-xl font-mono font-black text-lime-400 mt-0.5">{teamStats.overall}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center shadow-md">
              <div className="text-[10px] fx-display text-white/50 uppercase font-bold">Attack</div>
              <div className="text-xl font-mono font-black text-red-400 mt-0.5">{teamStats.attack}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center shadow-md">
              <div className="text-[10px] fx-display text-white/50 uppercase font-bold">Midfield</div>
              <div className="text-xl font-mono font-black text-amber-400 mt-0.5">{teamStats.midfield}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center shadow-md">
              <div className="text-[10px] fx-display text-white/50 uppercase font-bold">Defense</div>
              <div className="text-xl font-mono font-black text-sky-400 mt-0.5">{teamStats.defense}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center col-span-2 sm:col-span-1 shadow-md">
              <div className="text-[10px] fx-display text-white/50 uppercase font-bold">Chemistry</div>
              <div className="text-xl font-mono font-black text-yellow-400 mt-0.5">{teamStats.chemistry}%</div>
            </div>
          </div>

          {/* MAIN GRID: FORMATION PITCH + FIXTURES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SQUAD FORMATION PITCH / ROSTER (7 COLS) */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-lime-400" />
                  <h3 className="text-sm fx-display font-extrabold uppercase tracking-wider text-white">
                    Main Playing XI ({formation})
                  </h3>
                </div>

                <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
                  <button
                    onClick={() => setViewMode('PITCH')}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                      viewMode === 'PITCH' ? 'bg-lime-400 text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Pitch View
                  </button>
                  <button
                    onClick={() => setViewMode('LIST')}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                      viewMode === 'LIST' ? 'bg-lime-400 text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    List View
                  </button>
                </div>
              </div>

              {viewMode === 'PITCH' ? (
                /* PITCH VISUALIZATION */
                <div className="relative w-full h-[360px] bg-gradient-to-b from-emerald-900/90 via-emerald-950 to-slate-950 border-2 border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl select-none">
                  {/* PITCH MARKINGS */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-white m-3 rounded-sm" />
                    <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white -translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute top-3 left-1/2 w-44 h-20 border-2 border-white -translate-x-1/2 rounded-b-md" />
                    <div className="absolute bottom-3 left-1/2 w-44 h-20 border-2 border-white -translate-x-1/2 rounded-t-md" />
                  </div>

                  {/* STARTING XI TOKENS ON PITCH */}
                  {startingSlots.map(slot => {
                    const player = slot.assignedPerformance;
                    const isSuspended = player && state.suspendedPlayerIds && (state.suspendedPlayerIds[player.id] || 0) >= state.currentMatchdayIndex + 1;
                    const isGold = player && (player.isLegend || player.overall >= 88);
                    const displayName = player ? formatPlayerName(player.name, player.playerId) : 'Empty';

                    return (
                      <div
                        key={slot.slotConfig.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-200 hover:scale-110 cursor-pointer"
                        style={{ left: `${slot.slotConfig.x}%`, top: `${slot.slotConfig.y}%` }}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex flex-col items-center justify-center shadow-lg border-2 text-center relative ${
                            isSuspended
                              ? 'bg-rose-950 border-rose-500 ring-2 ring-rose-500/50'
                              : isGold
                              ? 'bg-gradient-to-b from-amber-400 to-amber-600 border-amber-200 text-black font-black'
                              : 'bg-slate-800 border-lime-400 text-white font-extrabold'
                          }`}
                        >
                          <span className="text-[9px] font-mono leading-none text-white/70 uppercase">
                            {slot.slotConfig.position}
                          </span>
                          <span className={`text-xs font-mono font-black leading-none mt-0.5 ${isGold && !isSuspended ? 'text-black' : 'text-lime-300'}`}>
                            {player ? player.overall : '—'}
                          </span>
                          {isSuspended && (
                            <span className="absolute -top-1 -right-1 text-[9px]" title="Red Card 1-Match Suspension">
                              🟥
                            </span>
                          )}
                        </div>

                        <div className="mt-1 px-1.5 py-0.5 bg-black/80 rounded border border-white/10 backdrop-blur-sm text-[10px] font-bold text-white max-w-[85px] truncate text-center shadow">
                          {displayName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 fx-scroll">
                  {startingSlots.map((slot, idx) => {
                    const player = slot.assignedPerformance;
                    const isSuspended = player && state.suspendedPlayerIds && (state.suspendedPlayerIds[player.id] || 0) >= state.currentMatchdayIndex + 1;
                    const isGold = player && (player.isLegend || player.overall >= 88);
                    const displayName = player ? formatPlayerName(player.name, player.playerId) : 'Unassigned';

                    return (
                      <div
                        key={slot.slotConfig.id || idx}
                        className={`flex items-center justify-between p-2 rounded border text-xs ${
                          isSuspended
                            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                            : isGold
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : 'bg-white/5 border-white/10 text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="w-8 font-mono text-[11px] font-bold text-lime-400 uppercase">
                            {slot.slotConfig.position}
                          </span>
                          <span className="font-semibold truncate">
                            {displayName}
                          </span>
                          {isSuspended && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-400 font-mono font-bold border border-rose-500/40">
                              🟥 SUSPENDED
                            </span>
                          )}
                        </div>

                        {player && (
                          <span className={`font-mono font-black text-sm ${isGold ? 'text-amber-400' : 'text-white'}`}>
                            {player.overall}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BENCH ROSTER LIST */}
              {benchPlayers.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[11px] fx-display font-extrabold uppercase text-white/50 mb-1.5">
                    Substitutes / Bench ({benchPlayers.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto fx-scroll pr-1">
                    {benchPlayers.map(p => (
                      <span
                        key={p.id}
                        className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/80"
                      >
                        {p.position} {formatPlayerName(p.name, p.playerId)} ({p.overall})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MATCH HISTORY & FIXTURES (5 COLS) */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col space-y-3">
              <h3 className="text-sm fx-display font-extrabold uppercase tracking-wider text-white/80 border-b border-white/10 pb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-lime-400" />
                <span>Season Fixtures ({teamMatches.length})</span>
              </h3>

              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1 fx-scroll">
                {teamMatches.length === 0 ? (
                  <div className="text-xs text-white/40 italic py-4 text-center">
                    No fixtures found.
                  </div>
                ) : (
                  teamMatches.map(({ fixture, matchdayNumber }) => {
                    const isHome = fixture.homeTeamId === teamId;
                    const oppId = isHome ? fixture.awayTeamId : fixture.homeTeamId;
                    const opponentTableEntry = state.table.find(t => t.teamId === oppId);
                    const opponentName = opponentTableEntry?.teamName || (isHome ? fixture.awayTeamName : fixture.homeTeamName);
                    
                    let resultBadge = null;
                    if (fixture.completed) {
                      const teamScore = isHome ? fixture.homeScore : fixture.awayScore;
                      const oppScore = isHome ? fixture.awayScore : fixture.homeScore;

                      if (teamScore > oppScore) {
                        resultBadge = <span className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center">W</span>;
                      } else if (teamScore < oppScore) {
                        resultBadge = <span className="w-5 h-5 rounded bg-rose-500/20 border border-rose-500/50 text-rose-400 text-[10px] font-mono font-bold flex items-center justify-center">L</span>;
                      } else {
                        resultBadge = <span className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center">D</span>;
                      }
                    }

                    return (
                      <div
                        key={fixture.id}
                        className="flex items-center justify-between p-2.5 rounded bg-white/5 border border-white/10 text-xs hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {resultBadge || <span className="w-5 h-5 rounded bg-white/10 text-white/30 text-[9px] font-mono flex items-center justify-center">—</span>}
                          <span className="text-[10px] font-mono text-white/40 w-10">
                            MD {matchdayNumber}
                          </span>
                          <span className="font-bold text-lime-400 text-[11px]">
                            vs
                          </span>
                          {getTeamLogoUrl(oppId, opponentName) && (
                            <img
                              src={getTeamLogoUrl(oppId, opponentName)}
                              alt=""
                              className="w-4 h-4 object-contain shrink-0"
                            />
                          )}
                          <span className="font-semibold truncate">
                            {opponentName}
                          </span>
                        </div>

                        <div className="font-mono font-bold text-white shrink-0 ml-2">
                          {fixture.completed ? (
                            <span>
                              {fixture.homeScore} - {fixture.awayScore}
                            </span>
                          ) : (
                            <span className="text-white/30 text-[10px] uppercase">Upcoming</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3 bg-slate-800/90 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
