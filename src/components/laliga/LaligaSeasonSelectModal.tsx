import React from 'react';
import { Calendar, ChevronRight, X } from 'lucide-react';
import { getLaligaLogoUrl } from '../../utils/teamLogos';

interface LaligaSeasonSelectModalProps {
  isOpen: boolean;
  availableSeasons: string[];
  selectedSeason: string;
  onSelectSeason: (season: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export const LaligaSeasonSelectModal: React.FC<LaligaSeasonSelectModalProps> = ({
  isOpen,
  availableSeasons,
  selectedSeason,
  onSelectSeason,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const ACCENT = '#C9F31D';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081310]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md fx-panel p-6 shadow-2xl flex flex-col space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            {getLaligaLogoUrl() ? (
              <img src={getLaligaLogoUrl()} alt="LaLiga" className="w-6 h-6 object-contain shrink-0" />
            ) : (
              <Calendar className="w-5 h-5 text-[#C9F31D]" />
            )}
            <h2 className="fx-display font-extrabold text-base sm:text-lg text-white uppercase">
              SELECT LALIGA SEASON
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-white/50 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-white/70 leading-relaxed font-sans">
          Choose a La Liga season from the dataset to load official club squads, players, and start your 38-matchday league campaign.
        </p>

        {/* Season List */}
        <div className="space-y-2">
          <div className="text-[10px] fx-display font-bold tracking-widest text-white/40 uppercase mb-1">
            Available Seasons in Dataset
          </div>
          {availableSeasons.map(season => {
            const isSelected = selectedSeason === season;
            return (
              <div
                key={season}
                onClick={() => onSelectSeason(season)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#C9F31D]/15 border-[#C9F31D] text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getLaligaLogoUrl() && (
                    <img src={getLaligaLogoUrl()} alt="LaLiga" className="w-7 h-7 object-contain shrink-0" />
                  )}
                  <div>
                    <div className="fx-display font-extrabold text-sm sm:text-base tracking-wider">
                      LaLiga {season}
                    </div>
                    <div className="text-[10px] text-white/50 font-mono">
                      20 Teams • 38 Matchdays • 380 Matches
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#C9F31D] bg-[#C9F31D]' : 'border-white/30'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full py-3.5 px-6 fx-btn text-black font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:brightness-110"
          style={{ background: ACCENT }}
        >
          <span>START SEASON DRAFT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
