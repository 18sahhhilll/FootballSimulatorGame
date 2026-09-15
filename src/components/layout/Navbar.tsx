import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Trophy, Shuffle, Globe } from 'lucide-react';

interface NavbarProps {
  onRestartGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRestartGame }) => {
  const ACCENT = '#C9F31D';

  return (
    <header className="sticky top-0 z-40 bg-[#081310]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-3 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
        >
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-black font-bold shadow-lg transition-transform group-hover:scale-110"
            style={{ background: ACCENT }}
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="fx-display font-extrabold text-sm sm:text-base tracking-wider text-white uppercase block leading-none">
              FOOTBALL <span style={{ color: ACCENT }}>EDITION</span>
            </span>
            <span className="text-[9px] sm:text-[10px] fx-display tracking-widest text-white/50">
              SPIN & SIMULATE
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `fx-btn px-2.5 sm:px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#C9F31D]/20 text-[#C9F31D] border border-[#C9F31D]/40'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
              }`
            }
          >
            <Globe className="w-3.5 h-3.5" style={{ color: ACCENT }} /> <span className="hidden sm:inline">Editions</span>
          </NavLink>

          <button
            onClick={onRestartGame}
            className="fx-btn px-3 sm:px-4 py-1.5 text-black text-xs font-bold transition-transform hover:scale-105 flex items-center gap-1.5"
            style={{ background: ACCENT }}
          >
            <Shuffle className="w-3.5 h-3.5" /> <span>NEW GAME</span>
          </button>
        </div>
      </div>
    </header>
  );
};
