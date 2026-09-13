import React from 'react';
import { FormationId } from '../../types/football';

interface FormationSelectorProps {
  currentFormation: FormationId;
  onSelectFormation: (formation: FormationId) => void;
  disabled?: boolean;
}

export const FormationSelector: React.FC<FormationSelectorProps> = ({
  currentFormation,
  onSelectFormation,
  disabled = false,
}) => {
  const formations: FormationId[] = ['4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3', '4-1-2-1-2'];
  const ACCENT = '#C9F31D';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs fx-display font-bold tracking-widest text-white/50 uppercase mr-1 flex items-center gap-1">
        FORMATION:
        {disabled && <span className="text-[10px] text-amber-400 font-mono font-normal">(LOCKED)</span>}
      </span>
      {formations.map(f => {
        const isActive = f === currentFormation;
        return (
          <button
            key={f}
            disabled={disabled}
            onClick={() => !disabled && onSelectFormation(f)}
            className={`
              fx-btn px-3 py-1.5 text-xs fx-display font-extrabold transition-all duration-150
              ${
                disabled
                  ? isActive
                    ? 'text-black opacity-80 cursor-not-allowed'
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                  : isActive
                  ? 'text-black shadow-lg scale-105 cursor-pointer'
                  : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20 cursor-pointer'
              }
            `}
            style={{ background: isActive ? ACCENT : undefined }}
            title={disabled ? 'Formation locked after 1st spin' : `Select ${f}`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
};
