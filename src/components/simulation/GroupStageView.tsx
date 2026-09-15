import React from 'react';
import { Group, Match } from '../../types/football';
import { getTeamLogoUrl } from '../../utils/teamLogos';
import { Play, Info } from 'lucide-react';

interface GroupStageViewProps {
  groups: Group[];
  onSimulateMatch: (groupIndex: number, matchIndex: number) => void;
  onSelectMatch?: (match: Match) => void;
}

export const GroupStageView: React.FC<GroupStageViewProps> = ({
  groups,
  onSimulateMatch,
  onSelectMatch,
}) => {
  const ACCENT = '#C9F31D';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {groups.map((group, groupIdx) => (
        <div
          key={group.groupName}
          className="fx-panel p-5 space-y-4"
        >
          <h3 className="fx-display font-extrabold text-lg text-white border-b border-white/10 pb-2 flex items-center justify-between">
            <span style={{ color: ACCENT }}>{group.groupName}</span>
          </h3>

          {/* Standings Table */}
          <div className="overflow-x-auto fx-scroll">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-white/40 border-b border-white/10 fx-display uppercase">
                  <th className="py-2 px-1">Team</th>
                  <th className="py-2 px-1 text-center">P</th>
                  <th className="py-2 px-1 text-center">W</th>
                  <th className="py-2 px-1 text-center">D</th>
                  <th className="py-2 px-1 text-center">L</th>
                  <th className="py-2 px-1 text-center">GD</th>
                  <th className="py-2 px-1 text-center font-bold" style={{ color: ACCENT }}>PTS</th>
                </tr>
              </thead>
              <tbody>
                {group.standings.map((s, idx) => {
                  const logoUrl = getTeamLogoUrl(s.teamId, s.teamName);
                  return (
                    <tr
                      key={s.teamId}
                      className={`
                        border-b border-white/5 transition-colors
                        ${s.isUserTeam ? 'bg-[#C9F31D]/15 font-bold text-white' : idx < 2 ? 'text-white/90' : 'text-white/50'}
                      `}
                    >
                      <td className="py-2 px-1 flex items-center gap-1.5 font-medium truncate max-w-[140px]">
                        {logoUrl ? (
                          <img src={logoUrl} alt="" className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0" />
                        ) : (
                          <span className="text-sm">{s.teamFlag}</span>
                        )}
                        <span className="truncate fx-display font-bold">{s.teamName}</span>
                      </td>
                      <td className="py-2 px-1 text-center fx-display font-bold">{s.played}</td>
                      <td className="py-2 px-1 text-center fx-display font-bold">{s.won}</td>
                      <td className="py-2 px-1 text-center fx-display font-bold">{s.drawn}</td>
                      <td className="py-2 px-1 text-center fx-display font-bold">{s.lost}</td>
                      <td className="py-2 px-1 text-center fx-display font-bold">
                        {s.gd > 0 ? `+${s.gd}` : s.gd}
                      </td>
                      <td className="py-2 px-1 text-center fx-display font-extrabold" style={{ color: idx < 2 ? ACCENT : 'inherit' }}>
                        {s.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Group Matches */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[11px] fx-display font-bold text-white/40 uppercase tracking-wider block">
              Group Fixtures:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {group.matches.map((m, mIdx) => {
                const homeLogo = getTeamLogoUrl(m.homeTeamId, m.homeTeamName);
                const awayLogo = getTeamLogoUrl(m.awayTeamId, m.awayTeamName);

                return (
                  <div
                    key={m.id}
                    className={`
                      p-2 rounded text-xs flex items-center justify-between border transition-all
                      ${
                        m.isUserHome || m.isUserAway
                          ? 'bg-[#C9F31D]/10 border-[#C9F31D]/30'
                          : 'bg-white/5 border-white/10'
                      }
                      ${m.completed ? 'cursor-pointer hover:border-white/40' : ''}
                    `}
                    onClick={() => {
                      if (m.completed && onSelectMatch) onSelectMatch(m);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {homeLogo ? (
                        <img src={homeLogo} alt="" className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0" />
                      ) : (
                        <span className="text-sm">{m.homeTeamFlag}</span>
                      )}
                      <span className={`fx-display font-bold truncate ${m.isUserHome ? 'text-[#C9F31D]' : 'text-white/80'}`}>
                        {m.homeTeamName}
                      </span>
                    </div>

                    <div className="px-3 py-1 fx-display font-extrabold text-white bg-[#081310] border border-white/10 rounded min-w-[50px] text-center flex items-center justify-center gap-1 shrink-0">
                      {m.completed ? (
                        <>
                          <span>{m.homeScore} - {m.awayScore}</span>
                          <Info className="w-3 h-3 text-white/40 ml-1" />
                        </>
                      ) : (
                        'VS'
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0 text-right">
                      <span className={`fx-display font-bold truncate ${m.isUserAway ? 'text-[#C9F31D]' : 'text-white/80'}`}>
                        {m.awayTeamName}
                      </span>
                      {awayLogo ? (
                        <img src={awayLogo} alt="" className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0" />
                      ) : (
                        <span className="text-sm">{m.awayTeamFlag}</span>
                      )}
                    </div>

                    {!m.completed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSimulateMatch(groupIdx, mIdx);
                        }}
                        className="fx-btn ml-2 p-1.5 text-black rounded"
                        style={{ background: ACCENT }}
                        title="Simulate Match"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
