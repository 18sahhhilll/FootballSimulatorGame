import { HistoricalTeamEdition, PlayerEditionPerformance, Position } from '../types/football';
import { formatPlayerName } from '../utils/formatters';

export interface RawJsonPlayer {
  playerId: string;
  name: string;
  sel: string;
  copa: number | string;
  positions: string[];
  number: number | null;
  force: number;
  legend?: boolean;
}

export interface RawJsonTeam {
  sel: string;
  copa: number | string;
  squad: RawJsonPlayer[];
}

export const COUNTRY_METADATA: Record<string, { name: string; flag: string; primaryColor: string; secondaryColor: string }> = {
  ALG: { name: 'Algeria', flag: '🇩🇿', primaryColor: '#006633', secondaryColor: '#FFFFFF' },
  ARG: { name: 'Argentina', flag: '🇦🇷', primaryColor: '#75AADB', secondaryColor: '#FFFFFF' },
  AUS: { name: 'Australia', flag: '🇦🇺', primaryColor: '#FFCD00', secondaryColor: '#00843D' },
  AUT: { name: 'Austria', flag: '🇦🇹', primaryColor: '#ED2939', secondaryColor: '#FFFFFF' },
  BEL: { name: 'Belgium', flag: '🇧🇪', primaryColor: '#ED2939', secondaryColor: '#FFD100' },
  BRA: { name: 'Brazil', flag: '🇧🇷', primaryColor: '#FFDF00', secondaryColor: '#009C3B' },
  BUL: { name: 'Bulgaria', flag: '🇧🇬', primaryColor: '#00966E', secondaryColor: '#D62612' },
  CHI: { name: 'Chile', flag: '🇨🇱', primaryColor: '#D72B1F', secondaryColor: '#0039A6' },
  CIV: { name: 'Ivory Coast', flag: '🇨🇮', primaryColor: '#FF8200', secondaryColor: '#009A44' },
  CMR: { name: 'Cameroon', flag: '🇨🇲', primaryColor: '#007A5E', secondaryColor: '#CE1126' },
  COL: { name: 'Colombia', flag: '🇨🇴', primaryColor: '#FCD116', secondaryColor: '#003893' },
  CRC: { name: 'Costa Rica', flag: '🇨🇷', primaryColor: '#002B7F', secondaryColor: '#CE1126' },
  CRO: { name: 'Croatia', flag: '🇭🇷', primaryColor: '#FF0000', secondaryColor: '#FFFFFF' },
  CZE: { name: 'Czech Republic', flag: '🇨🇿', primaryColor: '#D7141A', secondaryColor: '#11457E' },
  DEN: { name: 'Denmark', flag: '🇩🇰', primaryColor: '#C60C30', secondaryColor: '#FFFFFF' },
  ECU: { name: 'Ecuador', flag: '🇪🇨', primaryColor: '#FFD100', secondaryColor: '#003893' },
  EGY: { name: 'Egypt', flag: '🇪🇬', primaryColor: '#C8102E', secondaryColor: '#000000' },
  ENG: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', primaryColor: '#FFFFFF', secondaryColor: '#CF081F' },
  ESP: { name: 'Spain', flag: '🇪🇸', primaryColor: '#AA1529', secondaryColor: '#F1BF00' },
  FRA: { name: 'France', flag: '🇫🇷', primaryColor: '#002395', secondaryColor: '#ED2939' },
  GER: { name: 'Germany', flag: '🇩🇪', primaryColor: '#FFFFFF', secondaryColor: '#000000' },
  GHA: { name: 'Ghana', flag: '🇬🇭', primaryColor: '#FCD116', secondaryColor: '#CE1126' },
  GRE: { name: 'Greece', flag: '🇬🇷', primaryColor: '#0D5EAF', secondaryColor: '#FFFFFF' },
  IRL: { name: 'Ireland', flag: '🇮🇪', primaryColor: '#169B62', secondaryColor: '#FF883E' },
  ITA: { name: 'Italy', flag: '🇮🇹', primaryColor: '#00468B', secondaryColor: '#FFFFFF' },
  JPN: { name: 'Japan', flag: '🇯🇵', primaryColor: '#000080', secondaryColor: '#FFFFFF' },
  KOR: { name: 'South Korea', flag: '🇰🇷', primaryColor: '#EC0F38', secondaryColor: '#0047A0' },
  MAR: { name: 'Morocco', flag: '🇲🇦', primaryColor: '#C1272D', secondaryColor: '#006233' },
  MEX: { name: 'Mexico', flag: '🇲🇽', primaryColor: '#006847', secondaryColor: '#CE1126' },
  NED: { name: 'Netherlands', flag: '🇳🇱', primaryColor: '#F36C21', secondaryColor: '#002568' },
  NGA: { name: 'Nigeria', flag: '🇳🇬', primaryColor: '#008751', secondaryColor: '#FFFFFF' },
  PAR: { name: 'Paraguay', flag: '🇵🇾', primaryColor: '#D52B1E', secondaryColor: '#0038A8' },
  PER: { name: 'Peru', flag: '🇵🇪', primaryColor: '#D91023', secondaryColor: '#FFFFFF' },
  POL: { name: 'Poland', flag: '🇵🇱', primaryColor: '#DC143C', secondaryColor: '#FFFFFF' },
  POR: { name: 'Portugal', flag: '🇵🇹', primaryColor: '#FF0000', secondaryColor: '#006600' },
  ROU: { name: 'Romania', flag: '🇷🇴', primaryColor: '#002B7F', secondaryColor: '#FCD116' },
  RUS: { name: 'Russia', flag: '🇷🇺', primaryColor: '#D52B1E', secondaryColor: '#0039A6' },
  SCO: { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', primaryColor: '#0065BF', secondaryColor: '#FFFFFF' },
  SEN: { name: 'Senegal', flag: '🇸🇳', primaryColor: '#00853F', secondaryColor: '#FDEF42' },
  SRB: { name: 'Serbia', flag: '🇷🇸', primaryColor: '#C6363C', secondaryColor: '#0C4076' },
  SUI: { name: 'Switzerland', flag: '🇨🇭', primaryColor: '#D52B1E', secondaryColor: '#FFFFFF' },
  SWE: { name: 'Sweden', flag: '🇸🇪', primaryColor: '#006AA7', secondaryColor: '#FECC00' },
  TUR: { name: 'Turkey', flag: '🇹🇷', primaryColor: '#E30A17', secondaryColor: '#FFFFFF' },
  UKR: { name: 'Ukraine', flag: '🇺🇦', primaryColor: '#0057B7', secondaryColor: '#FFD700' },
  URU: { name: 'Uruguay', flag: '🇺🇾', primaryColor: '#55B5E5', secondaryColor: '#FFFFFF' },
  USA: { name: 'United States', flag: '🇺🇸', primaryColor: '#002868', secondaryColor: '#BF0A30' },

  // La Liga Clubs Metadata
  BAR: { name: 'FC Barcelona', flag: '🔵🔴', primaryColor: '#004D98', secondaryColor: '#A50044' },
  RMA: { name: 'Real Madrid', flag: '⚪', primaryColor: '#FEBE10', secondaryColor: '#00529F' },
  ATM: { name: 'Atlético Madrid', flag: '🔴⚪', primaryColor: '#CB3524', secondaryColor: '#272E61' },
  SEV: { name: 'Sevilla FC', flag: '⚪🔴', primaryColor: '#D71920', secondaryColor: '#FFFFFF' },
  ATH: { name: 'Athletic Bilbao', flag: '🔴⚪', primaryColor: '#EE2523', secondaryColor: '#000000' },
  CEL: { name: 'Celta Vigo', flag: '🩵', primaryColor: '#87CEEB', secondaryColor: '#FFFFFF' },
  BET: { name: 'Real Betis', flag: '🟢⚪', primaryColor: '#00954C', secondaryColor: '#FFFFFF' },
  VIL: { name: 'Villarreal', flag: '🟡', primaryColor: '#FFE600', secondaryColor: '#00529F' },
  RSO: { name: 'Real Sociedad', flag: '🔵⚪', primaryColor: '#004085', secondaryColor: '#FFFFFF' },
  VAL: { name: 'Valencia CF', flag: '⚪🦇', primaryColor: '#FFFFFF', secondaryColor: '#000000' },
  GET: { name: 'Getafe CF', flag: '🔵', primaryColor: '#00539F', secondaryColor: '#FFFFFF' },
  OSA: { name: 'CA Osasuna', flag: '🔴🔵', primaryColor: '#D71920', secondaryColor: '#002B7F' },
  RAY: { name: 'Rayo Vallecano', flag: '⚪🔴', primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
  ALA: { name: 'Deportivo Alavés', flag: '🔵⚪', primaryColor: '#00529F', secondaryColor: '#FFFFFF' },
  EPN: { name: 'RCD Espanyol', flag: '🔵⚪', primaryColor: '#0066B3', secondaryColor: '#FFFFFF' },
  ELC: { name: 'Elche CF', flag: '🟢⚪', primaryColor: '#008751', secondaryColor: '#FFFFFF' },
  LEV: { name: 'Levante UD', flag: '🔵🔴', primaryColor: '#0033A0', secondaryColor: '#C8102E' },
  MAL: { name: 'Málaga CF', flag: '🩵⚪', primaryColor: '#6CABDD', secondaryColor: '#FFFFFF' },
  RAC: { name: 'Racing Santander', flag: '🟢⚪', primaryColor: '#008000', secondaryColor: '#FFFFFF' },
  DEP: { name: 'Deportivo La Coruña', flag: '🔵⚪', primaryColor: '#004B87', secondaryColor: '#FFFFFF' },
};

const POS_MAP: Record<string, Position> = {
  GOL: 'GK',
  ZAG: 'CB',
  LD: 'RB',
  LE: 'LB',
  MD: 'RM',
  ME: 'LM',
  MEI: 'CAM',
  PD: 'RW',
  PE: 'LW',
  CA: 'ST',
};

const SECONDARY_POS_MAP: Record<string, Position[]> = {
  GOL: [],
  ZAG: [],
  LD: ['RWB', 'RM'],
  LE: ['LWB', 'LM'],
  MD: ['CM', 'RB'],
  ME: ['CM', 'LB'],
  MEI: ['CM', 'CDM'],
  PD: ['RM', 'ST'],
  PE: ['LM', 'ST'],
  CA: ['RW', 'LW', 'CAM'],
};

function mapPosition(rawPos: string): Position {
  return POS_MAP[rawPos] || 'CM';
}

function mapSecondaryPositions(rawPositions: string[]): Position[] {
  const secondary: Set<Position> = new Set();
  if (rawPositions.length > 1) {
    for (let i = 1; i < rawPositions.length; i++) {
      const pos = POS_MAP[rawPositions[i]];
      if (pos) secondary.add(pos);
    }
  }
  const primaryRaw = rawPositions[0];
  if (primaryRaw && SECONDARY_POS_MAP[primaryRaw]) {
    SECONDARY_POS_MAP[primaryRaw].forEach(p => secondary.add(p));
  }
  return Array.from(secondary);
}

function deriveAttributes(pos: Position, force: number) {
  const f = Math.min(99, Math.max(40, force));
  let pace = f;
  let shooting = f;
  let passing = f;
  let dribbling = f;
  let defending = f;
  let physical = f;

  switch (pos) {
    case 'GK':
      pace = f - 10; shooting = 30; passing = f - 15; dribbling = 40; defending = f; physical = f - 5;
      break;
    case 'CB':
      pace = f - 12; shooting = f - 35; passing = f - 15; dribbling = f - 20; defending = f; physical = f + 2;
      break;
    case 'RB':
    case 'LB':
    case 'RWB':
    case 'LWB':
      pace = f + 2; shooting = f - 25; passing = f - 10; dribbling = f - 10; defending = f - 5; physical = f - 5;
      break;
    case 'CDM':
    case 'CM':
      pace = f - 5; shooting = f - 15; passing = f + 2; dribbling = f - 5; defending = f - 5; physical = f;
      break;
    case 'CAM':
      pace = f - 5; shooting = f - 10; passing = f + 2; dribbling = f + 2; defending = f - 35; physical = f - 20;
      break;
    case 'RM':
    case 'LM':
      pace = f; shooting = f - 15; passing = f - 5; dribbling = f; defending = f - 25; physical = f - 15;
      break;
    case 'RW':
    case 'LW':
      pace = f + 3; shooting = f - 5; passing = f - 10; dribbling = f + 3; defending = f - 40; physical = f - 20;
      break;
    case 'ST':
      pace = f - 5; shooting = f + 3; passing = f - 15; dribbling = f - 8; defending = f - 45; physical = f - 5;
      break;
  }

  const clamp = (v: number) => Math.min(99, Math.max(40, v));

  return {
    pace: clamp(pace),
    shooting: clamp(shooting),
    passing: clamp(passing),
    dribbling: clamp(dribbling),
    defending: clamp(defending),
    physical: clamp(physical),
  };
}

export function loadAllWorldCupTeams(): HistoricalTeamEdition[] {
  // Load team JSONs strictly from src/data-json/World Cup Edition/
  const jsonFiles = import.meta.glob<RawJsonTeam>('../data-json/World Cup Edition/*.json', { eager: true });
  
  const teams: HistoricalTeamEdition[] = [];

  for (const path in jsonFiles) {
    const rawData = jsonFiles[path];
    if (!rawData || !rawData.sel || !Array.isArray(rawData.squad)) {
      continue;
    }

    const countryMeta = COUNTRY_METADATA[rawData.sel] || {
      name: rawData.sel,
      flag: '🏳️',
      primaryColor: '#0066CC',
      secondaryColor: '#FFFFFF',
    };

    const teamId = countryMeta.name.toLowerCase().replace(/\s+/g, '-');
    const yearVal = typeof rawData.copa === 'number' ? rawData.copa : (parseInt(String(rawData.copa)) || 2026);
    const editionId = `world-cup-${rawData.copa}`;
    const historicalId = `${teamId}-${rawData.copa}`;

    const squad: PlayerEditionPerformance[] = rawData.squad.map((p: RawJsonPlayer, idx: number) => {
      const primaryPos = mapPosition(p.positions && p.positions[0] ? p.positions[0] : 'CA');
      const secondaryPos = mapSecondaryPositions(p.positions || []);
      const attrs = deriveAttributes(primaryPos, p.force || 75);

      return {
        id: `${historicalId}-${p.playerId || idx}`,
        playerId: p.playerId || `${teamId}-${idx}`,
        name: formatPlayerName(p.name, p.playerId),
        teamId,
        editionId,
        position: primaryPos,
        secondaryPositions: secondaryPos,
        overall: p.force || 75,
        isLegend: p.legend === true,
        ...attrs,
        appearances: Math.floor(Math.random() * 4) + 3,
        goals: p.positions?.includes('CA') || p.positions?.includes('PD') || p.positions?.includes('PE') ? Math.floor(Math.random() * 4) : 0,
      };
    });

    teams.push({
      id: historicalId,
      teamId,
      teamName: countryMeta.name,
      country: countryMeta.name,
      flag: countryMeta.flag,
      year: yearVal,
      editionId,
      squad,
    });
  }

  // Sort by year descending, then team name
  return teams.sort((a, b) => b.year - a.year || a.teamName.localeCompare(b.teamName));
}

export function loadAllLaligaTeams(): HistoricalTeamEdition[] {
  // Load La Liga team JSONs strictly from src/data-json/Laliga Edition/
  const jsonFiles = import.meta.glob<RawJsonTeam>('../data-json/Laliga Edition/*.json', { eager: true });
  
  const teams: HistoricalTeamEdition[] = [];

  for (const path in jsonFiles) {
    const rawData = jsonFiles[path];
    if (!rawData || !rawData.sel || !Array.isArray(rawData.squad)) {
      continue;
    }

    const clubMeta = COUNTRY_METADATA[rawData.sel] || {
      name: rawData.sel,
      flag: '⚽',
      primaryColor: '#004D98',
      secondaryColor: '#FFFFFF',
    };

    const teamId = clubMeta.name.toLowerCase().replace(/\s+/g, '-');
    const yearVal = 2026;
    const editionId = `laliga-${rawData.copa || '2026-27'}`;
    const historicalId = `${teamId}-${rawData.copa || '2026-27'}`;

    const squad: PlayerEditionPerformance[] = rawData.squad.map((p: RawJsonPlayer, idx: number) => {
      const primaryPos = mapPosition(p.positions && p.positions[0] ? p.positions[0] : 'CA');
      const secondaryPos = mapSecondaryPositions(p.positions || []);
      const attrs = deriveAttributes(primaryPos, p.force || 75);

      return {
        id: `${historicalId}-${p.playerId || idx}`,
        playerId: p.playerId || `${teamId}-${idx}`,
        name: formatPlayerName(p.name, p.playerId),
        teamId,
        editionId,
        position: primaryPos,
        secondaryPositions: secondaryPos,
        overall: p.force || 75,
        isLegend: p.legend === true,
        ...attrs,
        appearances: Math.floor(Math.random() * 4) + 3,
        goals: p.positions?.includes('CA') || p.positions?.includes('PD') || p.positions?.includes('PE') ? Math.floor(Math.random() * 4) : 0,
      };
    });

    teams.push({
      id: historicalId,
      teamId,
      teamName: clubMeta.name,
      country: clubMeta.name,
      flag: clubMeta.flag,
      year: yearVal,
      editionId,
      squad,
    });
  }

  return teams.sort((a, b) => a.teamName.localeCompare(b.teamName));
}

export function loadTeamsForEdition(editionId?: string): HistoricalTeamEdition[] {
  if (editionId === 'la-liga-mode') {
    return loadAllLaligaTeams();
  }
  // Default and 'world-cup-mode' -> World Cup Edition teams only
  return loadAllWorldCupTeams();
}

export function loadAllJsonHistoricalTeams(editionId?: string): HistoricalTeamEdition[] {
  return loadTeamsForEdition(editionId);
}
