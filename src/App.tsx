import React, { useState, useEffect } from 'react';
import { UserSquad } from './types/football';
import { HomePage } from './pages/HomePage';
import { DraftPage } from './pages/DraftPage';
import { TournamentPage } from './pages/TournamentPage';
import { LaligaPage } from './pages/LaligaPage';
import { 
  loadUserSquadFromStorage, 
  saveUserSquadToStorage, 
  loadCurrentPageFromStorage, 
  saveCurrentPageToStorage, 
  clearAllGameStorage 
} from './utils/storage';
import { Trophy, Shuffle, Globe } from 'lucide-react';

type PageState = 'HOME' | 'DRAFT' | 'TOURNAMENT' | 'LALIGA';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageState>(() => {
    const savedPage = loadCurrentPageFromStorage();
    if (savedPage === 'LALIGA' || savedPage === 'TOURNAMENT' || savedPage === 'DRAFT' || savedPage === 'HOME') {
      return savedPage as PageState;
    }
    return 'HOME';
  });

  const [selectedEditionId, setSelectedEditionId] = useState<string>('world-cup-mode');
  const [userSquad, setUserSquad] = useState<UserSquad | null>(() => loadUserSquadFromStorage());

  const ACCENT = '#C9F31D';

  // Sync current page to storage
  useEffect(() => {
    saveCurrentPageToStorage(currentPage);
  }, [currentPage]);

  // Sync user squad to storage
  useEffect(() => {
    saveUserSquadToStorage(userSquad);
  }, [userSquad]);

  const handleSelectEdition = (editionId: string) => {
    setSelectedEditionId(editionId);
    setCurrentPage('DRAFT');
  };

  const handleCompleteDraft = (squad: UserSquad) => {
    setUserSquad(squad);
    if (squad.editionId === 'la-liga-mode') {
      setCurrentPage('LALIGA');
    } else {
      setCurrentPage('TOURNAMENT');
    }
  };

  const handleRestartGame = () => {
    clearAllGameStorage();
    setUserSquad(null);
    setCurrentPage('HOME');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between fx-root bg-[#081310] text-[#F3F6F1]">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#081310]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={handleRestartGame}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-black font-bold shadow-lg transition-transform group-hover:scale-110" style={{ background: ACCENT }}>
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
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentPage('HOME')}
              className="fx-btn px-2.5 sm:px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" style={{ color: ACCENT }} /> <span className="hidden sm:inline">Editions</span>
            </button>
            <button
              onClick={handleRestartGame}
              className="fx-btn px-3 sm:px-4 py-1.5 text-black text-xs font-bold transition-transform hover:scale-105 flex items-center gap-1.5"
              style={{ background: ACCENT }}
            >
              <Shuffle className="w-3.5 h-3.5" /> <span>NEW GAME</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        {currentPage === 'HOME' && (
          <HomePage onSelectEdition={handleSelectEdition} />
        )}
        {currentPage === 'DRAFT' && (
          <DraftPage
            editionId={selectedEditionId}
            onBack={() => setCurrentPage('HOME')}
            onCompleteDraft={handleCompleteDraft}
          />
        )}
        {currentPage === 'TOURNAMENT' && userSquad && (
          <TournamentPage
            userSquad={userSquad}
            onRestart={handleRestartGame}
          />
        )}
        {currentPage === 'LALIGA' && userSquad && (
          <LaligaPage
            userSquad={userSquad}
            onRestart={handleRestartGame}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#081310]/80 py-4 px-4 text-center text-[10px] sm:text-xs text-white/40 fx-display tracking-widest">
        FOOTBALL EDITION-BASED TEAM BUILDING & SIMULATION GAME
      </footer>
    </div>
  );
}
