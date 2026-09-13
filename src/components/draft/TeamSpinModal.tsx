import React, { useState, useEffect } from 'react';
import { HistoricalTeamEdition } from '../../types/football';
import { Dices, Sparkles } from 'lucide-react';

interface TeamSpinModalProps {
  isOpen: boolean;
  winningTeam: HistoricalTeamEdition;
  reelCandidates: HistoricalTeamEdition[];
  onFinishSpin: () => void;
}

export const TeamSpinModal: React.FC<TeamSpinModalProps> = ({
  isOpen,
  winningTeam,
  reelCandidates,
  onFinishSpin,
}) => {
  const [spinning, setSpinning] = useState(true);
  const [displayIndex, setDisplayIndex] = useState(0);
  const ACCENT = '#C9F31D';

  useEffect(() => {
    if (!isOpen) return;

    setSpinning(true);
    setDisplayIndex(0);

    let counter = 0;
    const totalTicks = 22;
    const pool = reelCandidates.length > 0 ? reelCandidates : [winningTeam];

    const interval = setInterval(() => {
      counter++;
      setDisplayIndex(prev => (prev + 1) % pool.length);

      if (counter >= totalTicks) {
        clearInterval(interval);
        setSpinning(false);
        setTimeout(() => {
          onFinishSpin();
        }, 850);
      }
    }, 95);

    return () => clearInterval(interval);
  }, [isOpen, winningTeam, reelCandidates]);

  if (!isOpen) return null;

  const currentDisplayedTeam = spinning
    ? (reelCandidates[displayIndex] || winningTeam)
    : winningTeam;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081310]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl fx-panel p-8 shadow-2xl text-center space-y-6">
        <div className="text-xs fx-display font-bold tracking-widest uppercase flex items-center justify-center gap-1.5" style={{ color: ACCENT }}>
          <Sparkles className="w-4 h-4" /> HISTORICAL TEAM ROULETTE
        </div>

        <div className="fx-panel p-8 flex flex-col items-center justify-center min-h-[200px]">
          <div className="text-6xl mb-3 animate-bounce">
            {currentDisplayedTeam.flag}
          </div>

          <h3 className="fx-display text-4xl font-extrabold uppercase tracking-tight text-white">
            {currentDisplayedTeam.teamName}
          </h3>

          <div className="mt-2 text-sm fx-display font-bold text-white/60">
            WORLD CUP {currentDisplayedTeam.year}
          </div>

          {spinning && (
            <div className="mt-4 fx-spin-active text-xs fx-display font-bold tracking-wider uppercase flex items-center justify-center gap-2" style={{ color: ACCENT }}>
              <Dices className="w-4 h-4 animate-spin" /> SPINNING WORLD CUP POOL…
            </div>
          )}
        </div>

        {!spinning && (
          <div className="p-3 border border-[#C9F31D]/40 bg-[#C9F31D]/10 text-white fx-display font-bold text-xs">
            ✅ ROULETTE REVEALED: OPENING {winningTeam.teamName.toUpperCase()} {winningTeam.year} HISTORICAL SQUAD!
          </div>
        )}
      </div>
    </div>
  );
};
