import { 
  LaligaState, 
  LaligaMatchday, 
  LaligaFixture, 
  LaligaTableEntry, 
  LaligaAwards, 
  UserSquad, 
  HistoricalTeamEdition,
  TournamentPlayerStats 
} from '../types/football';
import { loadAllLaligaTeams } from '../data/jsonLoader';
import { buildBestPlayingXI } from './draftEngine';
import { calculateSquadRatings } from './ratingEngine';
import { calculateChemistry } from './chemistryEngine';
import { getUserTeamStats, simulateMatch, SimulatedTeamStats } from './matchSimulator';
import { sortLaligaTable } from './laligaTiebreaker';

import { FormationId } from '../types/football';

export const LALIGA_TEAM_INFO: Record<string, { manager: string; formation: FormationId }> = {
  'celta-vigo': { manager: 'Claudio Giráldez', formation: '3-4-3' },
  'real-betis': { manager: 'Manuel Pellegrini', formation: '4-3-3' },
  'villarreal': { manager: 'Iñigo Pérez', formation: '4-3-3' },
  'real-sociedad': { manager: 'Pellegrino Matarazzo', formation: '4-2-2-2' },
  'valencia-cf': { manager: 'Óscar Sánchez', formation: '4-4-2' },
  'getafe-cf': { manager: 'José Bordalás', formation: '4-4-2' },
  'ca-osasuna': { manager: 'Luis Miguel Ramis', formation: '4-4-2' },
  'rayo-vallecano': { manager: 'Beñat San José', formation: '4-2-2-2' },
  'deportivo-alavés': { manager: 'Quique Sánchez Flores', formation: '3-5-2' },
  'rcd-espanyol': { manager: 'Manolo González', formation: '5-3-2' },
  'elche-cf': { manager: 'Martín Anselmi', formation: '4-3-3' },
  'levante-ud': { manager: 'Luís Castro', formation: '4-2-3-1' },
  'málaga-cf': { manager: 'Juanfran Funes', formation: '4-3-3' },
  'racing-santander': { manager: 'José Alberto López', formation: '4-2-3-1' },
  'deportivo-la-coruña': { manager: 'Antonio Hidalgo', formation: '4-2-3-1' },
  'fc-barcelona': { manager: 'Hansi Flick', formation: '4-3-3' },
  'real-madrid': { manager: 'José Mourinho', formation: '4-4-2' },
  'atlético-madrid': { manager: 'Diego Simeone', formation: '5-3-2' },
  'athletic-bilbao': { manager: 'Edin Terzić', formation: '4-2-3-1' },
  'sevilla-fc': { manager: 'Luis García Plaza', formation: '4-2-3-1' },
};

export function getTeamInfo(teamId: string, teamName: string): { manager: string; formation: FormationId } {
  const idLower = teamId.toLowerCase();
  const nameLower = teamName.toLowerCase();

  if (idLower.includes('celta') || nameLower.includes('celta')) return { manager: 'Claudio Giráldez', formation: '3-4-3' };
  if (idLower.includes('betis') || nameLower.includes('betis')) return { manager: 'Manuel Pellegrini', formation: '4-3-3' };
  if (idLower.includes('villarreal') || nameLower.includes('villarreal')) return { manager: 'Iñigo Pérez', formation: '4-3-3' };
  if (idLower.includes('sociedad') || nameLower.includes('sociedad')) return { manager: 'Pellegrino Matarazzo', formation: '4-2-2-2' };
  if (idLower.includes('valencia') || nameLower.includes('valencia')) return { manager: 'Óscar Sánchez', formation: '4-4-2' };
  if (idLower.includes('getafe') || nameLower.includes('getafe')) return { manager: 'José Bordalás', formation: '4-4-2' };
  if (idLower.includes('osasuna') || nameLower.includes('osasuna')) return { manager: 'Luis Miguel Ramis', formation: '4-4-2' };
  if (idLower.includes('rayo') || nameLower.includes('rayo')) return { manager: 'Beñat San José', formation: '4-2-2-2' };
  if (idLower.includes('alav') || nameLower.includes('alav')) return { manager: 'Quique Sánchez Flores', formation: '3-5-2' };
  if (idLower.includes('espanyol') || nameLower.includes('espanyol')) return { manager: 'Manolo González', formation: '5-3-2' };
  if (idLower.includes('elche') || nameLower.includes('elche')) return { manager: 'Martín Anselmi', formation: '4-3-3' };
  if (idLower.includes('levante') || nameLower.includes('levante')) return { manager: 'Luís Castro', formation: '4-2-3-1' };
  if (idLower.includes('mál') || idLower.includes('malaga') || nameLower.includes('málaga') || nameLower.includes('malaga')) return { manager: 'Juanfran Funes', formation: '4-3-3' };
  if (idLower.includes('racing') || nameLower.includes('racing')) return { manager: 'José Alberto López', formation: '4-2-3-1' };
  if (idLower.includes('coru') || nameLower.includes('coru') || nameLower.includes('depor')) return { manager: 'Antonio Hidalgo', formation: '4-2-3-1' };
  if (idLower.includes('barcelona') || nameLower.includes('barcelona')) return { manager: 'Hansi Flick', formation: '4-3-3' };
  if (idLower.includes('real-madrid') || nameLower.includes('real madrid')) return { manager: 'José Mourinho', formation: '4-4-2' };
  if (idLower.includes('atlético') || idLower.includes('atletico') || nameLower.includes('atlético')) return { manager: 'Diego Simeone', formation: '5-3-2' };
  if (idLower.includes('athletic') || nameLower.includes('athletic')) return { manager: 'Edin Terzić', formation: '4-2-3-1' };
  if (idLower.includes('sevilla') || nameLower.includes('sevilla')) return { manager: 'Luis García Plaza', formation: '4-2-3-1' };

  return { manager: 'Head Coach', formation: '4-3-3' };
}

export function getLaligaTeamStats(
  teamId: string,
  userSquad: UserSquad,
  suspendedPlayerIds: Record<string, number> = {},
  currentMatchdayNumber: number = 1
): SimulatedTeamStats {
  if (teamId === 'user-xi') {
    const stats = getUserTeamStats(userSquad);
    const suspendedSet = new Set(
      Object.keys(suspendedPlayerIds).filter(pId => suspendedPlayerIds[pId] >= currentMatchdayNumber)
    );
    if (suspendedSet.size > 0) {
      stats.squad = stats.squad.filter(p => !suspendedSet.has(p.id));
    }
    return stats;
  }

  const datasetTeams = loadAllLaligaTeams();
  const opp = datasetTeams.find(t => t.id === teamId || t.teamId === teamId);

  if (opp) {
    const info = getTeamInfo(opp.teamId, opp.teamName);
    const suspendedSet = new Set(
      Object.keys(suspendedPlayerIds).filter(pId => suspendedPlayerIds[pId] >= currentMatchdayNumber)
    );

    const bestXISlots = buildBestPlayingXI(opp, info.formation, suspendedSet);
    const ratings = calculateSquadRatings(bestXISlots);
    const chemistry = calculateChemistry(bestXISlots);
    const xiSquad = bestXISlots
      .map(s => s.assignedPerformance)
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    return {
      id: opp.id,
      name: opp.teamName,
      flag: opp.flag,
      managerName: info.manager,
      formation: info.formation,
      attack: ratings.attack,
      midfield: ratings.midfield,
      defense: ratings.defense,
      goalkeeping: ratings.goalkeeping,
      overall: ratings.overall,
      chemistry,
      squad: xiSquad,
    };
  }

  return {
    id: teamId,
    name: teamId,
    flag: '',
    managerName: 'Head Coach',
    formation: '4-3-3',
    attack: 80,
    midfield: 80,
    defense: 80,
    goalkeeping: 80,
    overall: 80,
    chemistry: 80,
    squad: [],
  };
}

/**
 * Double Round-Robin Fixture Generator (Berger Algorithm)
 * For N = 20 teams, generates 38 Matchdays × 10 Matches = 380 total matches.
 * Matchdays 1-19: First Leg
 * Matchdays 20-38: Second Leg (Home & Away reversed)
 */
export function generateLaligaFixtures(
  teams: { id: string; name: string; flag: string }[]
): LaligaMatchday[] {
  let list = [...teams];
  if (list.length % 2 !== 0) {
    list.push({ id: '__BYE__', name: 'BYE', flag: '' });
  }

  const n = list.length;
  const roundsCount = n - 1;
  const matchesPerRound = n / 2;

  // Fixed team indices array for Berger rotation
  const teamIndices = Array.from({ length: n }, (_, i) => i);

  const firstLegRounds: { home: number; away: number }[][] = [];

  for (let r = 0; r < roundsCount; r++) {
    const roundMatches: { home: number; away: number }[] = [];

    for (let m = 0; m < matchesPerRound; m++) {
      const homeIdx = teamIndices[m];
      const awayIdx = teamIndices[n - 1 - m];

      // Alternate home/away for the fixed team (index 0) to balance home/away streaks
      if (m === 0 && r % 2 === 1) {
        roundMatches.push({ home: awayIdx, away: homeIdx });
      } else {
        roundMatches.push({ home: homeIdx, away: awayIdx });
      }
    }

    // Filter out matches involving the BYE team
    const realMatches = roundMatches.filter(
      m => list[m.home].id !== '__BYE__' && list[m.away].id !== '__BYE__'
    );

    firstLegRounds.push(realMatches);

    // Rotate indices (keep index 0 fixed, rotate 1..N-1 right)
    const last = teamIndices.pop()!;
    teamIndices.splice(1, 0, last);
  }

  const matchdays: LaligaMatchday[] = [];

  // 1st Leg
  for (let r = 0; r < roundsCount; r++) {
    const mdNumber = r + 1;
    const matches: LaligaFixture[] = firstLegRounds[r].map((m, idx) => {
      const homeTeam = list[m.home];
      const awayTeam = list[m.away];

      return {
        id: `ll-match-${mdNumber}-${idx}-${homeTeam.id}-vs-${awayTeam.id}`,
        stage: `Matchday ${mdNumber}`,
        matchday: mdNumber,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeTeamName: homeTeam.name,
        awayTeamName: awayTeam.name,
        homeTeamFlag: homeTeam.flag,
        awayTeamFlag: awayTeam.flag,
        isUserHome: homeTeam.id === 'user-xi',
        isUserAway: awayTeam.id === 'user-xi',
        homeScore: 0,
        awayScore: 0,
        completed: false,
        events: [],
      };
    });

    matchdays.push({
      matchdayNumber: mdNumber,
      matches,
      completed: false,
    });
  }

  // 2nd Leg (Reverse Home & Away)
  for (let r = 0; r < roundsCount; r++) {
    const mdNumber = roundsCount + r + 1;
    const matches: LaligaFixture[] = firstLegRounds[r].map((m, idx) => {
      const homeTeam = list[m.away];
      const awayTeam = list[m.home];

      return {
        id: `ll-match-${mdNumber}-${idx}-${homeTeam.id}-vs-${awayTeam.id}`,
        stage: `Matchday ${mdNumber}`,
        matchday: mdNumber,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeTeamName: homeTeam.name,
        awayTeamName: awayTeam.name,
        homeTeamFlag: homeTeam.flag,
        awayTeamFlag: awayTeam.flag,
        isUserHome: homeTeam.id === 'user-xi',
        isUserAway: awayTeam.id === 'user-xi',
        homeScore: 0,
        awayScore: 0,
        completed: false,
        events: [],
      };
    });

    matchdays.push({
      matchdayNumber: mdNumber,
      matches,
      completed: false,
    });
  }

  return matchdays;
}

export function initializeLaligaSeason(
  seasonId: string,
  userSquad: UserSquad
): LaligaState {
  // Load all authentic 20 La Liga teams from dataset
  const datasetTeams = loadAllLaligaTeams();

  // Include ALL 20 dataset opponents so user's Fantasy XI makes 21 teams total
  const selectedOpponents = datasetTeams;

  // Construct 21 team list: User's Fantasy XI + 20 La Liga Opponents
  const leagueTeams = [
    {
      id: 'user-xi',
      name: userSquad.userTeamName || 'FANTASY XI',
      flag: userSquad.userTeamFlag || '',
    },
    ...selectedOpponents.map(opp => ({
      id: opp.id,
      name: opp.teamName,
      flag: opp.flag,
    })),
  ];

  // Generate Matchdays
  const matchdays = generateLaligaFixtures(leagueTeams);

  // Initialize initial 21-team League Table
  const initialEntries: LaligaTableEntry[] = leagueTeams.map((t, idx) => {
    const info = t.id === 'user-xi'
      ? { manager: 'User Manager', formation: userSquad.formation }
      : getTeamInfo(t.id, t.name);

    return {
      rank: idx + 1,
      teamId: t.id,
      teamName: t.name,
      teamFlag: t.flag,
      managerName: info.manager,
      formation: info.formation,
      isUserTeam: t.id === 'user-xi',
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
      yellowCards: 0,
      redCards: 0,
      fairPlayPoints: 0,
      form: [],
      zone: idx < 4 ? 'CHAMPIONS_LEAGUE' : idx === 4 ? 'EUROPA_LEAGUE' : idx === 5 ? 'CONFERENCE_LEAGUE' : idx >= 17 ? 'RELEGATION' : 'NONE',
    };
  });

  const initialSortedTable = sortLaligaTable(initialEntries, []);

  return {
    seasonId,
    userTeamId: 'user-xi',
    userSquad,
    matchdays,
    currentMatchdayIndex: 0,
    table: initialSortedTable,
    stats: new Map<string, TournamentPlayerStats>(),
    history: [],
    suspendedPlayerIds: {},
    isCompleted: false,
  };
}

export function simulateLaligaFixture(
  state: LaligaState,
  matchdayIndex: number,
  matchIndex: number
): LaligaState {
  const currentMatchday = state.matchdays[matchdayIndex];
  if (!currentMatchday) return state;

  const fixture = currentMatchday.matches[matchIndex];
  if (!fixture || fixture.completed) return state;

  const homeStats = getLaligaTeamStats(
    fixture.homeTeamId,
    state.userSquad,
    state.suspendedPlayerIds,
    currentMatchday.matchdayNumber
  );
  const awayStats = getLaligaTeamStats(
    fixture.awayTeamId,
    state.userSquad,
    state.suspendedPlayerIds,
    currentMatchday.matchdayNumber
  );

  // Simulate match with Home Advantage (isKnockout = false)
  const simulatedMatch = simulateMatch(homeStats, awayStats, fixture.stage, false);

  const completedFixture: LaligaFixture = {
    ...fixture,
    ...simulatedMatch,
    matchday: currentMatchday.matchdayNumber,
    completed: true,
  };

  const newHistory = [...state.history, completedFixture];
  const newStats = new Map(state.stats);
  updateLaligaPlayerStats(newStats, completedFixture);

  // Track red card 1-match suspensions
  const newSuspendedPlayerIds = { ...(state.suspendedPlayerIds || {}) };
  if (simulatedMatch.playerStats) {
    simulatedMatch.playerStats.forEach(p => {
      if (p.redCards > 0) {
        // Suspended for the next matchday (currentMatchdayNumber + 1)
        newSuspendedPlayerIds[p.playerId] = currentMatchday.matchdayNumber + 1;
      }
    });
  }

  // Update matchday matches array immutably
  const newMatches = currentMatchday.matches.map((m, idx) =>
    idx === matchIndex ? completedFixture : m
  );

  const newMatchdays = state.matchdays.map((md, idx) =>
    idx === matchdayIndex
      ? {
          ...md,
          matches: newMatches,
          completed: newMatches.every(m => m.completed),
        }
      : md
  );

  const isCompleted = newMatchdays.every(md => md.completed);

  // Create intermediate state object
  const intermediateState: LaligaState = {
    ...state,
    matchdays: newMatchdays,
    history: newHistory,
    stats: newStats,
    suspendedPlayerIds: newSuspendedPlayerIds,
    isCompleted,
  };

  // Recalculate table standings immutably
  const newTable = recalculateLaligaTable(intermediateState);

  return {
    ...intermediateState,
    table: newTable,
  };
}

export function simulateLaligaMatchday(
  state: LaligaState,
  matchdayIndex: number
): LaligaState {
  let newState = state;
  const matchday = newState.matchdays[matchdayIndex];

  if (!matchday) return state;

  for (let m = 0; m < matchday.matches.length; m++) {
    if (!matchday.matches[m].completed) {
      newState = simulateLaligaFixture(newState, matchdayIndex, m);
    }
  }

  return newState;
}

function recalculateLaligaTable(state: LaligaState): LaligaTableEntry[] {
  const teamEntriesMap = new Map<string, LaligaTableEntry>();

  // Extract unique teams from initial table
  for (const entry of state.table) {
    teamEntriesMap.set(entry.teamId, {
      ...entry,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
      yellowCards: 0,
      redCards: 0,
      fairPlayPoints: 0,
      form: [],
    });
  }

  // Process all completed matches from history
  for (const match of state.history) {
    const home = teamEntriesMap.get(match.homeTeamId);
    const away = teamEntriesMap.get(match.awayTeamId);

    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;

    home.gf += match.homeScore;
    home.ga += match.awayScore;
    home.gd = home.gf - home.ga;

    away.gf += match.awayScore;
    away.ga += match.homeScore;
    away.gd = away.gf - away.ga;

    // Yellow / Red Cards & Fair Play Points
    const homeYellows = match.homeTeamStats?.yellowCards || 0;
    const homeReds = match.homeTeamStats?.redCards || 0;
    home.yellowCards += homeYellows;
    home.redCards += homeReds;
    home.fairPlayPoints += homeYellows * 1 + homeReds * 3;

    const awayYellows = match.awayTeamStats?.yellowCards || 0;
    const awayReds = match.awayTeamStats?.redCards || 0;
    away.yellowCards += awayYellows;
    away.redCards += awayReds;
    away.fairPlayPoints += awayYellows * 1 + awayReds * 3;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      home.points += 3;
      home.form.unshift('W');
      away.lost += 1;
      away.form.unshift('L');
    } else if (match.awayScore > match.homeScore) {
      away.won += 1;
      away.points += 3;
      away.form.unshift('W');
      home.lost += 1;
      home.form.unshift('L');
    } else {
      home.drawn += 1;
      home.points += 1;
      home.form.unshift('D');
      away.drawn += 1;
      away.points += 1;
      away.form.unshift('D');
    }

    home.form = home.form.slice(0, 5);
    away.form = away.form.slice(0, 5);
  }

  const entriesArray = Array.from(teamEntriesMap.values());
  return sortLaligaTable(entriesArray, state.history);
}

function updateLaligaPlayerStats(
  statsMap: Map<string, TournamentPlayerStats>,
  match: LaligaFixture
) {
  if (!match.playerStats) return;

  match.playerStats.forEach(p => {
    const key = `${p.teamId}-${p.performanceId}`;
    const flag = '';

    const existing = statsMap.get(key) || {
      performanceId: p.performanceId,
      playerId: p.playerId,
      name: p.playerName,
      nationality: p.teamId,
      flag,
      position: p.position,
      overall: p.overall,
      teamName: p.teamName,
      matchesPlayed: 0,
      minutesPlayed: 0,
      goals: 0,
      assists: 0,
      shots: 0,
      shotsOnTarget: 0,
      tackles: 0,
      interceptions: 0,
      blocks: 0,
      saves: 0,
      cleanSheets: 0,
      goalsConceded: 0,
      yellowCards: 0,
      redCards: 0,
      motmCount: 0,
      ratingSum: 0,
      ratingAverage: 0,
    };

    existing.matchesPlayed += 1;
    existing.minutesPlayed += p.minutesPlayed;
    existing.goals += p.goals;
    existing.assists += p.assists;
    existing.shots += p.shots;
    existing.shotsOnTarget += p.shotsOnTarget;
    existing.tackles += p.tackles;
    existing.interceptions += p.interceptions;
    existing.blocks += p.blocks;
    existing.saves += p.saves;
    if (p.cleanSheet) existing.cleanSheets += 1;
    existing.goalsConceded += p.goalsConceded;
    existing.yellowCards += p.yellowCards;
    existing.redCards += p.redCards;
    if (p.isMotm) existing.motmCount += 1;
    existing.ratingSum += p.rating;
    existing.ratingAverage = Math.round((existing.ratingSum / existing.matchesPlayed) * 100) / 100;

    statsMap.set(key, existing);
  });
}

export function calculateLaligaAwards(statsMap: Map<string, TournamentPlayerStats>): LaligaAwards {
  const allStats = Array.from(statsMap.values());

  // Pichichi (Top Scorer): Goals DESC, Assists DESC, Minutes ASC
  const pichichiList = [...allStats]
    .filter(p => p.goals > 0)
    .sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.assists !== a.assists) return b.assists - a.assists;
      return a.minutesPlayed - b.minutesPlayed;
    });

  // Top Assists: Assists DESC, Goals DESC, Minutes ASC
  const assistsList = [...allStats]
    .filter(p => p.assists > 0)
    .sort((a, b) => {
      if (b.assists !== a.assists) return b.assists - a.assists;
      if (b.goals !== a.goals) return b.goals - a.goals;
      return a.minutesPlayed - b.minutesPlayed;
    });

  // Zamora Trophy (Best Goalkeeper): Clean Sheets DESC, Saves DESC, Goals Conceded ASC
  const zamoraList = [...allStats]
    .filter(p => p.position === 'GK')
    .sort((a, b) => {
      if (b.cleanSheets !== a.cleanSheets) return b.cleanSheets - a.cleanSheets;
      if (b.saves !== a.saves) return b.saves - a.saves;
      return a.goalsConceded - b.goalsConceded;
    });

  // Player of the Season: Weighted formula (Avg Rating * 10 + Goals * 2 + Assists * 1.5 + MOTM * 3)
  const playerOfSeasonList = [...allStats]
    .sort((a, b) => {
      const scoreA = (a.ratingAverage * 10) + (a.goals * 2) + (a.assists * 1.5) + (a.motmCount * 3);
      const scoreB = (b.ratingAverage * 10) + (b.goals * 2) + (b.assists * 1.5) + (b.motmCount * 3);
      return scoreB - scoreA;
    });

  return {
    pichichi: pichichiList[0],
    topAssists: assistsList[0],
    zamora: zamoraList[0],
    playerOfSeason: playerOfSeasonList[0],
  };
}
