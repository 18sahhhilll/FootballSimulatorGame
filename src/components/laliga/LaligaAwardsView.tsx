import React from 'react';
import { LaligaState } from '../../types/football';
import { calculateLaligaAwards } from '../../engine/laligaSimulator';
import { getTeamLogoUrl } from '../../utils/teamLogos';
import { Award, Flame, Zap, Shield, Crown } from 'lucide-react';

interface LaligaAwardsViewProps {
  state: LaligaState;
}

export const LaligaAwardsView: React.FC<LaligaAwardsViewProps> = ({ state }) => {
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  const awards = calculateLaligaAwards(state.stats);
  const allStatsList = Array.from(state.stats.values());

  const topScorers = [...allStatsList]
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 10);

  const topAssisters = [...allStatsList]
    .filter(p => p.assists > 0)
    .sort((a, b) => b.assists - a.assists || b.goals - a.goals)
    .slice(0, 10);

  const topKeepers = [...allStatsList]
    .filter(p => p.position === 'GK')
    .sort((a, b) => b.cleanSheets - a.cleanSheets || b.saves - a.saves)
    .slice(0, 5);

  return (
    <div className="space-y-6 font-sans">
      {/* HIGHLIGHTED AWARDS HEADER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PICHICHI TROPHY */}
        <div className="fx-panel p-5 border border-amber-500/40 bg-amber-950/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs fx-display font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-current" /> PICHICHI (TOP SCORER)
              </span>
              <span className="text-xl">🏆</span>
            </div>

            {awards.pichichi ? (
              <div className="mt-2">
                <div className="flex items-center gap-2.5 mb-1">
                  {getTeamLogoUrl(awards.pichichi.teamId, awards.pichichi.teamName) && (
                    <img
                      src={getTeamLogoUrl(awards.pichichi.teamId, awards.pichichi.teamName)}
                      alt=""
                      className="w-7 h-7 object-contain shrink-0"
                    />
                  )}
                  <div className="truncate">
                    <h3 className="fx-display font-black text-lg text-white truncate">
                      {awards.pichichi.name}
                    </h3>
                    <p className="text-[11px] font-mono text-white/50">{awards.pichichi.teamName}</p>
                  </div>
                </div>
                <div className="mt-3 text-2xl fx-display font-black text-amber-400">
                  {awards.pichichi.goals} <span className="text-xs text-white/60 font-normal">GOALS</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/40 py-4 font-mono">Matches in progress…</p>
            )}
          </div>
        </div>

        {/* TOP ASSISTS */}
        <div className="fx-panel p-5 border border-cyan-500/40 bg-cyan-950/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <span className="text-xs fx-display font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> TOP ASSISTS
              </span>
              <span className="text-xl">🅰️</span>
            </div>

            {awards.topAssists ? (
              <div className="mt-2">
                <div className="flex items-center gap-2.5 mb-1">
                  {getTeamLogoUrl(awards.topAssists.teamId, awards.topAssists.teamName) && (
                    <img
                      src={getTeamLogoUrl(awards.topAssists.teamId, awards.topAssists.teamName)}
                      alt=""
                      className="w-7 h-7 object-contain shrink-0"
                    />
                  )}
                  <div className="truncate">
                    <h3 className="fx-display font-black text-lg text-white truncate">
                      {awards.topAssists.name}
                    </h3>
                    <p className="text-[11px] font-mono text-white/50">{awards.topAssists.teamName}</p>
                  </div>
                </div>
                <div className="mt-3 text-2xl fx-display font-black text-cyan-400">
                  {awards.topAssists.assists} <span className="text-xs text-white/60 font-normal">ASSISTS</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/40 py-4 font-mono">Matches in progress…</p>
            )}
          </div>
        </div>

        {/* ZAMORA TROPHY */}
        <div className="fx-panel p-5 border border-emerald-500/40 bg-emerald-950/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs fx-display font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> ZAMORA (BEST GK)
              </span>
              <span className="text-xl">🧤</span>
            </div>

            {awards.zamora ? (
              <div className="mt-2">
                <div className="flex items-center gap-2.5 mb-1">
                  {getTeamLogoUrl(awards.zamora.teamId, awards.zamora.teamName) && (
                    <img
                      src={getTeamLogoUrl(awards.zamora.teamId, awards.zamora.teamName)}
                      alt=""
                      className="w-7 h-7 object-contain shrink-0"
                    />
                  )}
                  <div className="truncate">
                    <h3 className="fx-display font-black text-lg text-white truncate">
                      {awards.zamora.name}
                    </h3>
                    <p className="text-[11px] font-mono text-white/50">{awards.zamora.teamName}</p>
                  </div>
                </div>
                <div className="mt-3 text-2xl fx-display font-black text-emerald-400">
                  {awards.zamora.cleanSheets} <span className="text-xs text-white/60 font-normal">CLEAN SHEETS ({awards.zamora.saves} SAVES)</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/40 py-4 font-mono">Matches in progress…</p>
            )}
          </div>
        </div>

        {/* PLAYER OF THE SEASON */}
        <div className="fx-panel p-5 border border-purple-500/40 bg-purple-950/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-xs fx-display font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-purple-400 fill-current" /> PLAYER OF THE SEASON
              </span>
              <span className="text-xl">👑</span>
            </div>

            {awards.playerOfSeason ? (
              <div className="mt-2">
                <div className="flex items-center gap-2.5 mb-1">
                  {getTeamLogoUrl(awards.playerOfSeason.teamId, awards.playerOfSeason.teamName) && (
                    <img
                      src={getTeamLogoUrl(awards.playerOfSeason.teamId, awards.playerOfSeason.teamName)}
                      alt=""
                      className="w-7 h-7 object-contain shrink-0"
                    />
                  )}
                  <div className="truncate">
                    <h3 className="fx-display font-black text-lg text-white truncate">
                      {awards.playerOfSeason.name}
                    </h3>
                    <p className="text-[11px] font-mono text-white/50">{awards.playerOfSeason.teamName}</p>
                  </div>
                </div>
                <div className="mt-3 text-2xl fx-display font-black text-purple-400">
                  {awards.playerOfSeason.ratingAverage.toFixed(2)} <span className="text-xs text-white/60 font-normal">AVG RATING ({awards.playerOfSeason.motmCount} MOTM)</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/40 py-4 font-mono">Matches in progress…</p>
            )}
          </div>
        </div>
      </div>

      {/* RANKINGS TABLES (PICHICHI & ASSISTS SIDE BY SIDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PICHICHI TOP 10 */}
        <div className="fx-panel p-5 shadow-2xl space-y-3">
          <h3 className="fx-display font-extrabold text-base text-white uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 fill-current" /> PICHICHI SCORER RANKINGS
          </h3>
          <div className="space-y-2">
            {topScorers.length === 0 ? (
              <p className="text-xs text-white/40 py-4 font-mono text-center">No goals recorded yet.</p>
            ) : (
              topScorers.map((p, idx) => {
                const logoUrl = getTeamLogoUrl(p.teamId, p.teamName);
                return (
                  <div
                    key={p.performanceId}
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="font-extrabold font-mono text-xs w-5 text-center text-white/50">
                        #{idx + 1}
                      </span>
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt=""
                          className="w-5 h-5 object-contain shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <div className="fx-display font-bold text-xs text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-white/40">{p.teamName}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black font-mono text-amber-400 shrink-0">
                      {p.goals} goals
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* TOP ASSISTS TOP 10 */}
        <div className="fx-panel p-5 shadow-2xl space-y-3">
          <h3 className="fx-display font-extrabold text-base text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> TOP ASSISTS RANKINGS
          </h3>
          <div className="space-y-2">
            {topAssisters.length === 0 ? (
              <p className="text-xs text-white/40 py-4 font-mono text-center">No assists recorded yet.</p>
            ) : (
              topAssisters.map((p, idx) => {
                const logoUrl = getTeamLogoUrl(p.teamId, p.teamName);
                return (
                  <div
                    key={p.performanceId}
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="font-extrabold font-mono text-xs w-5 text-center text-white/50">
                        #{idx + 1}
                      </span>
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt=""
                          className="w-5 h-5 object-contain shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <div className="fx-display font-bold text-xs text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-white/40">{p.teamName}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black font-mono text-cyan-400 shrink-0">
                      {p.assists} assists
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
