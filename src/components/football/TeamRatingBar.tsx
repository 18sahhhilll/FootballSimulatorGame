import React from 'react';

interface TeamRatingBarProps {
  overall: number;
  attack: number;
  midfield: number;
  defense: number;
  goalkeeping: number;
  chemistry: number;
}

export const TeamRatingBar: React.FC<TeamRatingBarProps> = ({
  overall,
  attack,
  midfield,
  defense,
  goalkeeping,
  chemistry,
}) => {
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  const StatRow = ({ label, value, color = ACCENT }: { label: string; value: number; color?: string }) => (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs fx-display font-bold tracking-wide text-white/60 uppercase">{label}</div>
      <div className="flex-1 h-2 bg-white/10 rounded-sm overflow-hidden">
        <div className="h-full rounded-sm transition-all duration-300" style={{ width: `${Math.min(100, (value / 100) * 100)}%`, background: color }} />
      </div>
      <div className="w-8 text-right text-sm fx-display font-bold">{value}</div>
    </div>
  );

  return (
    <div className="fx-panel p-4 space-y-2.5">
      <StatRow label="ATTACK" value={attack} />
      <StatRow label="MIDFIELD" value={midfield} />
      <StatRow label="DEFENSE" value={defense} />
      <StatRow label="GK RATING" value={goalkeeping} />
      <StatRow label="CHEMISTRY" value={chemistry} color={GOLD} />

      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <span className="fx-display font-bold text-sm text-white/70 tracking-wider uppercase">OVERALL RATING</span>
        <span className="fx-display font-extrabold text-2xl" style={{ color: ACCENT }}>
          {overall}
        </span>
      </div>
    </div>
  );
};
