import React from 'react';
import { TournamentState } from '../../types/football';
import { calculateLiveAwardRankings } from '../../engine/tournamentSimulator';
import { Trophy, Flame, Award, Shield } from 'lucide-react';

interface LiveLeaderboardViewProps {
  state: TournamentState;
}

export const LiveLeaderboardView: React.FC<LiveLeaderboardViewProps> = ({ state }) => {
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  const { goldenBall, goldenBoot, goldenGlove } = calculateLiveAwardRankings(state.stats);

  const topGoldenBall = goldenBall.slice(0, 5);
  const topGoldenBoot = goldenBoot.slice(0, 5);
  const topGoldenGlove = goldenGlove.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="fx-panel p-5 border border-white/10 flex items-center justify-between">
        <div>
          <h3 className="fx-display font-extrabold text-xl text-white uppercase flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: GOLD }} /> LIVE TOURNAMENT LEADERBOARDS & AWARDS
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            Real-time rankings calculated directly from completed tournament match history.
          </p>
        </div>
      </div>

      {/* Leaderboards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Golden Ball */}
        <div className="fx-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="fx-display font-extrabold text-sm uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              ⭐ Golden Ball (Best Player)
            </span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-2">
            {topGoldenBall.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-4">No match data recorded yet.</p>
            ) : (
              topGoldenBall.map((p, idx) => (
                <div
                  key={p.performanceId}
                  className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                    idx === 0
                      ? 'bg-purple-500/10 border-purple-500/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="fx-display font-extrabold text-xs w-4 text-white/40">{idx + 1}.</span>
                    <span className="text-sm">{p.flag}</span>
                    <div className="truncate">
                      <div className="fx-display font-bold text-xs truncate">{p.name}</div>
                      <div className="text-[10px] text-white/40 font-mono truncate">{p.teamName}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="fx-display font-extrabold text-sm text-purple-400">
                      {p.ratingAverage.toFixed(2)}
                    </span>
                    <div className="text-[9px] text-white/40">{p.matchesPlayed} games</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Golden Boot */}
        <div className="fx-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="fx-display font-extrabold text-sm uppercase tracking-wider" style={{ color: GOLD }}>
              🥇 Golden Boot (Top Scorer)
            </span>
            <Flame className="w-4 h-4 text-[#F2B705]" />
          </div>

          <div className="space-y-2">
            {topGoldenBoot.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-4">No goals recorded yet.</p>
            ) : (
              topGoldenBoot.map((p, idx) => (
                <div
                  key={p.performanceId}
                  className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                    idx === 0
                      ? 'bg-[#F2B705]/10 border-[#F2B705]/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="fx-display font-extrabold text-xs w-4 text-white/40">{idx + 1}.</span>
                    <span className="text-sm">{p.flag}</span>
                    <div className="truncate">
                      <div className="fx-display font-bold text-xs truncate">{p.name}</div>
                      <div className="text-[10px] text-white/40 font-mono truncate">{p.teamName}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="fx-display font-extrabold text-base" style={{ color: GOLD }}>
                      {p.goals} <span className="text-[10px] font-normal text-white/40">GOALS</span>
                    </span>
                    <div className="text-[9px] text-white/40">{p.assists} assists</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Golden Glove */}
        <div className="fx-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="fx-display font-extrabold text-sm uppercase tracking-wider" style={{ color: ACCENT }}>
              🧤 Golden Glove (Top Keeper)
            </span>
            <Shield className="w-4 h-4 text-[#C9F31D]" />
          </div>

          <div className="space-y-2">
            {topGoldenGlove.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-4">No goalkeeper data recorded yet.</p>
            ) : (
              topGoldenGlove.map((p, idx) => (
                <div
                  key={p.performanceId}
                  className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                    idx === 0
                      ? 'bg-[#C9F31D]/10 border-[#C9F31D]/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="fx-display font-extrabold text-xs w-4 text-white/40">{idx + 1}.</span>
                    <span className="text-sm">{p.flag}</span>
                    <div className="truncate">
                      <div className="fx-display font-bold text-xs truncate">{p.name}</div>
                      <div className="text-[10px] text-white/40 font-mono truncate">{p.teamName}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="fx-display font-extrabold text-base" style={{ color: ACCENT }}>
                      {p.cleanSheets} <span className="text-[10px] font-normal text-white/40">CLEAN</span>
                    </span>
                    <div className="text-[9px] text-white/40">{p.saves} saves</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
