import React from 'react';
import { DraftSlot } from '../../types/football';
import { formatPlayerName } from '../../utils/formatters';

interface DraftSummaryPanelProps {
  slots: DraftSlot[];
  attackRating: number;
  defenseRating: number;
  chemistryRating: number;
  onProceed: () => void;
}

export const DraftSummaryPanel: React.FC<DraftSummaryPanelProps> = ({
  slots,
  attackRating,
  defenseRating,
  chemistryRating,
  onProceed,
}) => {
  const filledCount = slots.filter(s => s.assignedPerformance !== undefined).length;
  const isComplete = filledCount === 11;
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  return (
    <div className="fx-panel p-6 flex flex-col justify-between shadow-2xl h-full">
      <div className="space-y-6">
        {/* SCORE COUNTER */}
        <div>
          <div className="flex justify-between items-center text-xs fx-display font-extrabold tracking-widest text-white/70 uppercase mb-2">
            <span>Score</span>
            <span className="font-mono text-sm text-[#C9F31D] font-black">{filledCount}/11</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${(filledCount / 11) * 100}%`, background: ACCENT }}
            />
          </div>
        </div>

        {/* ATTACK / DEFENSE / CHEMISTRY RATING BARS */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div>
            <div className="flex justify-between text-xs fx-display font-bold text-white/70 uppercase mb-1">
              <span>Attack</span>
              <span className="font-mono text-white">{attackRating > 0 ? attackRating : '—'}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${attackRating}%`, background: ACCENT }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs fx-display font-bold text-white/70 uppercase mb-1">
              <span>Defense</span>
              <span className="font-mono text-white">{defenseRating > 0 ? defenseRating : '—'}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full transition-all duration-300"
                style={{ width: `${defenseRating}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs fx-display font-bold text-white/70 uppercase mb-1">
              <span>Chemistry</span>
              <span className="font-mono font-bold" style={{ color: GOLD }}>{chemistryRating > 0 ? `${chemistryRating}%` : '—'}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${chemistryRating}%`, background: GOLD }}
              />
            </div>
          </div>
        </div>

        {/* XI POSITION CHECKLIST */}
        <div className="space-y-1.5 pt-4 border-t border-white/10 max-h-[320px] overflow-y-auto fx-scroll pr-1">
          {slots.map(slot => {
            const player = slot.assignedPerformance;
            const displayName = player ? formatPlayerName(player.name, player.playerId) : '—';

            return (
              <div
                key={slot.slotConfig.id}
                className="flex items-center justify-between py-1.5 px-2 rounded text-xs border-b border-white/5 bg-white/5"
              >
                <span className="font-bold font-mono text-white/40 w-8 uppercase">
                  {slot.slotConfig.position}
                </span>
                <span
                  className={`fx-display font-bold truncate flex-1 text-right ${
                    player ? 'text-white' : 'text-white/30'
                  }`}
                >
                  {displayName}
                </span>
                {player && (
                  <span className="ml-2 font-mono font-bold" style={{ color: ACCENT }}>
                    {player.overall}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={onProceed}
        disabled={!isComplete}
        className={`w-full py-3.5 px-4 fx-btn font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md ${
          isComplete
            ? 'text-slate-950 hover:brightness-110 cursor-pointer shadow-lime-500/20'
            : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
        }`}
        style={{ background: isComplete ? ACCENT : undefined }}
      >
        {isComplete ? 'Simulate World Cup' : 'Fill All 11 Slots'}
      </button>
    </div>
  );
};
