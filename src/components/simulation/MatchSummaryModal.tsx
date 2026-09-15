import React, { useState } from 'react';
import { Match } from '../../types/football';
import { X, Award, Shield, Target, Flame, Activity, Clock } from 'lucide-react';

import { CompletedMatchCard } from './CompletedMatchCard';

interface MatchSummaryModalProps {
  isOpen: boolean;
  match: Match | null;
  onClose: () => void;
}

export const MatchSummaryModal: React.FC<MatchSummaryModalProps> = ({
  isOpen,
  match,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'RATINGS' | 'TIMELINE'>('SUMMARY');
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  if (!isOpen || !match) return null;

  const homeStats = match.homeTeamStats || {
    possession: 50,
    shots: 10,
    shotsOnTarget: 4,
    corners: 3,
    fouls: 8,
    yellowCards: 1,
    redCards: 0,
    saves: 3,
  };

  const awayStats = match.awayTeamStats || {
    possession: 50,
    shots: 8,
    shotsOnTarget: 3,
    corners: 2,
    fouls: 9,
    yellowCards: 2,
    redCards: 0,
    saves: 4,
  };

  const goalEvents = match.events.filter(e => e.type === 'GOAL');
  const saveEvents = match.events.filter(e => e.type === 'SAVE');
  const motm = match.manOfTheMatch;

  const homePlayers = match.playerStats ? match.playerStats.filter(p => p.teamId === match.homeTeamId).sort((a, b) => b.rating - a.rating) : [];
  const awayPlayers = match.playerStats ? match.playerStats.filter(p => p.teamId === match.awayTeamId).sort((a, b) => b.rating - a.rating) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081310]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl fx-panel p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs fx-display font-extrabold uppercase tracking-widest" style={{ color: ACCENT }}>
            MATCH SUMMARY — {match.stage} {match.groupName ? `(${match.groupName})` : ''}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scorecard Component */}
        <CompletedMatchCard match={match} stageName={match.stage} className="my-4" />

        {/* MOTM Banner */}
        {motm && (
          <div className="mb-4 p-3 rounded bg-gradient-to-r from-[#F2B705]/20 via-white/5 to-[#F2B705]/20 border border-[#F2B705]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6" style={{ color: GOLD }} />
              <div>
                <span className="text-[10px] fx-display font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  MAN OF THE MATCH
                </span>
                <div className="fx-display font-extrabold text-sm text-white">
                  {motm.playerName} <span className="text-xs font-mono text-white/60">({motm.teamName})</span>
                </div>
              </div>
            </div>
            <div className="fx-display font-extrabold text-lg px-3 py-1 rounded bg-[#F2B705]/20 border border-[#F2B705]/40" style={{ color: GOLD }}>
              {motm.rating.toFixed(1)} <span className="text-[10px] font-normal text-white/60">RATING</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex bg-[#081310] p-1 rounded-lg border border-white/10 mb-4">
          <button
            onClick={() => setActiveTab('SUMMARY')}
            className={`flex-1 py-1.5 text-xs fx-display font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'SUMMARY' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> MATCH STATS
          </button>
          <button
            onClick={() => setActiveTab('RATINGS')}
            className={`flex-1 py-1.5 text-xs fx-display font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'RATINGS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> PLAYER RATINGS
          </button>
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`flex-1 py-1.5 text-xs fx-display font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'TIMELINE' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> COMMENTARY FEED
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 fx-scroll">
          {activeTab === 'SUMMARY' && (
            <div className="space-y-6 text-xs">
              {/* Goals Summary */}
              <div className="fx-panel p-4 space-y-2">
                <span className="fx-display font-bold text-white/50 uppercase tracking-wider block border-b border-white/10 pb-1">
                  ⚽ Goals & Assists
                </span>
                {goalEvents.length === 0 ? (
                  <p className="text-white/40 italic text-center py-2">No goals scored in regulation time.</p>
                ) : (
                  goalEvents.map(g => (
                    <div key={g.id} className="flex items-center justify-between py-1 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold" style={{ color: ACCENT }}>{g.minute}'</span>
                        <span className="fx-display font-bold text-white">{g.playerName}</span>
                        {g.secondaryPlayerName && (
                          <span className="text-white/50 text-[11px]">(assist: {g.secondaryPlayerName})</span>
                        )}
                      </div>
                      <span className="text-white/40 text-[10px] uppercase font-mono">{g.teamName}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Team Stats Comparison */}
              <div className="fx-panel p-4 space-y-3">
                <span className="fx-display font-bold text-white/50 uppercase tracking-wider block border-b border-white/10 pb-2">
                  📊 Match Comparison
                </span>

                {/* Possession Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-[#C9F31D]">{homeStats.possession}%</span>
                    <span className="text-white/60">POSSESSION</span>
                    <span className="text-white">{awayStats.possession}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 flex overflow-hidden">
                    <div style={{ width: `${homeStats.possession}%`, background: ACCENT }} />
                    <div style={{ width: `${awayStats.possession}%` }} className="bg-white/40" />
                  </div>
                </div>

                {/* Stat rows */}
                {[
                  { label: 'Total Shots', h: homeStats.shots, a: awayStats.shots },
                  { label: 'Shots on Target', h: homeStats.shotsOnTarget, a: awayStats.shotsOnTarget },
                  { label: 'Corners', h: homeStats.corners, a: awayStats.corners },
                  { label: 'Fouls Committed', h: homeStats.fouls, a: awayStats.fouls },
                  { label: 'Yellow Cards', h: homeStats.yellowCards, a: awayStats.yellowCards },
                  { label: 'Red Cards', h: homeStats.redCards, a: awayStats.redCards },
                  { label: 'Goalkeeper Saves', h: homeStats.saves, a: awayStats.saves },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 font-mono">
                    <span className="font-bold text-white/90 text-left w-12">{stat.h}</span>
                    <span className="text-white/50 text-center flex-1">{stat.label}</span>
                    <span className="font-bold text-white/90 text-right w-12">{stat.a}</span>
                  </div>
                ))}
              </div>

              {/* Key Saves */}
              {saveEvents.length > 0 && (
                <div className="fx-panel p-4 space-y-2">
                  <span className="fx-display font-bold text-white/50 uppercase tracking-wider block border-b border-white/10 pb-1">
                    🧤 Key Goalkeeper Saves
                  </span>
                  {saveEvents.slice(0, 4).map(s => (
                    <div key={s.id} className="flex items-center justify-between py-1 border-b border-white/5 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: GOLD }}>{s.minute}'</span>
                        <span className="text-white font-bold">{s.playerName}</span>
                      </div>
                      <span className="text-white/40 text-[10px]">{s.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'RATINGS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Home Ratings */}
              <div className="fx-panel p-4 space-y-2">
                <h4 className="fx-display font-extrabold text-sm text-[#C9F31D] border-b border-white/10 pb-2">
                  {match.homeTeamName}
                </h4>
                {homePlayers.map(p => (
                  <div key={p.performanceId} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <div>
                      <div className="fx-display font-bold text-white">{p.playerName}</div>
                      <span className="text-[10px] text-white/40 font-mono">
                        {p.position} | {p.goals > 0 ? `⚽ ${p.goals} ` : ''}{p.assists > 0 ? `🎯 ${p.assists} ` : ''}{p.saves > 0 ? `🧤 ${p.saves} saves` : ''}
                      </span>
                    </div>
                    <span className={`fx-display font-extrabold px-2 py-0.5 rounded text-xs ${
                      p.rating >= 8.0 ? 'bg-[#F2B705]/20 text-[#F2B705]' : 'bg-white/10 text-white'
                    }`}>
                      {p.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Away Ratings */}
              <div className="fx-panel p-4 space-y-2">
                <h4 className="fx-display font-extrabold text-sm text-white border-b border-white/10 pb-2">
                  {match.awayTeamName}
                </h4>
                {awayPlayers.map(p => (
                  <div key={p.performanceId} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <div>
                      <div className="fx-display font-bold text-white">{p.playerName}</div>
                      <span className="text-[10px] text-white/40 font-mono">
                        {p.position} | {p.goals > 0 ? `⚽ ${p.goals} ` : ''}{p.assists > 0 ? `🎯 ${p.assists} ` : ''}{p.saves > 0 ? `🧤 ${p.saves} saves` : ''}
                      </span>
                    </div>
                    <span className={`fx-display font-extrabold px-2 py-0.5 rounded text-xs ${
                      p.rating >= 8.0 ? 'bg-[#F2B705]/20 text-[#F2B705]' : 'bg-white/10 text-white'
                    }`}>
                      {p.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'TIMELINE' && (
            <div className="space-y-2 p-2 bg-[#081310] border border-white/10 fx-scroll text-xs">
              {match.events.map((ev, idx) => (
                <div
                  key={idx}
                  className="fx-tick flex items-start justify-between p-2 rounded bg-white/5 border border-white/10 text-white/90"
                >
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold" style={{ color: ACCENT }}>{ev.minute}'</span>
                    <span className="text-sm">
                      {ev.type === 'GOAL' ? '⚽' : ev.type === 'YELLOW' ? '🟨' : ev.type === 'RED' ? '🟥' : ev.type === 'SAVE' ? '🧤' : '🎯'}
                    </span>
                    <span className="fx-display font-bold">{ev.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
