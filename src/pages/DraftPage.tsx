import React, { useState, useEffect } from 'react';
import { 
  FormationId, 
  DraftSlot, 
  PlayerEditionPerformance, 
  UserSquad,
  HistoricalTeamEdition,
  ActiveSelectedPlayer
} from '../types/football';
import { COMPETITION_EDITIONS } from '../data/editions';
import { 
  FORMATION_CONFIGS, 
  getRandomHistoricalTeamForSpin, 
  findBestSlotForPlayer,
  isPlayerPositionCompatible 
} from '../engine/draftEngine';
import { calculatePositionFit, calculateSquadRatings } from '../engine/ratingEngine';
import { calculateChemistry } from '../engine/chemistryEngine';
import { loadAllJsonHistoricalTeams } from '../data/jsonLoader';
import { FootballPitch } from '../components/football/FootballPitch';
import { FormationSelector } from '../components/football/FormationSelector';
import { InlineSquadPicker } from '../components/draft/InlineSquadPicker';
import { DraftSummaryPanel } from '../components/draft/DraftSummaryPanel';
import { ArrowLeft, RotateCcw, Shuffle, Sparkles, LayoutGrid, Award, Shield } from 'lucide-react';

interface DraftPageProps {
  editionId: string;
  onBack: () => void;
  onCompleteDraft: (squad: UserSquad) => void;
}

export const DraftPage: React.FC<DraftPageProps> = ({
  editionId,
  onBack,
  onCompleteDraft,
}) => {
  const compEdition = COMPETITION_EDITIONS.find(e => e.id === editionId) || COMPETITION_EDITIONS[0];
  const ACCENT = '#C9F31D';

  const [formation, setFormation] = useState<FormationId>('4-3-3');
  const [slots, setSlots] = useState<DraftSlot[]>([]);
  const [activeSlotId, setActiveSlotId] = useState<string | null>('gk-1');
  const [mobileTab, setMobileTab] = useState<'SPIN' | 'PITCH' | 'SUMMARY'>('SPIN');

  // Manual spin & reroll states
  const [spunTeam, setSpunTeam] = useState<HistoricalTeamEdition | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  const [hasEverSpun, setHasEverSpun] = useState<boolean>(false);
  const [rerollsLeft, setRerollsLeft] = useState<number>(3);

  // Position placement states
  const [selectedPlacement, setSelectedPlacement] = useState<ActiveSelectedPlayer | null>(null);
  const [drawnSquadPool, setDrawnSquadPool] = useState<PlayerEditionPerformance[]>([]);

  // Initialize formation slots when formation changes
  useEffect(() => {
    const config = FORMATION_CONFIGS[formation];
    setSlots(prevSlots => {
      return config.map(cfg => {
        const existing = prevSlots.find(s => s.slotConfig.id === cfg.id);
        return {
          slotConfig: cfg,
          assignedPerformance: existing?.assignedPerformance,
          positionFit: existing?.assignedPerformance
            ? calculatePositionFit(cfg.position, existing.assignedPerformance)
            : 100,
        };
      });
    });
  }, [formation]);

  // MANUAL SPIN TRIGGER
  const handleManualSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasEverSpun(true);
    setSelectedPlacement(null);

    setTimeout(() => {
      const { selectedTeam } = getRandomHistoricalTeamForSpin();
      setSpunTeam(selectedTeam);
      setIsSpinning(false);
      setHasSpun(true);

      setDrawnSquadPool(prevPool => {
        const existingIds = new Set(prevPool.map(p => p.id));
        const newPlayers = selectedTeam.squad.filter(p => !existingIds.has(p.id));
        return [...prevPool, ...newPlayers];
      });
    }, 450);
  };

  // BUTTON 1 — ANOTHER COUNTRY: Same World Cup year, DIFFERENT country from dataset
  const handleRerollCountry = () => {
    if (rerollsLeft <= 0 || isSpinning || !spunTeam) return;
    setIsSpinning(true);
    setSelectedPlacement(null);

    setTimeout(() => {
      const allTeams = loadAllJsonHistoricalTeams();
      const candidates = allTeams.filter(t => t.year === spunTeam.year && t.teamId.toLowerCase() !== spunTeam.teamId.toLowerCase());
      
      const nextTeam = candidates.length > 0 
        ? candidates[Math.floor(Math.random() * candidates.length)] 
        : spunTeam;

      setSpunTeam(nextTeam);
      setIsSpinning(false);
      setRerollsLeft(prev => prev - 1);

      setDrawnSquadPool(prevPool => {
        const existingIds = new Set(prevPool.map(p => p.id));
        const newPlayers = nextTeam.squad.filter(p => !existingIds.has(p.id));
        return [...prevPool, ...newPlayers];
      });
    }, 350);
  };

  // BUTTON 2 — ANOTHER WORLD CUP: Same country/team, DIFFERENT World Cup year from dataset
  const handleRerollWorldCup = () => {
    if (rerollsLeft <= 0 || isSpinning || !spunTeam) return;
    setIsSpinning(true);
    setSelectedPlacement(null);

    setTimeout(() => {
      const allTeams = loadAllJsonHistoricalTeams();
      const candidates = allTeams.filter(t => t.teamId.toLowerCase() === spunTeam.teamId.toLowerCase() && t.year !== spunTeam.year);
      
      const nextTeam = candidates.length > 0 
        ? candidates[Math.floor(Math.random() * candidates.length)] 
        : spunTeam;

      setSpunTeam(nextTeam);
      setIsSpinning(false);
      setRerollsLeft(prev => prev - 1);

      setDrawnSquadPool(prevPool => {
        const existingIds = new Set(prevPool.map(p => p.id));
        const newPlayers = nextTeam.squad.filter(p => !existingIds.has(p.id));
        return [...prevPool, ...newPlayers];
      });
    }, 350);
  };

  // Click-to-select UNPLACED player from drawn squad pool
  const handlePickUnplacedPlayer = (perf: PlayerEditionPerformance) => {
    if (selectedPlacement?.player.id === perf.id) {
      setSelectedPlacement(null); // Tapping 2nd time deselects
    } else {
      setSelectedPlacement({ player: perf, fromSlotId: null });
      setMobileTab('PITCH');
    }
  };

  // Click-to-select ALREADY-PLACED player on pitch
  const handlePickPlacedPlayer = (perf: PlayerEditionPerformance, slotId: string) => {
    if (selectedPlacement?.player.id === perf.id) {
      setSelectedPlacement(null); // Tapping 2nd time deselects
    } else {
      setSelectedPlacement({ player: perf, fromSlotId: slotId });
    }
  };

  // Handle slot click on pitch
  const handleSelectSlot = (targetSlotId: string) => {
    setActiveSlotId(targetSlotId);

    const targetSlot = slots.find(s => s.slotConfig.id === targetSlotId);
    if (!targetSlot) return;

    if (!selectedPlacement) {
      // If no player currently selected: tapping an occupied pitch slot selects that placed player!
      if (targetSlot.assignedPerformance) {
        setSelectedPlacement({ player: targetSlot.assignedPerformance, fromSlotId: targetSlotId });
      }
      return;
    }

    const { player: selectedPlayer, fromSlotId } = selectedPlacement;

    // Tapping the exact same slot where the selected player already is -> deselect
    if (fromSlotId === targetSlotId) {
      setSelectedPlacement(null);
      return;
    }

    // STRICT RULE: Placement is restricted exclusively to EMPTY slots (no swap into occupied slots)
    if (targetSlot.assignedPerformance !== undefined) {
      // Tapping an occupied slot switches selection to that placed player
      setSelectedPlacement({ player: targetSlot.assignedPerformance, fromSlotId: targetSlotId });
      return;
    }

    // Check position compatibility
    const isPlayable = isPlayerPositionCompatible(
      selectedPlayer.position,
      selectedPlayer.secondaryPositions || [],
      targetSlot.slotConfig.position
    );

    if (!isPlayable) {
      setSelectedPlacement(null);
      return;
    }

    // Target position is EMPTY & COMPATIBLE! Execute placement.
    executePlayerPlacement(selectedPlayer, targetSlotId, fromSlotId);
    setSelectedPlacement(null);
  };

  // Core Assign, Swap & Bump Handler
  const executePlayerPlacement = (
    player: PlayerEditionPerformance,
    targetSlotId: string,
    fromSlotId: string | null
  ) => {
    setSlots(prevSlots => {
      const targetSlot = prevSlots.find(s => s.slotConfig.id === targetSlotId);
      if (!targetSlot) return prevSlots;

      const existingInTarget = targetSlot.assignedPerformance;

      return prevSlots.map(s => {
        // 1. Target slot gets assigned the selected player
        if (s.slotConfig.id === targetSlotId) {
          const fit = calculatePositionFit(s.slotConfig.position, player);
          return {
            ...s,
            assignedPerformance: player,
            positionFit: fit,
          };
        }

        // 2. If selected player came from another pitch slot (fromSlotId)
        if (fromSlotId && s.slotConfig.id === fromSlotId) {
          // SWAP CASE: If target slot was occupied by existingInTarget, swap existingInTarget into fromSlotId!
          if (
            existingInTarget &&
            isPlayerPositionCompatible(
              existingInTarget.position,
              existingInTarget.secondaryPositions || [],
              s.slotConfig.position
            )
          ) {
            const fit = calculatePositionFit(s.slotConfig.position, existingInTarget);
            return {
              ...s,
              assignedPerformance: existingInTarget,
              positionFit: fit,
            };
          }
          // VACATE CASE: Otherwise clear fromSlotId
          return {
            ...s,
            assignedPerformance: undefined,
            positionFit: 100,
          };
        }

        // 3. Prevent duplicate players in XI:
        // If selected player came from unplaced squad pool (fromSlotId === null), but was somehow in another slot, clear it
        if (!fromSlotId && s.assignedPerformance?.id === player.id) {
          return {
            ...s,
            assignedPerformance: undefined,
            positionFit: 100,
          };
        }

        return s;
      });
    });

    // Consuming the spin: When a player is selected from the spin list (fromSlotId === null) and placed into a pitch slot:
    // Immediately clear/discard the current spin's player pool and reset left panel to "READY TO DRAFT" (SPIN button)!
    if (!fromSlotId) {
      setHasSpun(false);
      setSpunTeam(null);
    }

    const remainingSlot = slots.find(s => s.slotConfig.id !== targetSlotId && s.assignedPerformance === undefined);
    setActiveSlotId(remainingSlot ? remainingSlot.slotConfig.id : null);
  };

  const handleResetDraft = () => {
    setSlots(prev =>
      prev.map(s => ({
        ...s,
        assignedPerformance: undefined,
        positionFit: 100,
      }))
    );
    setActiveSlotId('gk-1');
    setRerollsLeft(3);
    setHasSpun(false);
    setHasEverSpun(false);
    setSpunTeam(null);
    setDrawnSquadPool([]);
    setSelectedPlacement(null);
  };

  const isFormationLocked = hasEverSpun || slots.some(s => s.assignedPerformance !== undefined);

  const ratings = calculateSquadRatings(slots);
  const chemistry = calculateChemistry(slots);
  const isDraftComplete = slots.filter(s => s.assignedPerformance !== undefined).length === 11;

  const draftedPerformanceIds = slots
    .map(s => s.assignedPerformance?.id)
    .filter((id): id is string => id !== undefined);

  const handleProceedToTournament = () => {
    if (!isDraftComplete) return;

    const squad: UserSquad = {
      editionId,
      userTeamName: 'FANTASY XI',
      userTeamFlag: '⭐',
      formation,
      slots,
      overall: ratings.overall,
      attack: ratings.attack,
      midfield: ratings.midfield,
      defense: ratings.defense,
      goalkeeping: ratings.goalkeeping,
      chemistry,
    };

    onCompleteDraft(squad);
  };

  const openCompatibleSlots = selectedPlacement
    ? slots.filter(
        s =>
          s.assignedPerformance === undefined &&
          isPlayerPositionCompatible(
            selectedPlacement.player.position,
            selectedPlacement.player.secondaryPositions || [],
            s.slotConfig.position
          )
      )
    : [];

  const hasOpenCompatibleSlot = openCompatibleSlots.length > 0;

  return (
    <div className="min-h-screen fx-turf fx-vignette px-3 sm:px-6 py-4 sm:py-6 font-sans">
      {/* TOP NAVBAR */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-xl fx-display font-extrabold tracking-tight text-white uppercase">
              {compEdition.name} Squad Draft
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold text-white/50">
              Spin historical teams & build your XI
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <FormationSelector
            currentFormation={formation}
            onSelectFormation={setFormation}
            disabled={isFormationLocked}
          />

          <button
            onClick={handleResetDraft}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:text-white transition-colors"
            title="Reset Draft"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* MOBILE TAB SELECTOR (< lg screens) */}
      <div className="lg:hidden max-w-7xl mx-auto flex bg-[#081310] p-1 rounded-lg border border-white/10 mb-4">
        <button
          onClick={() => setMobileTab('SPIN')}
          className={`flex-1 py-2 text-xs fx-display font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'SPIN' ? 'bg-[#C9F31D] text-black' : 'text-white/60 hover:text-white'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" /> SPIN & POOL
        </button>
        <button
          onClick={() => setMobileTab('PITCH')}
          className={`flex-1 py-2 text-xs fx-display font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'PITCH' ? 'bg-[#C9F31D] text-black' : 'text-white/60 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> PITCH ({slots.filter(s => s.assignedPerformance).length}/11)
        </button>
        <button
          onClick={() => setMobileTab('SUMMARY')}
          className={`flex-1 py-2 text-xs fx-display font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'SUMMARY' ? 'bg-[#C9F31D] text-black' : 'text-white/60 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> STATS
        </button>
      </div>

      {/* 3-COLUMN MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MANUAL SPIN & INLINE SQUAD PICKER */}
        <div className={`lg:col-span-4 flex-col space-y-4 lg:h-[720px] ${
          mobileTab === 'SPIN' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* MANUAL SPIN BUTTON OR SPUN TEAM HEADER CARD */}
          {!hasSpun || !spunTeam ? (
            <div className="fx-panel p-5 sm:p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 py-8 sm:py-10">
              <div className="p-3.5 rounded-full bg-white/10 text-[#C9F31D] border border-[#C9F31D]/30">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg fx-display font-black text-white uppercase tracking-tight">
                  {isDraftComplete ? 'Draft Complete!' : 'Ready To Draft'}
                </h3>
                <p className="text-xs font-medium text-white/50 max-w-xs mt-1">
                  {isDraftComplete
                    ? 'Your XI is complete. Proceed to tournament simulation!'
                    : 'Click SPIN to draw a random historical team edition from the dataset'}
                </p>
              </div>

              {!isDraftComplete && (
                <button
                  onClick={handleManualSpin}
                  disabled={isSpinning}
                  className="w-full py-3.5 px-6 fx-btn text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110 disabled:opacity-50"
                  style={{ background: ACCENT }}
                >
                  <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'SPINNING...' : 'SPIN'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="fx-panel p-5 sm:p-6 shadow-2xl">
              <div className="text-[10px] fx-display font-bold tracking-widest text-white/40 uppercase mb-1">
                Drawn
              </div>
              <div className="text-xs fx-display font-bold text-white uppercase tracking-wider mb-0.5 flex items-center gap-2">
                <span className="text-lg sm:text-xl">{spunTeam.flag}</span>
                <span>{spunTeam.teamId.toUpperCase()}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl fx-display font-black text-white tracking-tight uppercase leading-none mb-1 sm:mb-2">
                {spunTeam.teamName}
              </h2>
              <div className="text-lg sm:text-xl fx-display font-extrabold tracking-tight" style={{ color: ACCENT }}>
                World Cup {spunTeam.year}
              </div>

              {/* ORTHOGONAL REROLL CONTROLS */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-[10px] fx-display font-bold tracking-wider text-white/40 uppercase mb-2">
                  Not Convinced? Reroll • {rerollsLeft} Left
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRerollCountry}
                    disabled={rerollsLeft <= 0 || isSpinning}
                    className="py-2 px-2 fx-btn bg-white/10 border border-white/20 text-[10px] sm:text-[11px] font-bold text-white hover:bg-white/20 disabled:opacity-40 uppercase transition-all"
                    title="Same World Cup, Different Country"
                  >
                    Another Country
                  </button>
                  <button
                    onClick={handleRerollWorldCup}
                    disabled={rerollsLeft <= 0 || isSpinning}
                    className="py-2 px-2 fx-btn bg-white/10 border border-white/20 text-[10px] sm:text-[11px] font-bold text-white hover:bg-white/20 disabled:opacity-40 uppercase transition-all"
                    title="Same Country, Different World Cup"
                  >
                    Another World Cup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INLINE SQUAD PICKER (only visible after manual SPIN) */}
          {hasSpun && spunTeam && (
            <InlineSquadPicker
              squad={spunTeam.squad}
              slots={slots}
              draftedIds={draftedPerformanceIds}
              selectedPlayerId={selectedPlacement?.player.id}
              onSelectPlayer={handlePickUnplacedPlayer}
            />
          )}
        </div>

        {/* CENTER COLUMN: INTERACTIVE FOOTBALL PITCH */}
        <div className={`lg:col-span-5 h-[620px] sm:h-[720px] bg-[#081310] rounded-2xl p-2 sm:p-4 border border-white/10 shadow-2xl flex flex-col items-center justify-center overflow-hidden relative ${
          mobileTab === 'PITCH' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* PLACEMENT PROMPT BANNER ABOVE PITCH */}
          {selectedPlacement && (
            <div className="w-full mb-2 p-2 sm:p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-between gap-2 shadow-xl z-30 animate-fadeIn shrink-0">
              <div className="flex items-center space-x-2 truncate">
                <span className="p-1 px-2 rounded bg-cyan-400 text-black font-black text-[10px] sm:text-xs uppercase tracking-wider shrink-0">
                  PLAYER SELECTED
                </span>
                <span className="text-xs font-bold text-white truncate">
                  <strong className="text-cyan-300 font-extrabold">{selectedPlacement.player.name}</strong> ({selectedPlacement.player.position}{selectedPlacement.player.secondaryPositions?.length ? ` / ${selectedPlacement.player.secondaryPositions.join(', ')}` : ''})
                  <span className="text-white/70 text-[11px] ml-2 hidden sm:inline">
                    {hasOpenCompatibleSlot
                      ? '• Tap an open highlighted slot on the pitch'
                      : '• No open positions available for this player'}
                  </span>
                </span>
              </div>
              <button
                onClick={() => setSelectedPlacement(null)}
                className="px-2.5 py-1 text-[10px] sm:text-xs font-bold text-cyan-200 hover:text-white bg-cyan-900/50 hover:bg-cyan-800/80 rounded transition-colors uppercase border border-cyan-500/40 shrink-0"
              >
                Cancel
              </button>
            </div>
          )}

          <FootballPitch
            slots={slots}
            activeSlotId={activeSlotId}
            selectedPlacement={selectedPlacement}
            onSelectSlot={handleSelectSlot}
            onSelectPlacedPlayer={handlePickPlacedPlayer}
            onCancelSelection={() => setSelectedPlacement(null)}
          />
        </div>

        {/* RIGHT COLUMN: SCORE & SQUAD CHECKLIST */}
        <div className={`lg:col-span-3 h-[720px] ${
          mobileTab === 'SUMMARY' ? 'block' : 'hidden lg:block'
        }`}>
          <DraftSummaryPanel
            slots={slots}
            attackRating={ratings.attack}
            defenseRating={ratings.defense}
            chemistryRating={chemistry}
            onProceed={handleProceedToTournament}
          />
        </div>

      </div>
    </div>
  );
};
