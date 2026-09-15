import React from 'react';
import { LaligaTableEntry } from '../../types/football';
import { Trophy, Shield, AlertTriangle } from 'lucide-react';

import { getTeamLogoUrl, getLaligaLogoUrl } from '../../utils/teamLogos';

interface LaligaTableSectionProps {
  table: LaligaTableEntry[];
  onSelectTeam?: (teamId: string) => void;
}

export const LaligaTableSection: React.FC<LaligaTableSectionProps> = ({ table, onSelectTeam }) => {
  const ACCENT = '#C9F31D';

  const getZoneStyle = (zone?: LaligaTableEntry['zone']) => {
    switch (zone) {
      case 'CHAMPIONS_LEAGUE':
        return {
          border: 'border-l-4 border-l-cyan-400 bg-cyan-950/20',
          badgeBg: 'bg-cyan-400 text-black',
          badgeText: 'UCL',
        };
      case 'EUROPA_LEAGUE':
        return {
          border: 'border-l-4 border-l-amber-500 bg-amber-950/20',
          badgeBg: 'bg-amber-500 text-black',
          badgeText: 'UEL',
        };
      case 'CONFERENCE_LEAGUE':
        return {
          border: 'border-l-4 border-l-emerald-500 bg-emerald-950/20',
          badgeBg: 'bg-emerald-500 text-black',
          badgeText: 'UECL',
        };
      case 'RELEGATION':
        return {
          border: 'border-l-4 border-l-red-500 bg-red-950/20',
          badgeBg: 'bg-red-500 text-white',
          badgeText: 'REL',
        };
      default:
        return {
          border: 'border-l-4 border-l-transparent',
          badgeBg: 'bg-white/10 text-white/50',
          badgeText: '',
        };
    }
  };

  return (
    <div className="fx-panel p-4 sm:p-6 shadow-2xl space-y-4 font-sans">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          {getLaligaLogoUrl() ? (
            <img src={getLaligaLogoUrl()} alt="LaLiga" className="w-6 h-6 object-contain shrink-0" />
          ) : (
            <Trophy className="w-5 h-5 text-[#C9F31D]" />
          )}
          <h2 className="fx-display font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
            LALIGA STANDINGS TABLE
          </h2>
        </div>
        <div className="text-[11px] font-mono text-white/50">
          Click any team row for team details & squad roster
        </div>
      </div>

      {/* Standings Table Container */}
      <div className="overflow-x-auto fx-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 fx-display font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3 text-center w-12">POS</th>
              <th className="py-2.5 px-3">CLUB</th>
              <th className="py-2.5 px-2 text-center">P</th>
              <th className="py-2.5 px-2 text-center">W</th>
              <th className="py-2.5 px-2 text-center">D</th>
              <th className="py-2.5 px-2 text-center">L</th>
              <th className="py-2.5 px-2 text-center hidden sm:table-cell">GF</th>
              <th className="py-2.5 px-2 text-center hidden sm:table-cell">GA</th>
              <th className="py-2.5 px-2 text-center">GD</th>
              <th className="py-2.5 px-3 text-center font-black text-white">PTS</th>
              <th className="py-2.5 px-3 text-center hidden md:table-cell">FORM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.map(row => {
              const zoneStyle = getZoneStyle(row.zone);
              const logoUrl = getTeamLogoUrl(row.teamId, row.teamName);

              return (
                <tr
                  key={row.teamId}
                  onClick={() => onSelectTeam?.(row.teamId)}
                  className={`transition-colors cursor-pointer ${zoneStyle.border} ${
                    row.isUserTeam
                      ? 'bg-[#C9F31D]/15 font-bold text-white hover:bg-[#C9F31D]/25'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  {/* Position / Rank */}
                  <td className="py-3 px-3 text-center font-extrabold fx-display">
                    <div className="flex items-center justify-center gap-1">
                      <span>{row.rank}</span>
                      {zoneStyle.badgeText && (
                        <span className={`text-[8px] px-1 py-0.2 rounded font-black ${zoneStyle.badgeBg}`}>
                          {zoneStyle.badgeText}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Club Name & Logo */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt={row.teamName}
                          className="w-5 h-5 object-contain shrink-0"
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className={`fx-display font-extrabold text-xs sm:text-sm truncate ${row.isUserTeam ? 'text-[#C9F31D]' : 'text-white'}`}>
                          {row.teamName}
                        </span>
                        {row.managerName && (
                          <span className="text-[10px] font-mono text-white/50 truncate">
                            Mgr: {row.managerName}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Match Stats */}
                  <td className="py-3 px-2 text-center font-mono">{row.played}</td>
                  <td className="py-3 px-2 text-center font-mono text-green-400">{row.won}</td>
                  <td className="py-3 px-2 text-center font-mono text-amber-400">{row.drawn}</td>
                  <td className="py-3 px-2 text-center font-mono text-red-400">{row.lost}</td>
                  <td className="py-3 px-2 text-center font-mono hidden sm:table-cell">{row.gf}</td>
                  <td className="py-3 px-2 text-center font-mono hidden sm:table-cell">{row.ga}</td>
                  <td className="py-3 px-2 text-center font-mono font-bold">
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>

                  {/* Total Points */}
                  <td className="py-3 px-3 text-center font-black text-sm fx-display" style={{ color: row.isUserTeam ? ACCENT : '#FFFFFF' }}>
                    {row.points}
                  </td>

                  {/* Form Pills */}
                  <td className="py-3 px-3 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.map((res, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                            res === 'W'
                              ? 'bg-green-500 text-black'
                              : res === 'D'
                              ? 'bg-amber-500 text-black'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Legend */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-white/60">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> 1–4: UEFA Champions League
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 5: UEFA Europa League
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 6: UEFA Conference League
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> 18–21: Relegated to Segunda División
          </span>
        </div>
      </div>
    </div>
  );
};
