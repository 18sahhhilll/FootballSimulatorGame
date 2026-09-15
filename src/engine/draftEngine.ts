import { 
  FormationId, 
  FormationSlotConfig, 
  Position, 
  PlayerEditionPerformance, 
  HistoricalTeamEdition,
  PlayerSlotAvailabilityState,
  DraftSlot 
} from '../types/football';
import { loadTeamsForEdition } from '../data/jsonLoader';
import { getPositionGroup } from './ratingEngine';

export const FORMATION_CONFIGS: Record<FormationId, FormationSlotConfig[]> = {
  '4-3-3': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'lb-1', position: 'LB', label: 'LB', x: 18, y: 70 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 38, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'RCB', x: 62, y: 72 },
    { id: 'rb-1', position: 'RB', label: 'RB', x: 82, y: 70 },
    { id: 'cm-1', position: 'CM', label: 'LCM', x: 28, y: 48 },
    { id: 'cdm-1', position: 'CDM', label: 'CDM', x: 50, y: 52 },
    { id: 'cm-2', position: 'CM', label: 'RCM', x: 72, y: 48 },
    { id: 'lw-1', position: 'LW', label: 'LW', x: 22, y: 22 },
    { id: 'st-1', position: 'ST', label: 'ST', x: 50, y: 16 },
    { id: 'rw-1', position: 'RW', label: 'RW', x: 78, y: 22 },
  ],
  '4-2-3-1': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'lb-1', position: 'LB', label: 'LB', x: 18, y: 70 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 38, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'RCB', x: 62, y: 72 },
    { id: 'rb-1', position: 'RB', label: 'RB', x: 82, y: 70 },
    { id: 'cdm-1', position: 'CDM', label: 'LDM', x: 35, y: 55 },
    { id: 'cdm-2', position: 'CDM', label: 'RDM', x: 65, y: 55 },
    { id: 'cam-1', position: 'CAM', label: 'CAM', x: 50, y: 35 },
    { id: 'lw-1', position: 'LW', label: 'LAM', x: 22, y: 32 },
    { id: 'st-1', position: 'ST', label: 'ST', x: 50, y: 16 },
    { id: 'rw-1', position: 'RW', label: 'RAM', x: 78, y: 32 },
  ],
  '4-4-2': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'lb-1', position: 'LB', label: 'LB', x: 18, y: 70 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 38, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'RCB', x: 62, y: 72 },
    { id: 'rb-1', position: 'RB', label: 'RB', x: 82, y: 70 },
    { id: 'lm-1', position: 'LM', label: 'LM', x: 20, y: 45 },
    { id: 'cm-1', position: 'CM', label: 'LCM', x: 40, y: 48 },
    { id: 'cm-2', position: 'CM', label: 'RCM', x: 60, y: 48 },
    { id: 'rm-1', position: 'RM', label: 'RM', x: 80, y: 45 },
    { id: 'st-1', position: 'ST', label: 'LST', x: 38, y: 18 },
    { id: 'st-2', position: 'ST', label: 'RST', x: 62, y: 18 },
  ],
  '3-5-2': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 25, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'CCB', x: 50, y: 74 },
    { id: 'cb-3', position: 'CB', label: 'RCB', x: 75, y: 72 },
    { id: 'cdm-1', position: 'CDM', label: 'LDM', x: 36, y: 56 },
    { id: 'lwb-1', position: 'LWB', label: 'LWB', x: 15, y: 44 },
    { id: 'cm-1', position: 'CM', label: 'CM', x: 50, y: 45 },
    { id: 'cam-1', position: 'CAM', label: 'CAM', x: 50, y: 32 },
    { id: 'rwb-1', position: 'RWB', label: 'RWB', x: 85, y: 44 },
    { id: 'st-1', position: 'ST', label: 'LST', x: 38, y: 18 },
    { id: 'st-2', position: 'ST', label: 'RST', x: 62, y: 18 },
  ],
  '3-4-3': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 25, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'CCB', x: 50, y: 74 },
    { id: 'cb-3', position: 'CB', label: 'RCB', x: 75, y: 72 },
    { id: 'lm-1', position: 'LM', label: 'LM', x: 18, y: 48 },
    { id: 'cm-1', position: 'CM', label: 'LCM', x: 38, y: 50 },
    { id: 'cm-2', position: 'CM', label: 'RCM', x: 62, y: 50 },
    { id: 'rm-1', position: 'RM', label: 'RM', x: 82, y: 48 },
    { id: 'lw-1', position: 'LW', label: 'LW', x: 22, y: 22 },
    { id: 'st-1', position: 'ST', label: 'ST', x: 50, y: 16 },
    { id: 'rw-1', position: 'RW', label: 'RW', x: 78, y: 22 },
  ],
  '4-1-2-1-2': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'lb-1', position: 'LB', label: 'LB', x: 18, y: 70 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 38, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'RCB', x: 62, y: 72 },
    { id: 'rb-1', position: 'RB', label: 'RB', x: 82, y: 70 },
    { id: 'cdm-1', position: 'CDM', label: 'CDM', x: 50, y: 58 },
    { id: 'cm-1', position: 'CM', label: 'LCM', x: 30, y: 45 },
    { id: 'cm-2', position: 'CM', label: 'RCM', x: 70, y: 45 },
    { id: 'cam-1', position: 'CAM', label: 'CAM', x: 50, y: 32 },
    { id: 'st-1', position: 'ST', label: 'LST', x: 38, y: 16 },
    { id: 'st-2', position: 'ST', label: 'RST', x: 62, y: 16 },
  ],
  '5-3-2': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'lwb-1', position: 'LWB', label: 'LWB', x: 15, y: 60 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 32, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'CCB', x: 50, y: 74 },
    { id: 'cb-3', position: 'CB', label: 'RCB', x: 68, y: 72 },
    { id: 'rwb-1', position: 'RWB', label: 'RWB', x: 85, y: 60 },
    { id: 'cm-1', position: 'CM', label: 'LCM', x: 32, y: 44 },
    { id: 'cm-2', position: 'CM', label: 'CM', x: 50, y: 46 },
    { id: 'cm-3', position: 'CM', label: 'RCM', x: 68, y: 44 },
    { id: 'st-1', position: 'ST', label: 'LST', x: 38, y: 18 },
    { id: 'st-2', position: 'ST', label: 'RST', x: 62, y: 18 },
  ],
  '5-4-1': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'lwb-1', position: 'LWB', label: 'LWB', x: 15, y: 60 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 32, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'CCB', x: 50, y: 74 },
    { id: 'cb-3', position: 'CB', label: 'RCB', x: 68, y: 72 },
    { id: 'rwb-1', position: 'RWB', label: 'RWB', x: 85, y: 60 },
    { id: 'lm-1', position: 'LM', label: 'LM', x: 20, y: 42 },
    { id: 'cm-1', position: 'CM', label: 'LCM', x: 40, y: 45 },
    { id: 'cm-2', position: 'CM', label: 'RCM', x: 60, y: 45 },
    { id: 'rm-1', position: 'RM', label: 'RM', x: 80, y: 42 },
    { id: 'st-1', position: 'ST', label: 'ST', x: 50, y: 18 },
  ],
  '4-1-4-1': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'lb-1', position: 'LB', label: 'LB', x: 18, y: 70 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 38, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'RCB', x: 62, y: 72 },
    { id: 'rb-1', position: 'RB', label: 'RB', x: 82, y: 70 },
    { id: 'cdm-1', position: 'CDM', label: 'CDM', x: 50, y: 56 },
    { id: 'lm-1', position: 'LM', label: 'LM', x: 20, y: 36 },
    { id: 'cm-1', position: 'CM', label: 'LCM', x: 40, y: 38 },
    { id: 'cm-2', position: 'CM', label: 'RCM', x: 60, y: 38 },
    { id: 'rm-1', position: 'RM', label: 'RM', x: 80, y: 36 },
    { id: 'st-1', position: 'ST', label: 'ST', x: 50, y: 16 },
  ],
  '4-2-2-2': [
    { id: 'gk-1', position: 'GK', label: 'GK', x: 50, y: 88 },
    { id: 'lb-1', position: 'LB', label: 'LB', x: 18, y: 70 },
    { id: 'cb-1', position: 'CB', label: 'LCB', x: 38, y: 72 },
    { id: 'cb-2', position: 'CB', label: 'RCB', x: 62, y: 72 },
    { id: 'rb-1', position: 'RB', label: 'RB', x: 82, y: 70 },
    { id: 'cdm-1', position: 'CDM', label: 'LDM', x: 38, y: 54 },
    { id: 'cdm-2', position: 'CDM', label: 'RDM', x: 62, y: 54 },
    { id: 'cam-1', position: 'CAM', label: 'LAM', x: 30, y: 36 },
    { id: 'cam-2', position: 'CAM', label: 'RAM', x: 70, y: 36 },
    { id: 'st-1', position: 'ST', label: 'LST', x: 38, y: 18 },
    { id: 'st-2', position: 'ST', label: 'RST', x: 62, y: 18 },
  ],
};

// Position Compatibility Evaluator
export function isPlayerPositionCompatible(playerPos: Position, secondaryPos: Position[], targetPos: Position): boolean {
  if (playerPos === targetPos) return true;
  if (secondaryPos && secondaryPos.includes(targetPos)) return true;

  const playerGroup = getPositionGroup(playerPos);
  const targetGroup = getPositionGroup(targetPos);

  if (playerGroup === targetGroup && playerPos !== 'GK' && targetPos !== 'GK') return true;

  return false;
}

// Position-INDEPENDENT Team Spin Engine
export function getRandomHistoricalTeamForSpin(editionId?: string): { selectedTeam: HistoricalTeamEdition; candidates: HistoricalTeamEdition[] } {
  const allTeams = loadTeamsForEdition(editionId);
  const selectedTeam = allTeams[Math.floor(Math.random() * allTeams.length)];

  // Generate roulette reel items
  const reelPool = [...allTeams].sort(() => Math.random() - 0.5).slice(0, 7);
  if (!reelPool.includes(selectedTeam)) {
    reelPool[0] = selectedTeam;
  }

  const shuffledReel = [...reelPool].sort(() => Math.random() - 0.5);

  return {
    selectedTeam,
    candidates: shuffledReel,
  };
}

// Evaluate Availability State of a Player Card against ALL remaining open formation slots
export function evaluatePlayerSlotAvailability(
  player: PlayerEditionPerformance,
  currentSlots: DraftSlot[],
  draftedPerformanceIds: string[]
): PlayerSlotAvailabilityState {
  if (draftedPerformanceIds.includes(player.id)) {
    return 'ALREADY_IN_XI';
  }

  const openSlots = currentSlots.filter(s => s.assignedPerformance === undefined);

  // Check if player position fits ANY currently open slot
  const fitsAnyOpenSlot = openSlots.some(slot => 
    isPlayerPositionCompatible(player.position, player.secondaryPositions, slot.slotConfig.position)
  );

  if (fitsAnyOpenSlot) {
    return 'AVAILABLE';
  }

  // Check if player position matches formation, but all slots for that position are filled
  const matchesFormation = currentSlots.some(slot =>
    isPlayerPositionCompatible(player.position, player.secondaryPositions, slot.slotConfig.position)
  );

  if (matchesFormation) {
    return 'SLOTS_FULL';
  }

  return 'NO_OPEN_POSITION';
}

// Find the best open slot in user's XI for a picked player
export function findBestSlotForPlayer(
  player: PlayerEditionPerformance,
  currentSlots: DraftSlot[]
): DraftSlot | null {
  const openSlots = currentSlots.filter(s => s.assignedPerformance === undefined);

  // 1. First priority: Exact position match on open slot (e.g. ST at open ST-1)
  const exactMatchSlot = openSlots.find(s => s.slotConfig.position === player.position);
  if (exactMatchSlot) return exactMatchSlot;

  // 2. Second priority: Secondary position match (e.g. RW at open CAM-1)
  if (player.secondaryPositions) {
    const secondaryMatchSlot = openSlots.find(s => player.secondaryPositions.includes(s.slotConfig.position));
    if (secondaryMatchSlot) return secondaryMatchSlot;
  }

  // 3. Third priority: Compatible position group match (e.g. LW at open ST-1)
  const compatibleSlot = openSlots.find(s =>
    isPlayerPositionCompatible(player.position, player.secondaryPositions, s.slotConfig.position)
  );

  return compatibleSlot || null;
}

// Automatically construct the strongest Playing XI from a squad for opponent teams (excluding suspended players)
export function buildBestPlayingXI(
  teamEdition: HistoricalTeamEdition,
  formation: FormationId = '4-3-3',
  excludedPlayerIds?: Set<string>
): DraftSlot[] {
  const configs = FORMATION_CONFIGS[formation] || FORMATION_CONFIGS['4-3-3'];
  const availableSquad = teamEdition.squad.filter(p => !excludedPlayerIds || !excludedPlayerIds.has(p.id));
  const remainingSquad = [...availableSquad].sort((a, b) => b.overall - a.overall);
  const assignedPlayerIds = new Set<string>();

  const resultSlots: DraftSlot[] = configs.map(cfg => ({
    slotConfig: cfg,
    positionFit: 100,
  }));

  // Pass 1: Assign best player with exact position match
  for (const slot of resultSlots) {
    const targetPos = slot.slotConfig.position;
    const exactMatch = remainingSquad.find(
      p => !assignedPlayerIds.has(p.id) && p.position === targetPos
    );
    if (exactMatch) {
      slot.assignedPerformance = exactMatch;
      assignedPlayerIds.add(exactMatch.id);
    }
  }

  // Pass 2: Assign best player with secondary position match
  for (const slot of resultSlots) {
    if (slot.assignedPerformance) continue;
    const targetPos = slot.slotConfig.position;
    const secondaryMatch = remainingSquad.find(
      p => !assignedPlayerIds.has(p.id) && p.secondaryPositions && p.secondaryPositions.includes(targetPos)
    );
    if (secondaryMatch) {
      slot.assignedPerformance = secondaryMatch;
      assignedPlayerIds.add(secondaryMatch.id);
    }
  }

  // Pass 3: Assign best player with position group compatibility
  for (const slot of resultSlots) {
    if (slot.assignedPerformance) continue;
    const targetPos = slot.slotConfig.position;
    const compatibleMatch = remainingSquad.find(
      p => !assignedPlayerIds.has(p.id) && isPlayerPositionCompatible(p.position, p.secondaryPositions, targetPos)
    );
    if (compatibleMatch) {
      slot.assignedPerformance = compatibleMatch;
      assignedPlayerIds.add(compatibleMatch.id);
    }
  }

  // Pass 4: Fill remaining unfilled slots with highest remaining overall players
  for (const slot of resultSlots) {
    if (slot.assignedPerformance) continue;
    const unassigned = remainingSquad.find(p => !assignedPlayerIds.has(p.id));
    if (unassigned) {
      slot.assignedPerformance = unassigned;
      assignedPlayerIds.add(unassigned.id);
    }
  }

  return resultSlots;
}
