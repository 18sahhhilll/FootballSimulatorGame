export type Position = 
  | 'GK' 
  | 'CB' 
  | 'LB' 
  | 'RB' 
  | 'LWB'
  | 'RWB'
  | 'CDM' 
  | 'CM' 
  | 'CAM' 
  | 'LM'
  | 'RM'
  | 'LW' 
  | 'RW' 
  | 'ST';

export type PositionCategory = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  nationality: string;
  flag: string;
  defaultPhotoUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  country: string;
  shortName: string;
  flag: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export type CompetitionType = 'WORLD_CUP' | 'CHAMPIONS_LEAGUE' | 'PREMIER_LEAGUE' | 'LA_LIGA';

export interface Edition {
  id: string;
  name: string;
  type: CompetitionType;
  year?: number;
  hostCountry?: string;
  hostFlag?: string;
  teams: string[];
  isAvailable: boolean;
  description: string;
  badge: string;
}

export interface PlayerEditionPerformance {
  id: string;
  playerId: string;
  teamId: string;
  editionId: string;

  name?: string;

  position: Position;
  secondaryPositions: Position[];

  overall: number;
  isLegend?: boolean;

  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;

  appearances?: number;
  goals?: number;
  assists?: number;
}

export interface HistoricalTeamEdition {
  id: string; // e.g. "germany-2014"
  teamId: string;
  teamName: string;
  country: string;
  flag: string;
  year: number;
  editionId: string;
  squad: PlayerEditionPerformance[];
}

export type FormationId = '4-3-3' | '4-2-3-1' | '4-4-2' | '3-5-2' | '3-4-3' | '4-1-2-1-2' | '5-3-2' | '5-4-1' | '4-1-4-1' | '4-2-2-2';

export interface FormationSlotConfig {
  id: string; // e.g. "gk-1", "lb-1", "cb-1", "cb-2", "st-1"
  position: Position;
  label: string;
  x: number; // % from left
  y: number; // % from top
}

export interface ActiveSelectedPlayer {
  player: PlayerEditionPerformance;
  fromSlotId: string | null; // null if from drawn pool, slotId string if placed on pitch
}

export interface DraftSlot {
  slotConfig: FormationSlotConfig;
  assignedPerformance?: PlayerEditionPerformance;
  positionFit: number; // 0 to 100
}

export interface UserSquad {
  editionId: string;
  userTeamName: string;
  userTeamFlag: string;
  formation: FormationId;
  slots: DraftSlot[];
  overall: number;
  attack: number;
  midfield: number;
  defense: number;
  goalkeeping: number;
  chemistry: number;
}

export type PlayerSlotAvailabilityState = 'AVAILABLE' | 'SLOTS_FULL' | 'NO_OPEN_POSITION' | 'ALREADY_IN_XI';

export type DetailedMatchEventType =
  | 'KICKOFF'
  | 'POSSESSION'
  | 'BUILDUP'
  | 'PASS'
  | 'THROUGH_BALL'
  | 'CROSS'
  | 'TACKLE'
  | 'INTERCEPTION'
  | 'CLEARANCE'
  | 'BLOCK'
  | 'FOUL'
  | 'FREE_KICK'
  | 'CORNER'
  | 'SHOT'
  | 'SHOT_ON_TARGET'
  | 'SHOT_OFF_TARGET'
  | 'SAVE'
  | 'GOAL'
  | 'YELLOW'
  | 'RED'
  | 'HALF_TIME'
  | 'FULL_TIME'
  | 'EXTRA_TIME_START'
  | 'PENALTY_SHOOTOUT'
  | 'PENALTY_KICK';

export type GoalType = 
  | 'open_play' 
  | 'counter' 
  | 'header' 
  | 'long_shot' 
  | 'set_piece' 
  | 'penalty' 
  | 'rebound' 
  | 'one_on_one';

export interface DetailedMatchEvent {
  id: string;
  minute: number;
  period: '1H' | '2H' | 'ET1' | 'ET2' | 'PEN';
  type: DetailedMatchEventType;
  teamId: string;
  teamName: string;
  playerId?: string;
  playerName?: string;
  secondaryPlayerId?: string;
  secondaryPlayerName?: string;
  description: string;
  goalType?: GoalType;
  shotOutcome?: 'goal' | 'saved' | 'blocked' | 'missed';
  penaltyResult?: 'scored' | 'saved' | 'missed';
}

// Backwards compatibility alias for MatchEvent
export type MatchEvent = DetailedMatchEvent;

export interface PlayerMatchStats {
  performanceId: string;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  position: Position;
  overall: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  tackles: number;
  interceptions: number;
  blocks: number;
  clearances: number;
  saves: number;
  goalsConceded: number;
  cleanSheet: boolean;
  yellowCards: number;
  redCards: number;
  rating: number; // 1.0 to 10.0
  isMotm?: boolean;
}

export interface TeamMatchStats {
  possession: number; // e.g. 58 (%)
  shots: number;
  shotsOnTarget: number;
  shotsOffTarget: number;
  blockedShots: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  offsides: number;
  tackles: number;
  interceptions: number;
  blocks: number;
  saves: number;
}

export interface Match {
  id: string;
  stage: string;
  groupName?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamFlag: string;
  awayTeamFlag: string;
  isUserHome?: boolean;
  isUserAway?: boolean;
  homeScore: number;
  awayScore: number;
  homePenalties?: number;
  awayPenalties?: number;
  completed: boolean;
  events: DetailedMatchEvent[];
  homeTeamStats?: TeamMatchStats;
  awayTeamStats?: TeamMatchStats;
  playerStats?: PlayerMatchStats[];
  manOfTheMatch?: PlayerMatchStats;
  winnerTeamId?: string;
  extraTimePlayed?: boolean;
}

export interface GroupStandings {
  teamId: string;
  teamName: string;
  teamFlag: string;
  isUserTeam?: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export interface Group {
  groupName: string; // "Group A", "Group B", etc.
  teams: string[]; // teamIds
  standings: GroupStandings[];
  matches: Match[];
}

export interface TournamentPlayerStats {
  performanceId: string;
  playerId: string;
  name: string;
  nationality: string;
  flag: string;
  position: Position;
  overall: number;
  teamId?: string;
  teamName: string;
  matchesPlayed: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  tackles: number;
  interceptions: number;
  blocks: number;
  saves: number;
  cleanSheets: number;
  goalsConceded: number;
  yellowCards: number;
  redCards: number;
  motmCount: number;
  ratingSum: number;
  ratingAverage: number;
}

export type TournamentStage = 
  | 'GROUP_STAGE' 
  | 'ROUND_OF_16' 
  | 'QUARTER_FINALS' 
  | 'SEMI_FINALS' 
  | 'THIRD_PLACE' 
  | 'FINAL' 
  | 'COMPLETED';

export type SimulationMode = 'DIRECT' | 'LIVE';

export interface TournamentState {
  editionId: string;
  userTeamId: string;
  groups: Group[];
  knockouts: {
    roundOf16: Match[];
    quarterFinals: Match[];
    semiFinals: Match[];
    thirdPlace: Match[];
    final: Match[];
  };
  currentStage: TournamentStage;
  currentMatchIndex: number;
  userSquad: UserSquad;
  stats: Map<string, TournamentPlayerStats>;
  history: Match[]; // Complete tournament match history
}

export interface LaligaTableEntry {
  rank: number;
  teamId: string;
  teamName: string;
  teamFlag: string;
  managerName?: string;
  formation?: FormationId;
  isUserTeam?: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  yellowCards: number;
  redCards: number;
  fairPlayPoints: number; // Yellow = 1, Red = 3
  form: ('W' | 'D' | 'L')[];
  zone?: 'CHAMPIONS_LEAGUE' | 'EUROPA_LEAGUE' | 'CONFERENCE_LEAGUE' | 'NONE' | 'RELEGATION';
}

export interface LaligaFixture extends Match {
  matchday: number; // 1 to 38
}

export interface LaligaMatchday {
  matchdayNumber: number;
  matches: LaligaFixture[];
  completed: boolean;
}

export interface LaligaAwards {
  pichichi?: TournamentPlayerStats;
  topAssists?: TournamentPlayerStats;
  zamora?: TournamentPlayerStats;
  playerOfSeason?: TournamentPlayerStats;
}

export interface LaligaState {
  seasonId: string; // e.g. '2026-27'
  userTeamId: string;
  userSquad: UserSquad;
  matchdays: LaligaMatchday[];
  currentMatchdayIndex: number; // 0-indexed (0 to 37)
  table: LaligaTableEntry[];
  stats: Map<string, TournamentPlayerStats>;
  history: LaligaFixture[];
  suspendedPlayerIds?: Record<string, number>; // playerId -> matchday number until which suspended (inclusive)
  isCompleted: boolean;
}
