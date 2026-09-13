import React, { useState, useEffect, useRef } from 'react';
import { Match, DetailedMatchEvent } from '../../types/football';
import { Play, Pause, FastForward, SkipForward, X, Shield, Activity } from 'lucide-react';

interface LiveMatchModalProps {
  isOpen: boolean;
  match: Match | null;
  onClose: () => void;
}

export const LiveMatchModal: React.FC<LiveMatchModalProps> = ({
  isOpen,
  match,
  onClose,
}) => {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 4>(1);
  const [visibleEvents, setVisibleEvents] = useState<DetailedMatchEvent[]>([]);

  const maxMinute = match?.extraTimePlayed ? 120 : 90;
  const currentMatchIdRef = useRef<string | null>(null);
  const ACCENT = '#C9F31D';

  // 1. Reset match state ONLY when match.id changes or modal re-opens with a NEW match
  useEffect(() => {
    if (isOpen && match && currentMatchIdRef.current !== match.id) {
      currentMatchIdRef.current = match.id;
      setCurrentMinute(0);
      setIsPlaying(true);
      setVisibleEvents([]);
      setSpeedMultiplier(1);
    }
  }, [isOpen, match?.id]);

  // 2. Simulation timer effect - DOES NOT RESET MINUTE WHEN SPEED MULTIPLIER CHANGES
  useEffect(() => {
    if (!isOpen || !match || !isPlaying || currentMinute >= maxMinute) return;

    const intervalMs = 250 / speedMultiplier;

    const timer = setInterval(() => {
      setCurrentMinute(prevMin => {
        const nextMin = prevMin + 1;

        // Filter events up to nextMin
        const evs = match.events.filter(e => e.minute <= nextMin);
        setVisibleEvents(evs);

        if (nextMin >= maxMinute) {
          setIsPlaying(false);
          setVisibleEvents(match.events);
          return maxMinute;
        }

        return nextMin;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, match, isPlaying, speedMultiplier, currentMinute >= maxMinute, maxMinute]);

  if (!isOpen || !match) return null;

  const liveHomeGoals = visibleEvents.filter(e => e.type === 'GOAL' && e.teamId === match.homeTeamId).length;
  const liveAwayGoals = visibleEvents.filter(e => e.type === 'GOAL' && e.teamId === match.awayTeamId).length;
  const isMatchFinished = currentMinute >= maxMinute;

  const handleSkipMatch = () => {
    setCurrentMinute(maxMinute);
    setIsPlaying(false);
    setVisibleEvents(match.events);
  };

  const homePossession = match.homeTeamStats?.possession || 50;
  const awayPossession = match.awayTeamStats?.possession || 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081310]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl fx-panel p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs fx-display font-extrabold uppercase tracking-widest" style={{ color: ACCENT }}>
            LIVE MATCH SIMULATOR — {match.stage}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scoreboard HUD */}
        <div className="my-4 p-5 fx-panel border border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-4xl">{match.homeTeamFlag}</span>
            <span className={`fx-display font-extrabold text-sm text-center ${match.isUserHome ? 'text-[#C9F31D]' : 'text-white'}`}>
              {match.homeTeamName}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-6">
            <div className="fx-display font-extrabold text-4xl tracking-wider" style={{ color: ACCENT }}>
              {isMatchFinished ? match.homeScore : liveHomeGoals} - {isMatchFinished ? match.awayScore : liveAwayGoals}
            </div>
            {isMatchFinished && match.homePenalties !== undefined && match.awayPenalties !== undefined && (
              <span className="text-xs font-mono font-bold text-white/70 mt-1">
                ({match.homePenalties} - {match.awayPenalties} pens)
              </span>
            )}
            <span className="mt-2 px-3 py-1 rounded bg-white/10 text-white/80 font-mono text-xs fx-display font-bold">
              {isMatchFinished ? (match.extraTimePlayed ? 'AET / FT' : 'FULL TIME') : `${currentMinute}'`}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-4xl">{match.awayTeamFlag}</span>
            <span className={`fx-display font-extrabold text-sm text-center ${match.isUserAway ? 'text-[#C9F31D]' : 'text-white'}`}>
              {match.awayTeamName}
            </span>
          </div>
        </div>

        {/* Possession Tracker */}
        <div className="mb-3 space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-white/60">
            <span>{match.homeTeamName}: {homePossession}%</span>
            <span>POSSESSION</span>
            <span>{match.awayTeamName}: {awayPossession}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 flex overflow-hidden">
            <div style={{ width: `${homePossession}%`, background: ACCENT }} />
            <div style={{ width: `${awayPossession}%` }} className="bg-white/30" />
          </div>
        </div>

        {/* Chronological Event Feed */}
        <div className="flex-1 max-h-56 overflow-y-auto space-y-2 p-2 bg-[#081310] border border-white/10 fx-scroll text-xs">
          {visibleEvents.length === 0 ? (
            <p className="text-white/40 text-center py-6 font-mono text-xs">
              Kickoff! Match in progress…
            </p>
          ) : (
            visibleEvents.map((ev, idx) => (
              <div
                key={idx}
                className="fx-tick flex items-start justify-between p-2 rounded bg-white/5 border border-white/10 text-white/90"
              >
                <div className="flex items-start gap-2 font-mono">
                  <span className="font-bold shrink-0" style={{ color: ACCENT }}>{ev.minute}'</span>
                  <span className="text-sm shrink-0">
                    {ev.type === 'GOAL' ? '⚽' : ev.type === 'YELLOW' ? '🟨' : ev.type === 'RED' ? '🟥' : ev.type === 'SAVE' ? '🧤' : '🎯'}
                  </span>
                  <div>
                    <span className="fx-display font-bold text-white">{ev.description}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Playback Controls */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isMatchFinished}
              className="fx-btn p-2.5 text-black disabled:opacity-40"
              style={{ background: ACCENT }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 4 : 1)}
              disabled={isMatchFinished}
              className="fx-btn px-3 py-1.5 text-xs font-mono font-bold text-white border border-white/20 hover:border-white/40"
            >
              {speedMultiplier}×
            </button>
          </div>

          <button
            onClick={handleSkipMatch}
            disabled={isMatchFinished}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-white uppercase tracking-wider transition-all disabled:opacity-40"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip Match</span>
          </button>
        </div>
      </div>
    </div>
  );
};
