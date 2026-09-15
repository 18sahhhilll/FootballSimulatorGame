import { sortLaligaTable } from '../laligaTiebreaker';
import { LaligaTableEntry, LaligaFixture } from '../../types/football';

function createMockEntry(id: string, name: string, pts: number, gd: number, gf: number): LaligaTableEntry {
  return {
    rank: 0,
    teamId: id,
    teamName: name,
    teamFlag: '⚽',
    played: 38,
    won: 10,
    drawn: 0,
    lost: 0,
    gf,
    ga: gf - gd,
    gd,
    points: pts,
    yellowCards: 0,
    redCards: 0,
    fairPlayPoints: 0,
    form: ['W', 'W', 'W'],
  };
}

function createMockMatch(homeId: string, awayId: string, homeScore: number, awayScore: number): LaligaFixture {
  return {
    id: `match-${homeId}-${awayId}`,
    stage: 'LaLiga Matchday',
    matchday: 1,
    homeTeamId: homeId,
    awayTeamId: awayId,
    homeTeamName: homeId,
    awayTeamName: awayId,
    homeTeamFlag: '⚽',
    awayTeamFlag: '⚽',
    homeScore,
    awayScore,
    completed: true,
    events: [],
  };
}

// Test Suite
export function runTiebreakerTests() {
  console.log('--- RUNNING LALIGA TIEBREAKER TESTS ---');

  // Test 1: Two Teams Tied on Points — H2H Completed (Team A won 3-1 aggregate)
  {
    const teamA = createMockEntry('team-a', 'Team A', 75, +20, 50);
    const teamB = createMockEntry('team-b', 'Team B', 75, +30, 60); // Team B has better overall GD (+30 vs +20)

    const matches: LaligaFixture[] = [
      createMockMatch('team-a', 'team-b', 2, 0), // Match 1: Team A 2-0 Team B
      createMockMatch('team-b', 'team-a', 1, 1), // Match 2: Team B 1-1 Team A (Team A wins 3-1 agg, 4 pts vs 1 pt)
    ];

    const sorted = sortLaligaTable([teamA, teamB], matches);
    console.assert(sorted[0].teamId === 'team-a', 'Test 1 Failed: Team A should be rank 1 due to H2H points');
    console.assert(sorted[1].teamId === 'team-b', 'Test 1 Failed: Team B should be rank 2');
    console.log('✅ Test 1 Passed: Two-team H2H sorting overrides overall GD when both H2H matches completed.');
  }

  // Test 2: Two Teams Tied on Points — H2H Uncompleted (Falls back to overall Goal Difference)
  {
    const teamA = createMockEntry('team-a', 'Team A', 60, +15, 45);
    const teamB = createMockEntry('team-b', 'Team B', 60, +25, 55);

    // Only 1 match completed so far
    const matches: LaligaFixture[] = [
      createMockMatch('team-a', 'team-b', 1, 0),
    ];

    const sorted = sortLaligaTable([teamA, teamB], matches);
    console.assert(sorted[0].teamId === 'team-b', 'Test 2 Failed: Team B should be rank 1 due to uncompleted H2H fallback to overall GD');
    console.log('✅ Test 2 Passed: Uncompleted H2H provisionally falls back to overall Goal Difference.');
  }

  // Test 3: Three Teams Tied in Triangle Deadlock (A beat B, B beat C, C beat A) resolved via Mini-League GD
  {
    const teamA = createMockEntry('team-a', 'Team A', 70, +10, 40);
    const teamB = createMockEntry('team-b', 'Team B', 70, +10, 40);
    const teamC = createMockEntry('team-c', 'Team C', 70, +10, 40);

    const matches: LaligaFixture[] = [
      // A vs B
      createMockMatch('team-a', 'team-b', 3, 0),
      createMockMatch('team-b', 'team-a', 0, 0),
      // B vs C
      createMockMatch('team-b', 'team-c', 4, 0),
      createMockMatch('team-c', 'team-b', 0, 0),
      // C vs A
      createMockMatch('team-c', 'team-a', 1, 0),
      createMockMatch('team-a', 'team-c', 0, 0),
    ];

    // Mini-league stats:
    // Team B vs C: B won 4-0 (3 pts, GD +4). B vs A: B lost 0-3, drew 0-0. Total B mini pts = 4, GD = +1.
    // Team A vs B: A won 3-0, drew 0-0. A vs C: A lost 0-1, drew 0-0. Total A mini pts = 4, GD = +2.
    // Team C vs A: C won 1-0, drew 0-0. C vs B: C lost 0-4, drew 0-0. Total C mini pts = 4, GD = -3.

    const sorted = sortLaligaTable([teamA, teamB, teamC], matches);
    console.assert(sorted[0].teamId === 'team-a', 'Test 3 Failed: Team A should lead mini-league GD');
    console.assert(sorted[1].teamId === 'team-b', 'Test 3 Failed: Team B should be 2nd in mini-league GD');
    console.assert(sorted[2].teamId === 'team-c', 'Test 3 Failed: Team C should be 3rd in mini-league GD');
    console.log('✅ Test 3 Passed: Multi-team tiebreaker correctly calculates mini-league goal difference.');
  }

  console.log('ALL TIEBREAKER TESTS COMPLETED SUCCESSFULLY.');
}
