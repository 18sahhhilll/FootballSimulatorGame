import React from 'react';
import { COMPETITION_EDITIONS } from '../data/editions';
import { ChevronRight } from 'lucide-react';

interface HomePageProps {
  onSelectEdition: (editionId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectEdition }) => {
  const ACCENT = '#C9F31D';

  return (
    <div className="min-h-screen fx-turf fx-vignette flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full px-6 pt-16 pb-10 flex-1 flex flex-col justify-center">
        <div className="text-xs fx-display font-bold tracking-[0.15em]" style={{ color: ACCENT }}>
          FOOTBALL DRAFT SIMULATOR
        </div>
        <h1 className="fx-display font-extrabold leading-[0.95] mt-4" style={{ fontSize: 'clamp(2.6rem, 8vw, 5.2rem)' }}>
          Build your XI.
          <br />
          Spin your way to glory.
        </h1>
        <p className="text-white/60 mt-5 max-w-md text-base leading-relaxed">
          Choose a competition mode, pick your formation, spin historical team roulette, and build a legendary fantasy XI to conquer the tournament.
        </p>
        <div className="mt-8">
          <button
            onClick={() => onSelectEdition('world-cup-mode')}
            className="fx-btn px-8 py-4 text-black flex items-center gap-2 text-lg"
            style={{ background: ACCENT }}
          >
            START BUILDING <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="text-xs fx-display font-bold tracking-[0.15em] text-white/40 mb-3 uppercase">EDITIONS</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COMPETITION_EDITIONS.map(e => (
            <div
              key={e.id}
              onClick={() => e.isAvailable && onSelectEdition(e.id)}
              className={`fx-panel p-4 flex flex-col justify-between ${
                !e.isAvailable ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-110 cursor-pointer'
              }`}
            >
              <div>
                <div className="text-3xl">{e.hostFlag}</div>
                <div className="fx-display font-extrabold text-xl mt-3">{e.name}</div>
                <p className="text-xs text-white/50 mt-1 line-clamp-2">{e.description}</p>
              </div>
              <div className="text-xs mt-4 fx-display font-bold" style={{ color: e.isAvailable ? ACCENT : 'rgba(255,255,255,0.4)' }}>
                {e.isAvailable ? 'AVAILABLE NOW →' : 'COMING SOON'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
