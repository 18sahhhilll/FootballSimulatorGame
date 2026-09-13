import React from 'react';
import { EDITIONS } from '../data/editions';
import { TEAMS } from '../data/teams';
import { Trophy, ArrowLeft, ArrowRight, Flag } from 'lucide-react';

interface EditionSelectionPageProps {
  onSelectEdition: (editionId: string) => void;
  onBack: () => void;
}

export const EditionSelectionPage: React.FC<EditionSelectionPageProps> = ({
  onSelectEdition,
  onBack,
}) => {
  const worldCupEditions = EDITIONS.filter(e => e.type === 'WORLD_CUP' && e.isAvailable);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-8 px-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-bold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h2 className="text-xl font-black font-display text-white uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> SELECT WORLD CUP EDITION
        </h2>
      </div>

      {/* World Cup Edition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {worldCupEditions.map(edition => (
          <div
            key={edition.id}
            onClick={() => onSelectEdition(edition.id)}
            className="group bg-slate-900 border-2 border-slate-800 hover:border-amber-400 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-3xl">{edition.hostFlag}</span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full font-mono text-xs font-extrabold border border-amber-500/30">
                  {edition.year}
                </span>
              </div>

              <h3 className="text-2xl font-black font-display text-white group-hover:text-amber-400 transition-colors">
                {edition.name}
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {edition.description}
              </p>

              {/* Participating Teams Badges */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Participating Squads:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {edition.teams.slice(0, 8).map(teamId => {
                    const team = TEAMS[teamId];
                    return (
                      <span
                        key={teamId}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-semibold text-slate-300 flex items-center gap-1"
                      >
                        <span>{team?.flag || '🏳️'}</span>
                        <span>{team?.shortName || teamId}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-amber-400 font-extrabold text-sm group-hover:translate-x-1 transition-transform">
              <span>SELECT THIS EDITION</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
