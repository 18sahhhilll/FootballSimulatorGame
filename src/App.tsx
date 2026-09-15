import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { UserSquad } from './types/football';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { DraftPage } from './pages/DraftPage';
import { TournamentPage } from './pages/TournamentPage';
import { LaligaPage } from './pages/LaligaPage';
import { 
  loadUserSquadFromStorage, 
  saveUserSquadToStorage, 
  clearAllGameStorage 
} from './utils/storage';

function AppContent() {
  const navigate = useNavigate();
  const [userSquad, setUserSquad] = useState<UserSquad | null>(() => loadUserSquadFromStorage());

  useEffect(() => {
    saveUserSquadToStorage(userSquad);
  }, [userSquad]);

  const handleRestartGame = () => {
    clearAllGameStorage();
    setUserSquad(null);
    navigate('/');
  };

  const handleCompleteDraft = (squad: UserSquad) => {
    setUserSquad(squad);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between fx-root bg-[#081310] text-[#F3F6F1]">
      <Navbar onRestartGame={handleRestartGame} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/draft/:editionId"
            element={
              <DraftPage
                onBack={() => navigate('/')}
                onCompleteDraft={handleCompleteDraft}
              />
            }
          />
          <Route
            path="/tournament"
            element={
              <TournamentPage
                userSquad={userSquad}
                onRestart={handleRestartGame}
              />
            }
          />
          <Route
            path="/laliga"
            element={
              <LaligaPage
                userSquad={userSquad}
                onRestart={handleRestartGame}
              />
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-white/10 bg-[#081310]/80 py-4 px-4 text-center text-[10px] sm:text-xs text-white/40 fx-display tracking-widest">
        FOOTBALL EDITION-BASED TEAM BUILDING & SIMULATION GAME
      </footer>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
