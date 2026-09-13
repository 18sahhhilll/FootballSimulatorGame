import { PlayerEditionPerformance, HistoricalTeamEdition } from '../types/football';
import { ALL_PERFORMANCES } from './index';
import { loadAllJsonHistoricalTeams } from './jsonLoader';

// Load all 177 JSON Historical Team Squads from src/data-json
export const JSON_HISTORICAL_TEAMS: HistoricalTeamEdition[] = loadAllJsonHistoricalTeams();

// Historical fallback performances populated across World Cups
const CSV_HISTORICAL_PERFORMANCES: PlayerEditionPerformance[] = [
  // 1930 URUGUAY & ARGENTINA
  { id: 'arg1930-stabile', playerId: 'stabile', teamId: 'argentina', editionId: 'world-cup-1930', position: 'ST', secondaryPositions: [], overall: 92, pace: 88, shooting: 94, passing: 72, dribbling: 84, defending: 35, physical: 80, goals: 8 },
  { id: 'uru1930-cea', playerId: 'cea', teamId: 'uruguay', editionId: 'world-cup-1930', position: 'ST', secondaryPositions: ['CAM'], overall: 91, pace: 82, shooting: 90, passing: 84, dribbling: 86, defending: 40, physical: 82, goals: 5 },

  // 1934 ITALY & CZECHOSLOVAKIA
  { id: 'cze1934-nejedly', playerId: 'nejedly', teamId: 'czechoslovakia', editionId: 'world-cup-1934', position: 'ST', secondaryPositions: ['LW'], overall: 90, pace: 85, shooting: 91, passing: 78, dribbling: 84, defending: 35, physical: 76, goals: 5 },
  { id: 'ita1934-meazza', playerId: 'meazza', teamId: 'italy', editionId: 'world-cup-1934', position: 'ST', secondaryPositions: ['CAM'], overall: 94, pace: 86, shooting: 93, passing: 88, dribbling: 92, defending: 38, physical: 78, goals: 2 },

  // 1938 ITALY & BRAZIL
  { id: 'bra1938-leonidas', playerId: 'leonidas', teamId: 'brazil', editionId: 'world-cup-1938', position: 'ST', secondaryPositions: [], overall: 93, pace: 90, shooting: 94, passing: 76, dribbling: 91, defending: 34, physical: 78, goals: 7 },
  { id: 'ita1938-piola', playerId: 'piola', teamId: 'italy', editionId: 'world-cup-1938', position: 'ST', secondaryPositions: [], overall: 92, pace: 84, shooting: 93, passing: 75, dribbling: 85, defending: 36, physical: 82, goals: 5 },

  // 1950 URUGUAY & BRAZIL
  { id: 'bra1950-ademir', playerId: 'ademir', teamId: 'brazil', editionId: 'world-cup-1950', position: 'ST', secondaryPositions: ['RW'], overall: 94, pace: 91, shooting: 95, passing: 80, dribbling: 90, defending: 36, physical: 80, goals: 8 },
  { id: 'uru1950-schiaffino', playerId: 'schiaffino', teamId: 'uruguay', editionId: 'world-cup-1950', position: 'CAM', secondaryPositions: ['ST'], overall: 93, pace: 84, shooting: 88, passing: 92, dribbling: 91, defending: 50, physical: 76, goals: 3 },

  // 1954 WEST GERMANY & HUNGARY
  { id: 'hun1954-kocsis', playerId: 'kocsis', teamId: 'hungary', editionId: 'world-cup-1954', position: 'ST', secondaryPositions: [], overall: 95, pace: 86, shooting: 97, passing: 78, dribbling: 88, defending: 38, physical: 84, goals: 11 },
  { id: 'hun1954-puskas', playerId: 'puskas', teamId: 'hungary', editionId: 'world-cup-1954', position: 'ST', secondaryPositions: ['CAM'], overall: 96, pace: 88, shooting: 98, passing: 90, dribbling: 93, defending: 35, physical: 80, goals: 4 },

  // 1958 BRAZIL & FRANCE
  { id: 'fra1958-fontaine', playerId: 'fontaine', teamId: 'france', editionId: 'world-cup-1958', position: 'ST', secondaryPositions: [], overall: 96, pace: 90, shooting: 98, passing: 76, dribbling: 87, defending: 34, physical: 80, goals: 13 },
  { id: 'bra1958-pele', playerId: 'pele', teamId: 'brazil', editionId: 'world-cup-1958', position: 'ST', secondaryPositions: ['LW'], overall: 95, pace: 93, shooting: 94, passing: 88, dribbling: 95, defending: 38, physical: 80, goals: 6 },

  // 1962 BRAZIL & CHILE
  { id: 'bra1962-garrincha', playerId: 'garrincha', teamId: 'brazil', editionId: 'world-cup-1962', position: 'RW', secondaryPositions: ['ST'], overall: 96, pace: 95, shooting: 90, passing: 88, dribbling: 98, defending: 36, physical: 76, goals: 4 },

  // 1966 ENGLAND & PORTUGAL
  { id: 'por1966-eusebio', playerId: 'eusebio', teamId: 'portugal', editionId: 'world-cup-1966', position: 'ST', secondaryPositions: ['CAM'], overall: 96, pace: 94, shooting: 96, passing: 82, dribbling: 92, defending: 38, physical: 84, goals: 9 },
  { id: 'eng1966-hurst', playerId: 'hurst', teamId: 'england', editionId: 'world-cup-1966', position: 'ST', secondaryPositions: [], overall: 90, pace: 82, shooting: 91, passing: 74, dribbling: 80, defending: 40, physical: 84, goals: 4 },
];

export const ALL_COMBINED_PERFORMANCES: PlayerEditionPerformance[] = [
  ...ALL_PERFORMANCES,
  ...CSV_HISTORICAL_PERFORMANCES,
];

// Combine loaded JSON team editions with any extra historical team editions
export function getHistoricalTeamEditions(): HistoricalTeamEdition[] {
  if (JSON_HISTORICAL_TEAMS && JSON_HISTORICAL_TEAMS.length > 0) {
    return JSON_HISTORICAL_TEAMS;
  }

  // Fallback if no JSON teams loaded
  const map = new Map<string, HistoricalTeamEdition>();

  ALL_COMBINED_PERFORMANCES.forEach(perf => {
    const key = `${perf.teamId}-${perf.editionId}`;
    if (!map.has(key)) {
      const year = parseInt(perf.editionId.replace(/[^0-9]/g, '')) || 2022;
      const teamName = perf.teamId.charAt(0).toUpperCase() + perf.teamId.slice(1);
      map.set(key, {
        id: key,
        teamId: perf.teamId,
        teamName,
        country: teamName,
        flag: '⚽',
        year,
        editionId: perf.editionId,
        squad: [],
      });
    }

    map.get(key)!.squad.push(perf);
  });

  return Array.from(map.values());
}
