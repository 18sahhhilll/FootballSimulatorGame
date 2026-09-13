import { 
  TournamentState, 
  UserSquad, 
  Group, 
  GroupStandings, 
  Match, 
  TournamentPlayerStats,
  HistoricalTeamEdition 
} from '../types/football';
import { loadAllJsonHistoricalTeams } from '../data/jsonLoader';
import { buildBestPlayingXI } from './draftEngine';
import { calculateSquadRatings } from './ratingEngine';
import { calculateChemistry } from './chemistryEngine';
import { getUserTeamStats, simulateMatch, SimulatedTeamStats } from './matchSimulator';

// Store generated opponent team stats by team ID for fast lookup
const opponentStatsMap = new Map<string, SimulatedTeamStats>();

export function initializeTournament(editionId: string, userSquad: UserSquad): TournamentState {
  opponentStatsMap.clear();

  // Load all authentic historical team editions from JSON dataset (177 editions)
  const allJsonTeams = loadAllJsonHistoricalTeams();
  
  // Group all dataset editions by country key (e.g. 'italy', 'brazil', 'germany')
  const countryMap = new Map<string, HistoricalTeamEdition[]>();
  for (const team of allJsonTeams) {
    const key = team.teamId.toLowerCase();
    if (!countryMap.has(key)) {
      countryMap.set(key, []);
    }
    countryMap.get(key)!.push(team);
  }

  // Shuffle available unique country keys
  const availableCountryKeys = Array.from(countryMap.keys()).sort(() => Math.random() - 0.5);

  // Pick 15 UNIQUE countries and exactly 1 edition per country
  const selectedOpponents: HistoricalTeamEdition[] = [];
  const usedCountries = new Set<string>();

  for (const countryKey of availableCountryKeys) {
    if (selectedOpponents.length >= 15) break;
    if (usedCountries.has(countryKey)) continue;

    const editions = countryMap.get(countryKey)!;
    // Pick ONE random edition for this country
    const chosenEdition = editions[Math.floor(Math.random() * editions.length)];
    selectedOpponents.push(chosenEdition);
    usedCountries.add(countryKey);
  }

  // Build Best Playing XI and SimulatedTeamStats for each selected opponent
  const opponentTeamIds: string[] = [];
  selectedOpponents.forEach(opp => {
    const bestXISlots = buildBestPlayingXI(opp, userSquad.formation || '4-3-3');
    const ratings = calculateSquadRatings(bestXISlots);
    const chemistry = calculateChemistry(bestXISlots);
    const xiSquad = bestXISlots
      .map(s => s.assignedPerformance)
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    const stats: SimulatedTeamStats = {
      id: opp.id,
      name: `${opp.teamName} ${opp.year}`,
      flag: opp.flag,
      attack: ratings.attack,
      midfield: ratings.midfield,
      defense: ratings.defense,
      goalkeeping: ratings.goalkeeping,
      overall: ratings.overall,
      chemistry,
      squad: xiSquad,
    };

    opponentStatsMap.set(opp.id, stats);
    opponentTeamIds.push(opp.id);
  });

  const groupNames = ['Group A', 'Group B', 'Group C', 'Group D'];
  const groups: Group[] = [];

  for (let i = 0; i < 4; i++) {
    let groupTeams: string[] = [];
    if (i === 0) {
      groupTeams = ['user-xi', opponentTeamIds[0], opponentTeamIds[1], opponentTeamIds[2]];
    } else {
      const startIdx = 3 + (i - 1) * 4;
      groupTeams = [
        opponentTeamIds[startIdx],
        opponentTeamIds[startIdx + 1],
        opponentTeamIds[startIdx + 2],
        opponentTeamIds[startIdx + 3],
      ];
    }

    const standings: GroupStandings[] = groupTeams.map(tid => {
      const isUser = tid === 'user-xi';
      const oppStats = opponentStatsMap.get(tid);

      const teamName = isUser ? (userSquad.userTeamName || 'YOUR XI') : (oppStats ? oppStats.name : tid);
      const teamFlag = isUser ? (userSquad.userTeamFlag || '⭐') : (oppStats ? oppStats.flag : '⚽');

      return {
        teamId: tid,
        teamName,
        teamFlag,
        isUserTeam: isUser,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
      };
    });

    // Schedule 6 matches per group (Round Robin)
    const matches: Match[] = [
      createScheduledMatch(groupNames[i], groupTeams[0], groupTeams[1], userSquad),
      createScheduledMatch(groupNames[i], groupTeams[2], groupTeams[3], userSquad),
      createScheduledMatch(groupNames[i], groupTeams[0], groupTeams[2], userSquad),
      createScheduledMatch(groupNames[i], groupTeams[1], groupTeams[3], userSquad),
      createScheduledMatch(groupNames[i], groupTeams[0], groupTeams[3], userSquad),
      createScheduledMatch(groupNames[i], groupTeams[1], groupTeams[2], userSquad),
    ];

    groups.push({
      groupName: groupNames[i],
      teams: groupTeams,
      standings,
      matches,
    });
  }

  return {
    editionId,
    userTeamId: 'user-xi',
    groups,
    knockouts: {
      roundOf16: [],
      quarterFinals: [],
      semiFinals: [],
      thirdPlace: [],
      final: [],
    },
    currentStage: 'GROUP_STAGE',
    currentMatchIndex: 0,
    userSquad,
    stats: new Map<string, TournamentPlayerStats>(),
    history: [],
  };
}

export function getTeamSimStats(teamId: string, userSquad: UserSquad): SimulatedTeamStats {
  if (teamId === 'user-xi') {
    return getUserTeamStats(userSquad);
  }
  const opp = opponentStatsMap.get(teamId);
  if (opp) return opp;

  return {
    id: teamId,
    name: teamId,
    flag: '⚽',
    attack: 80,
    midfield: 80,
    defense: 80,
    goalkeeping: 80,
    overall: 80,
    chemistry: 80,
    squad: [],
  };
}

function createScheduledMatch(groupName: string, team1Id: string, team2Id: string, userSquad: UserSquad): Match {
  const isUser1 = team1Id === 'user-xi';
  const isUser2 = team2Id === 'user-xi';

  const t1 = getTeamSimStats(team1Id, userSquad);
  const t2 = getTeamSimStats(team2Id, userSquad);

  return {
    id: `gmatch-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    stage: 'Group Stage',
    groupName,
    homeTeamId: team1Id,
    awayTeamId: team2Id,
    homeTeamName: t1.name,
    awayTeamName: t2.name,
    homeTeamFlag: t1.flag,
    awayTeamFlag: t2.flag,
    isUserHome: isUser1,
    isUserAway: isUser2,
    homeScore: 0,
    awayScore: 0,
    completed: false,
    events: [],
  };
}

export function simulateGroupStageMatch(
  state: TournamentState,
  groupIndex: number,
  matchIndex: number
): TournamentState {
  const newState = { ...state };
  const group = newState.groups[groupIndex];
  const match = group.matches[matchIndex];

  if (match.completed) return newState;

  const homeStats = getTeamSimStats(match.homeTeamId, state.userSquad);
  const awayStats = getTeamSimStats(match.awayTeamId, state.userSquad);

  const simulated = simulateMatch(homeStats, awayStats, 'Group Stage', false);

  group.matches[matchIndex] = simulated;
  newState.history = [...newState.history, simulated];

  updateGroupStandings(group.standings, simulated);
  updateTournamentPlayerStats(newState.stats, simulated);

  const allGroupMatchesDone = newState.groups.every(g => g.matches.every(m => m.completed));
  if (allGroupMatchesDone) {
    newState.currentStage = 'QUARTER_FINALS';
    setupQuarterFinals(newState);
  }

  return newState;
}

export function simulateAllGroupMatches(state: TournamentState): TournamentState {
  let newState = { ...state };
  for (let g = 0; g < newState.groups.length; g++) {
    for (let m = 0; m < newState.groups[g].matches.length; m++) {
      newState = simulateGroupStageMatch(newState, g, m);
    }
  }
  return newState;
}

function updateGroupStandings(standings: GroupStandings[], match: Match) {
  const home = standings.find(s => s.teamId === match.homeTeamId);
  const away = standings.find(s => s.teamId === match.awayTeamId);

  if (!home || !away) return;

  home.played += 1;
  away.played += 1;

  home.gf += match.homeScore;
  home.ga += match.awayScore;
  home.gd = home.gf - home.ga;

  away.gf += match.awayScore;
  away.ga += match.homeScore;
  away.gd = away.gf - away.ga;

  if (match.homeScore > match.awayScore) {
    home.won += 1;
    home.points += 3;
    away.lost += 1;
  } else if (match.awayScore > match.homeScore) {
    away.won += 1;
    away.points += 3;
    home.lost += 1;
  } else {
    home.drawn += 1;
    home.points += 1;
    away.drawn += 1;
    away.points += 1;
  }

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });
}

function setupQuarterFinals(state: TournamentState) {
  const qfMatches: Match[] = [];

  const a1 = state.groups[0].standings[0];
  const a2 = state.groups[0].standings[1];
  const b1 = state.groups[1].standings[0];
  const b2 = state.groups[1].standings[1];
  const c1 = state.groups[2].standings[0];
  const c2 = state.groups[2].standings[1];
  const d1 = state.groups[3].standings[0];
  const d2 = state.groups[3].standings[1];

  qfMatches.push(createKnockoutMatch('Quarter Final 1', a1, b2, state.userSquad));
  qfMatches.push(createKnockoutMatch('Quarter Final 2', c1, d2, state.userSquad));
  qfMatches.push(createKnockoutMatch('Quarter Final 3', b1, a2, state.userSquad));
  qfMatches.push(createKnockoutMatch('Quarter Final 4', d1, c2, state.userSquad));

  state.knockouts.quarterFinals = qfMatches;
}

function createKnockoutMatch(stageName: string, t1: GroupStandings, t2: GroupStandings, userSquad: UserSquad): Match {
  return {
    id: `qmatch-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    stage: stageName,
    homeTeamId: t1.teamId,
    awayTeamId: t2.teamId,
    homeTeamName: t1.teamName,
    awayTeamName: t2.teamName,
    homeTeamFlag: t1.teamFlag,
    awayTeamFlag: t2.teamFlag,
    isUserHome: t1.teamId === 'user-xi',
    isUserAway: t2.teamId === 'user-xi',
    homeScore: 0,
    awayScore: 0,
    completed: false,
    events: [],
  };
}

export function simulateKnockoutMatch(
  state: TournamentState,
  stage: 'quarterFinals' | 'semiFinals' | 'thirdPlace' | 'final',
  matchIndex: number
): TournamentState {
  const newState = { ...state };
  const matches = newState.knockouts[stage];
  const match = matches[matchIndex];

  if (match.completed) return newState;

  const homeStats = getTeamSimStats(match.homeTeamId, state.userSquad);
  const awayStats = getTeamSimStats(match.awayTeamId, state.userSquad);

  const simulated = simulateMatch(homeStats, awayStats, match.stage, true);
  matches[matchIndex] = simulated;
  newState.history = [...newState.history, simulated];

  updateTournamentPlayerStats(newState.stats, simulated);

  if (stage === 'quarterFinals' && matches.every(m => m.completed)) {
    newState.currentStage = 'SEMI_FINALS';
    setupSemiFinals(newState);
  } else if (stage === 'semiFinals' && matches.every(m => m.completed)) {
    newState.currentStage = 'FINAL';
    setupFinals(newState);
  } else if (stage === 'final' && matches.every(m => m.completed)) {
    newState.currentStage = 'COMPLETED';
  }

  return newState;
}

export function simulateAllKnockoutMatches(
  state: TournamentState,
  stage: 'quarterFinals' | 'semiFinals'
): TournamentState {
  let newState = { ...state };
  const matches = newState.knockouts[stage];
  for (let m = 0; m < matches.length; m++) {
    newState = simulateKnockoutMatch(newState, stage, m);
  }
  return newState;
}

function setupSemiFinals(state: TournamentState) {
  const qf = state.knockouts.quarterFinals;
  const getWinner = (m: Match): GroupStandings => {
    const isHomeWinner = m.homeScore > m.awayScore || (m.homePenalties !== undefined && m.homePenalties > (m.awayPenalties || 0));
    return {
      teamId: isHomeWinner ? m.homeTeamId : m.awayTeamId,
      teamName: isHomeWinner ? m.homeTeamName : m.awayTeamName,
      teamFlag: isHomeWinner ? m.homeTeamFlag : m.awayTeamFlag,
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0
    };
  };

  const sf1 = createKnockoutMatch('Semi Final 1', getWinner(qf[0]), getWinner(qf[1]), state.userSquad);
  const sf2 = createKnockoutMatch('Semi Final 2', getWinner(qf[2]), getWinner(qf[3]), state.userSquad);

  state.knockouts.semiFinals = [sf1, sf2];
}

function setupFinals(state: TournamentState) {
  const sf = state.knockouts.semiFinals;
  const getWinner = (m: Match): GroupStandings => {
    const isHomeWinner = m.homeScore > m.awayScore || (m.homePenalties !== undefined && m.homePenalties > (m.awayPenalties || 0));
    return {
      teamId: isHomeWinner ? m.homeTeamId : m.awayTeamId,
      teamName: isHomeWinner ? m.homeTeamName : m.awayTeamName,
      teamFlag: isHomeWinner ? m.homeTeamFlag : m.awayTeamFlag,
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0
    };
  };
  const getLoser = (m: Match): GroupStandings => {
    const isHomeWinner = m.homeScore > m.awayScore || (m.homePenalties !== undefined && m.homePenalties > (m.awayPenalties || 0));
    return {
      teamId: !isHomeWinner ? m.homeTeamId : m.awayTeamId,
      teamName: !isHomeWinner ? m.homeTeamName : m.awayTeamName,
      teamFlag: !isHomeWinner ? m.homeTeamFlag : m.awayTeamFlag,
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0
    };
  };

  const finalMatch = createKnockoutMatch('World Cup Final 🏆', getWinner(sf[0]), getWinner(sf[1]), state.userSquad);
  const thirdPlaceMatch = createKnockoutMatch('3rd Place Match 🥉', getLoser(sf[0]), getLoser(sf[1]), state.userSquad);

  state.knockouts.final = [finalMatch];
  state.knockouts.thirdPlace = [thirdPlaceMatch];
}

function updateTournamentPlayerStats(
  statsMap: Map<string, TournamentPlayerStats>,
  match: Match
) {
  if (!match.playerStats) return;

  match.playerStats.forEach(p => {
    const key = `${p.teamId}-${p.performanceId}`;
    const flag = p.teamId === 'user-xi' ? '⭐' : (opponentStatsMap.get(p.teamId)?.flag || '⚽');

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

export function calculateLiveAwardRankings(statsMap: Map<string, TournamentPlayerStats>) {
  const allStats = Array.from(statsMap.values());

  // Golden Ball Ranking: (Avg Rating * 10) + Goals * 2 + Assists * 1.5 + MOTM * 3 + CleanSheets * 1
  const goldenBall = [...allStats]
    .sort((a, b) => {
      const scoreA = (a.ratingAverage * 10) + (a.goals * 2) + (a.assists * 1.5) + (a.motmCount * 3) + (a.cleanSheets * 1);
      const scoreB = (b.ratingAverage * 10) + (b.goals * 2) + (b.assists * 1.5) + (b.motmCount * 3) + (b.cleanSheets * 1);
      return scoreB - scoreA;
    });

  // Golden Boot Ranking: Goals DESC, Assists DESC, Minutes Played ASC
  const goldenBoot = [...allStats]
    .filter(p => p.goals > 0 || p.assists > 0)
    .sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.assists !== a.assists) return b.assists - a.assists;
      return a.minutesPlayed - b.minutesPlayed;
    });

  // Golden Glove Ranking: Position GK, Clean Sheets DESC, Saves DESC, Rating Avg DESC
  const goldenGlove = [...allStats]
    .filter(p => p.position === 'GK')
    .sort((a, b) => {
      if (b.cleanSheets !== a.cleanSheets) return b.cleanSheets - a.cleanSheets;
      if (b.saves !== a.saves) return b.saves - a.saves;
      return b.ratingAverage - a.ratingAverage;
    });

  return {
    goldenBall,
    goldenBoot,
    goldenGlove,
  };
}
