import { 
  Match, 
  DetailedMatchEvent, 
  UserSquad, 
  PlayerEditionPerformance, 
  TeamMatchStats, 
  PlayerMatchStats,
  GoalType 
} from '../types/football';
import { PLAYERS } from '../data/players';
import { formatPlayerName } from '../utils/formatters';

export interface SimulatedTeamStats {
  id: string;
  name: string;
  flag: string;
  attack: number;
  midfield: number;
  defense: number;
  goalkeeping: number;
  overall: number;
  chemistry: number;
  squad: PlayerEditionPerformance[];
}

export function getUserTeamStats(userSquad: UserSquad): SimulatedTeamStats {
  const squadPerformances: PlayerEditionPerformance[] = userSquad.slots
    .map(s => s.assignedPerformance)
    .filter((p): p is PlayerEditionPerformance => p !== undefined);

  return {
    id: 'user-xi',
    name: userSquad.userTeamName || 'YOUR XI',
    flag: userSquad.userTeamFlag || '⭐',
    attack: userSquad.attack,
    midfield: userSquad.midfield,
    defense: userSquad.defense,
    goalkeeping: userSquad.goalkeeping,
    overall: userSquad.overall,
    chemistry: userSquad.chemistry,
    squad: squadPerformances,
  };
}

export function calcEffectiveStrength(stats: SimulatedTeamStats, redCards: number = 0): number {
  // Base rating = Overall (60%) + Attack (20%) + Defense (20%)
  const baseRating = stats.overall * 0.60 + stats.attack * 0.20 + stats.defense * 0.20;
  
  // Chemistry factor: 0.85 to 1.10 multiplier
  const chemMultiplier = 0.85 + (stats.chemistry / 100) * 0.25;

  let strength = baseRating * chemMultiplier;

  // Red card penalty: 15% reduction per red card
  if (redCards > 0) {
    strength *= Math.max(0.5, 1 - redCards * 0.15);
  }

  return strength;
}

export function simulateMatch(
  homeStats: SimulatedTeamStats,
  awayStats: SimulatedTeamStats,
  stage: string,
  isKnockout: boolean = false
): Match {
  const matchId = `match-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  // Initialize Team Stats
  const homeTeamStats: TeamMatchStats = {
    possession: 50,
    shots: 0,
    shotsOnTarget: 0,
    shotsOffTarget: 0,
    blockedShots: 0,
    corners: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    offsides: 0,
    tackles: 0,
    interceptions: 0,
    blocks: 0,
    saves: 0,
  };

  const awayTeamStats: TeamMatchStats = {
    possession: 50,
    shots: 0,
    shotsOnTarget: 0,
    shotsOffTarget: 0,
    blockedShots: 0,
    corners: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    offsides: 0,
    tackles: 0,
    interceptions: 0,
    blocks: 0,
    saves: 0,
  };

  // Initialize Player Stats Map
  const playerStatsMap = new Map<string, PlayerMatchStats>();

  const initPlayerStats = (team: SimulatedTeamStats) => {
    team.squad.forEach(p => {
      const pName = formatPlayerName(p.name || PLAYERS[p.playerId]?.name, p.playerId);
      playerStatsMap.set(p.id, {
        performanceId: p.id,
        playerId: p.playerId,
        playerName: pName,
        teamId: team.id,
        teamName: team.name,
        position: p.position,
        overall: p.overall,
        minutesPlayed: 90,
        goals: 0,
        assists: 0,
        shots: 0,
        shotsOnTarget: 0,
        tackles: 0,
        interceptions: 0,
        blocks: 0,
        clearances: 0,
        saves: 0,
        goalsConceded: 0,
        cleanSheet: false,
        yellowCards: 0,
        redCards: 0,
        rating: 6.0,
      });
    });
  };

  initPlayerStats(homeStats);
  initPlayerStats(awayStats);

  // Calculate Possession split
  const homeStrInitial = calcEffectiveStrength(homeStats);
  const awayStrInitial = calcEffectiveStrength(awayStats);
  const homeMid = homeStats.midfield * 0.5 + homeStrInitial * 0.5;
  const awayMid = awayStats.midfield * 0.5 + awayStrInitial * 0.5;
  const totMid = homeMid + awayMid;

  let homePossession = Math.round((homeMid / totMid) * 100);
  homePossession = Math.max(30, Math.min(70, homePossession));
  const awayPossession = 100 - homePossession;

  homeTeamStats.possession = homePossession;
  awayTeamStats.possession = awayPossession;

  const events: DetailedMatchEvent[] = [];
  let eventCounter = 1;

  const addEvent = (
    minute: number,
    period: '1H' | '2H' | 'ET1' | 'ET2' | 'PEN',
    type: DetailedMatchEvent['type'],
    teamId: string,
    teamName: string,
    description: string,
    opts?: {
      playerId?: string;
      playerName?: string;
      secondaryPlayerId?: string;
      secondaryPlayerName?: string;
      goalType?: GoalType;
      shotOutcome?: 'goal' | 'saved' | 'blocked' | 'missed';
      penaltyResult?: 'scored' | 'saved' | 'missed';
    }
  ): DetailedMatchEvent => {
    const ev: DetailedMatchEvent = {
      id: `${matchId}-ev-${eventCounter++}`,
      minute,
      period,
      type,
      teamId,
      teamName,
      description,
      ...opts,
    };
    events.push(ev);
    return ev;
  };

  // Kickoff Event
  addEvent(0, '1H', 'KICKOFF', homeStats.id, homeStats.name, `Match begins! ${homeStats.name} kick off.`);

  let homeScore = 0;
  let awayScore = 0;
  let homeRedCards = 0;
  let awayRedCards = 0;

  // Helper to pick random player by filter and weights
  const selectPlayer = (team: SimulatedTeamStats, filterFn: (p: PlayerEditionPerformance) => boolean, weightFn?: (p: PlayerEditionPerformance) => number): PlayerEditionPerformance | null => {
    const candidates = team.squad.filter(filterFn);
    if (candidates.length === 0) return team.squad[0] || null;
    if (!weightFn) return candidates[Math.floor(Math.random() * candidates.length)];

    const weights = candidates.map(weightFn);
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;

    for (let i = 0; i < candidates.length; i++) {
      if (rand <= weights[i]) return candidates[i];
      rand -= weights[i];
    }
    return candidates[0];
  };

  // Helper to simulate a period of play (e.g. 1-45, 46-90, 91-105, 106-120)
  const simulateMinutes = (startMin: number, endMin: number, period: '1H' | '2H' | 'ET1' | 'ET2') => {
    for (let m = startMin; m <= endMin; m++) {
      const homeStr = calcEffectiveStrength(homeStats, homeRedCards);
      const awayStr = calcEffectiveStrength(awayStats, awayRedCards);

      // Determine if a major event occurs this minute (approx ~25-30% chance per minute)
      const chanceProbability = 0.28;
      if (Math.random() > chanceProbability) continue;

      // Attacking team selection based on relative strength & possession
      const homeChanceWeight = homeStr * (homePossession / 50);
      const awayChanceWeight = awayStr * (awayPossession / 50);
      const totalWeight = homeChanceWeight + awayChanceWeight;

      const isHomeAttacking = Math.random() * totalWeight < homeChanceWeight;
      const attTeam = isHomeAttacking ? homeStats : awayStats;
      const defTeam = isHomeAttacking ? awayStats : homeStats;
      const attStats = isHomeAttacking ? homeTeamStats : awayTeamStats;
      const defStats = isHomeAttacking ? awayTeamStats : homeTeamStats;

      // Select key players
      const shooter = selectPlayer(attTeam, p => p.position !== 'GK', p => p.shooting + p.overall + (['ST', 'LW', 'RW'].includes(p.position) ? 30 : 0));
      const assister = selectPlayer(attTeam, p => p.id !== shooter?.id && p.position !== 'GK', p => p.passing + p.overall);
      const defender = selectPlayer(defTeam, p => ['CB', 'LB', 'RB', 'CDM'].includes(p.position), p => p.defending + p.physical);
      const goalkeeper = selectPlayer(defTeam, p => p.position === 'GK', p => p.overall + p.defending);

      const shooterName = shooter ? formatPlayerName(shooter.name || PLAYERS[shooter.playerId]?.name, shooter.playerId) : `${attTeam.name} Attacker`;
      const assisterName = assister ? formatPlayerName(assister.name || PLAYERS[assister.playerId]?.name, assister.playerId) : undefined;
      const defenderName = defender ? formatPlayerName(defender.name || PLAYERS[defender.playerId]?.name, defender.playerId) : `${defTeam.name} Defender`;
      const gkName = goalkeeper ? formatPlayerName(goalkeeper.name || PLAYERS[goalkeeper.playerId]?.name, goalkeeper.playerId) : `${defTeam.name} Goalkeeper`;

      // Event chain type
      const eventRoll = Math.random();

      if (eventRoll < 0.20) {
        // Defensive Action: Tackle or Interception by defender
        defStats.tackles += 1;
        if (defender) {
          const pStat = playerStatsMap.get(defender.id);
          if (pStat) pStat.tackles += 1;
        }
        addEvent(m, period, 'TACKLE', defTeam.id, defTeam.name, `${defenderName} makes a clean tackle to stop ${shooterName}'s run.`, {
          playerId: defender?.id,
          playerName: defenderName,
          secondaryPlayerId: shooter?.id,
          secondaryPlayerName: shooterName,
        });
      } else if (eventRoll < 0.28) {
        // Foul & Card
        defStats.fouls += 1;
        const isYellow = Math.random() < 0.25;
        const isRed = Math.random() < 0.03;

        if (isRed) {
          defStats.redCards += 1;
          if (isHomeAttacking) awayRedCards += 1;
          else homeRedCards += 1;

          if (defender) {
            const pStat = playerStatsMap.get(defender.id);
            if (pStat) pStat.redCards += 1;
          }
          addEvent(m, period, 'RED', defTeam.id, defTeam.name, `RED CARD! ${defenderName} is sent off after a terrible challenge on ${shooterName}!`, {
            playerId: defender?.id,
            playerName: defenderName,
          });
        } else if (isYellow) {
          defStats.yellowCards += 1;
          if (defender) {
            const pStat = playerStatsMap.get(defender.id);
            if (pStat) pStat.yellowCards += 1;
          }
          addEvent(m, period, 'YELLOW', defTeam.id, defTeam.name, `Yellow card shown to ${defenderName} for a late tackle on ${shooterName}.`, {
            playerId: defender?.id,
            playerName: defenderName,
          });
        }
      } else if (eventRoll < 0.38) {
        // Corner sequence
        attStats.corners += 1;
        addEvent(m, period, 'CORNER', attTeam.id, attTeam.name, `Corner kick for ${attTeam.name} after a deflected cross from ${assisterName || shooterName}.`, {
          playerId: assister?.id || shooter?.id,
          playerName: assisterName || shooterName,
        });
      } else {
        // Shot Sequence
        attStats.shots += 1;
        if (shooter) {
          const pStat = playerStatsMap.get(shooter.id);
          if (pStat) pStat.shots += 1;
        }

        const shotQuality = (attTeam.attack * (shooter ? shooter.shooting : 80)) / Math.max(40, defTeam.defense);
        const shotRoll = Math.random() * 100;

        if (shotRoll < 25) {
          // Blocked Shot
          attStats.blockedShots += 1;
          defStats.blocks += 1;
          if (defender) {
            const pStat = playerStatsMap.get(defender.id);
            if (pStat) pStat.blocks += 1;
          }
          addEvent(m, period, 'BLOCK', defTeam.id, defTeam.name, `Shot by ${shooterName} is blocked by ${defenderName}!`, {
            playerId: shooter?.id,
            playerName: shooterName,
            secondaryPlayerId: defender?.id,
            secondaryPlayerName: defenderName,
            shotOutcome: 'blocked',
          });
        } else if (shotRoll < 45) {
          // Shot Off Target
          attStats.shotsOffTarget += 1;
          addEvent(m, period, 'SHOT_OFF_TARGET', attTeam.id, attTeam.name, `${shooterName} fires a shot from distance, but it sails wide of the target.`, {
            playerId: shooter?.id,
            playerName: shooterName,
            shotOutcome: 'missed',
          });
        } else {
          // Shot On Target -> Save or Goal!
          attStats.shotsOnTarget += 1;
          if (shooter) {
            const pStat = playerStatsMap.get(shooter.id);
            if (pStat) pStat.shotsOnTarget += 1;
          }

          // Goal probability calculation
          const gkQuality = goalkeeper ? goalkeeper.overall : 80;
          const goalProb = Math.min(0.70, Math.max(0.12, (shotQuality / (gkQuality * 0.95)) * 0.35));

          if (Math.random() < goalProb) {
            // GOAL!
            if (isHomeAttacking) homeScore += 1;
            else awayScore += 1;

            if (shooter) {
              const pStat = playerStatsMap.get(shooter.id);
              if (pStat) pStat.goals += 1;
            }

            let hasAssist = false;
            if (assister && Math.random() < 0.70) {
              hasAssist = true;
              const aStat = playerStatsMap.get(assister.id);
              if (aStat) aStat.assists += 1;
            }

            if (goalkeeper) {
              const gkStat = playerStatsMap.get(goalkeeper.id);
              if (gkStat) gkStat.goalsConceded += 1;
            }

            // Determine goal type
            const goalTypes: GoalType[] = ['open_play', 'counter', 'header', 'long_shot', 'through_ball' as any, 'one_on_one'];
            const gType = goalTypes[Math.floor(Math.random() * goalTypes.length)];

            const desc = hasAssist
              ? `GOAL! ${shooterName} smashes it into the net after a exquisite pass from ${assisterName}!`
              : `GOAL! Brilliant individual effort from ${shooterName} to break the deadlock!`;

            addEvent(m, period, 'GOAL', attTeam.id, attTeam.name, desc, {
              playerId: shooter?.id,
              playerName: shooterName,
              secondaryPlayerId: hasAssist ? assister?.id : undefined,
              secondaryPlayerName: hasAssist ? assisterName : undefined,
              goalType: gType,
              shotOutcome: 'goal',
            });
          } else {
            // SAVE!
            defStats.saves += 1;
            if (goalkeeper) {
              const gkStat = playerStatsMap.get(goalkeeper.id);
              if (gkStat) gkStat.saves += 1;
            }

            addEvent(m, period, 'SAVE', defTeam.id, defTeam.name, `WHAT A SAVE! ${gkName} dives low to deny ${shooterName}'s powerful strike!`, {
              playerId: goalkeeper?.id,
              playerName: gkName,
              secondaryPlayerId: shooter?.id,
              secondaryPlayerName: shooterName,
              shotOutcome: 'saved',
            });
          }
        }
      }
    }
  };

  // First Half (1-45')
  simulateMinutes(1, 45, '1H');
  addEvent(45, '1H', 'HALF_TIME', homeStats.id, homeStats.name, `HALF-TIME score: ${homeStats.name} ${homeScore} - ${awayScore} ${awayStats.name}.`);

  // Second Half (46-90')
  simulateMinutes(46, 90, '2H');

  let extraTimePlayed = false;
  let homePenalties: number | undefined = undefined;
  let awayPenalties: number | undefined = undefined;

  // Knockout Tie-Breaker (Extra Time & Penalties)
  if (isKnockout && homeScore === awayScore) {
    extraTimePlayed = true;
    addEvent(90, '2H', 'EXTRA_TIME_START', homeStats.id, homeStats.name, `The match is level at full-time! Proceeding to Extra Time.`);

    // ET 1st Half (91-105')
    simulateMinutes(91, 105, 'ET1');

    // ET 2nd Half (106-120')
    simulateMinutes(106, 120, 'ET2');

    // If still tied, Penalty Shootout
    if (homeScore === awayScore) {
      addEvent(120, 'ET2', 'PENALTY_SHOOTOUT', homeStats.id, homeStats.name, `Still level after 120 minutes! Penalty Shootout begins.`);

      let hPen = 0;
      let aPen = 0;

      const homeGK = selectPlayer(homeStats, p => p.position === 'GK') || homeStats.squad[0];
      const awayGK = selectPlayer(awayStats, p => p.position === 'GK') || awayStats.squad[0];

      const homeStrikers = homeStats.squad.filter(p => p.position !== 'GK');
      const awayStrikers = awayStats.squad.filter(p => p.position !== 'GK');

      for (let k = 0; k < 5; k++) {
        // Home Penalty Kick
        const hShooter = homeStrikers[k % homeStrikers.length];
        const hShooterName = formatPlayerName(hShooter?.name || PLAYERS[hShooter?.playerId]?.name, hShooter?.playerId);
        const aGkName = formatPlayerName(awayGK?.name || PLAYERS[awayGK?.playerId]?.name, awayGK?.playerId);

        const hProb = 0.75 + (hShooter?.shooting || 80) * 0.002 - (awayGK?.overall || 80) * 0.002;
        const hScored = Math.random() < hProb;

        if (hScored) {
          hPen++;
          if (hShooter) playerStatsMap.get(hShooter.id)!.goals += 1;
          addEvent(120, 'PEN', 'PENALTY_KICK', homeStats.id, homeStats.name, `PENALTY SCORED! ${hShooterName} calmly converts.`, {
            playerId: hShooter?.id,
            playerName: hShooterName,
            penaltyResult: 'scored',
          });
        } else {
          if (awayGK) playerStatsMap.get(awayGK.id)!.saves += 1;
          addEvent(120, 'PEN', 'PENALTY_KICK', homeStats.id, homeStats.name, `PENALTY SAVED! ${aGkName} denies ${hShooterName}!`, {
            playerId: hShooter?.id,
            playerName: hShooterName,
            secondaryPlayerId: awayGK?.id,
            secondaryPlayerName: aGkName,
            penaltyResult: 'saved',
          });
        }

        // Away Penalty Kick
        const aShooter = awayStrikers[k % awayStrikers.length];
        const aShooterName = formatPlayerName(aShooter?.name || PLAYERS[aShooter?.playerId]?.name, aShooter?.playerId);
        const hGkName = formatPlayerName(homeGK?.name || PLAYERS[homeGK?.playerId]?.name, homeGK?.playerId);

        const aProb = 0.75 + (aShooter?.shooting || 80) * 0.002 - (homeGK?.overall || 80) * 0.002;
        const aScored = Math.random() < aProb;

        if (aScored) {
          aPen++;
          if (aShooter) playerStatsMap.get(aShooter.id)!.goals += 1;
          addEvent(120, 'PEN', 'PENALTY_KICK', awayStats.id, awayStats.name, `PENALTY SCORED! ${aShooterName} sends the keeper the wrong way.`, {
            playerId: aShooter?.id,
            playerName: aShooterName,
            penaltyResult: 'scored',
          });
        } else {
          if (homeGK) playerStatsMap.get(homeGK.id)!.saves += 1;
          addEvent(120, 'PEN', 'PENALTY_KICK', awayStats.id, awayStats.name, `PENALTY SAVED! ${hGkName} makes a clutch save!`, {
            playerId: aShooter?.id,
            playerName: aShooterName,
            secondaryPlayerId: homeGK?.id,
            secondaryPlayerName: hGkName,
            penaltyResult: 'saved',
          });
        }
      }

      // Sudden death penalties if still tied
      let suddenK = 5;
      while (hPen === aPen && suddenK < 10) {
        hPen += Math.random() < 0.7 ? 1 : 0;
        aPen += Math.random() < 0.7 ? 1 : 0;
        suddenK++;
      }
      if (hPen === aPen) hPen += 1; // force winner

      homePenalties = hPen;
      awayPenalties = aPen;
    }
  }

  addEvent(
    extraTimePlayed ? 120 : 90,
    extraTimePlayed ? 'ET2' : '2H',
    'FULL_TIME',
    homeStats.id,
    homeStats.name,
    `FULL-TIME: ${homeStats.name} ${homeScore} - ${awayScore} ${awayStats.name}${homePenalties !== undefined ? ` (${homePenalties}-${awayPenalties} pens)` : ''}.`
  );

  // Update Clean Sheet & Final Player Ratings
  const playerStatsList = Array.from(playerStatsMap.values());

  playerStatsList.forEach(p => {
    const isHome = p.teamId === homeStats.id;
    const teamConceded = isHome ? awayScore : homeScore;

    if (['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position)) {
      if (teamConceded === 0) p.cleanSheet = true;
    }

    // Rating formula
    let r = 6.0;
    if (p.position === 'GK') {
      r += p.saves * 0.5 - p.goalsConceded * 0.4 + (p.cleanSheet ? 1.0 : 0);
    } else if (['CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM'].includes(p.position)) {
      r += p.tackles * 0.3 + p.interceptions * 0.3 + p.blocks * 0.3 + p.goals * 1.2 + p.assists * 0.8 + (p.cleanSheet ? 0.8 : 0) - teamConceded * 0.2;
    } else {
      r += p.goals * 1.3 + p.assists * 0.9 + p.shotsOnTarget * 0.3 + p.tackles * 0.2;
    }

    r -= p.yellowCards * 0.5 + p.redCards * 2.0;

    p.rating = Math.max(5.0, Math.min(10.0, Math.round(r * 10) / 10));
  });

  // Select Man of the Match
  playerStatsList.sort((a, b) => b.rating - a.rating);
  const motm = playerStatsList[0];
  if (motm) motm.isMotm = true;

  // Determine winner teamId
  let winnerTeamId: string | undefined = undefined;
  if (homeScore > awayScore) winnerTeamId = homeStats.id;
  else if (awayScore > homeScore) winnerTeamId = awayStats.id;
  else if (homePenalties !== undefined && awayPenalties !== undefined) {
    winnerTeamId = homePenalties > awayPenalties ? homeStats.id : awayStats.id;
  }

  return {
    id: matchId,
    stage,
    homeTeamId: homeStats.id,
    awayTeamId: awayStats.id,
    homeTeamName: homeStats.name,
    awayTeamName: awayStats.name,
    homeTeamFlag: homeStats.flag,
    awayTeamFlag: awayStats.flag,
    isUserHome: homeStats.id === 'user-xi',
    isUserAway: awayStats.id === 'user-xi',
    homeScore,
    awayScore,
    homePenalties,
    awayPenalties,
    completed: true,
    events,
    homeTeamStats,
    awayTeamStats,
    playerStats: playerStatsList,
    manOfTheMatch: motm,
    winnerTeamId,
    extraTimePlayed,
  };
}
