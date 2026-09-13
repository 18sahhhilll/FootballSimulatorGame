import React, { useState, useEffect } from 'react';
import { PlayerEditionPerformance, Position } from '../../types/football';
import { PlayerCard } from '../football/PlayerCard';
import { calculatePositionFit } from '../../engine/ratingEngine';
import { Dices, Sparkles, Check, RefreshCw } from 'lucide-react';

interface SpinRevealModalProps {
  isOpen: boolean;
  targetPosition: Position;
  candidates: PlayerEditionPerformance[];
  onPickPlayer: (performance: PlayerEditionPerformance) => void;
  onRespin?: () => void;
}

export const SpinRevealModal: React.FC<SpinRevealModalProps> = ({
  isOpen,
  targetPosition,
  candidates,
  onPickPlayer,
  onRespin,
}) => {
  const [spinning, setSpinning] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [displayCandidateIndex, setDisplayCandidateIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    setSpinning(true);
    setSelectedIdx(null);
    setDisplayCandidateIndex(0);

    // Fast cycling reel animation for 1.8 seconds
    let interval: any;
    let counter = 0;
    const totalTicks = 20;

    interval = setInterval(() => {
      counter++;
      setDisplayCandidateIndex(prev => (prev + 1) % Math.max(1, candidates.length));

      if (counter >= totalTicks) {
        clearInterval(interval);
        setSpinning(false);
        setSelectedIdx(0); // Default select first
      }
    }, 90);

    return () => clearInterval(interval);
  }, [isOpen, candidates]);

  if (!isOpen || candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden text-center">
        {/* Top Header */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest border border-amber-500/30">
            <Sparkles className="w-4 h-4" /> EDITION PLAYER SPIN
          </span>
          <h2 className="text-2xl font-black font-display text-white mt-2">
            Targeting Position: <span className="text-amber-400">{targetPosition}</span>
          </h2>
        </div>

        {/* Reel Spin / Reveal Section */}
        {spinning ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-amber-400 border-t-transparent animate-spin flex items-center justify-center">
                <Dices className="w-10 h-10 text-amber-400 animate-bounce" />
              </div>
            </div>
            <p className="text-lg font-bold font-display text-amber-300 animate-pulse">
              SPINNING WORLD CUP PLAYER POOL...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-slate-300">
              Select a player to assign to your starting XI:
            </p>

            {/* Candidate Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
              {candidates.map((candidate, idx) => {
                const fit = calculatePositionFit(targetPosition, candidate);
                const isSelected = selectedIdx === idx;

                return (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedIdx(idx)}
                    className="flex flex-col items-center gap-2 cursor-pointer w-full"
                  >
                    <PlayerCard
                      performance={candidate}
                      size="md"
                      positionFit={fit}
                      isSelected={isSelected}
                    />

                    <button
                      onClick={() => onPickPlayer(candidate)}
                      className={`
                        w-full py-2 px-3 rounded-xl font-bold font-display text-xs transition-all duration-200 flex items-center justify-center gap-1.5
                        ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/30 scale-105'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }
                      `}
                    >
                      <Check className="w-4 h-4" /> PICK PLAYER
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Optional Respin */}
            {onRespin && (
              <div className="pt-2">
                <button
                  onClick={onRespin}
                  className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-spin candidates
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
