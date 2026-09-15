import { LaligaTableEntry, LaligaFixture } from '../types/football';

/**
 * Official RFEF / Spanish La Liga Table Sorting Algorithm
 * 
 * Rules:
 * 1. Total Points
 * 2. Two-Team Tie (when both H2H matches completed):
 *    a. Head-to-Head Points
 *    b. Head-to-Head Goal Difference
 *    c. Overall Goal Difference
 *    d. Overall Goals Scored
 *    e. Fair Play Points (lowest wins)
 * 3. Two-Team Tie (when H2H matches incomplete):
 *    a. Overall Goal Difference
 *    b. Overall Goals Scored
 *    c. Fair Play Points
 * 4. Multi-Team Tie (3 or more teams):
 *    a. Mini-league Points among tied teams
 *    b. Mini-league Goal Difference among tied teams
 *    c. Overall Goal Difference
 *    d. Overall Goals Scored
 *    e. Fair Play Points
 */
export function sortLaligaTable(
  entries: LaligaTableEntry[],
  completedMatches: LaligaFixture[]
): LaligaTableEntry[] {
  const table = entries.map(e => ({ ...e }));

  // Helper: map of completed H2H matches between any pair of team IDs
  const getH2HMatches = (team1Id: string, team2Id: string): LaligaFixture[] => {
    return completedMatches.filter(
      m =>
        m.completed &&
        ((m.homeTeamId === team1Id && m.awayTeamId === team2Id) ||
          (m.homeTeamId === team2Id && m.awayTeamId === team1Id))
    );
  };

  // Group teams into clusters by points
  const pointsMap = new Map<number, LaligaTableEntry[]>();
  for (const entry of table) {
    if (!pointsMap.has(entry.points)) {
      pointsMap.set(entry.points, []);
    }
    pointsMap.get(entry.points)!.push(entry);
  }

  // Sort unique point totals descending
  const sortedPointValues = Array.from(pointsMap.keys()).sort((a, b) => b - a);

  const sortedTable: LaligaTableEntry[] = [];

  for (const pts of sortedPointValues) {
    const cluster = pointsMap.get(pts)!;

    if (cluster.length === 1) {
      sortedTable.push(cluster[0]);
    } else if (cluster.length === 2) {
      const [t1, t2] = cluster;
      const h2hMatches = getH2HMatches(t1.teamId, t2.teamId);

      // Check if BOTH H2H matches (Home & Away) have been completed
      if (h2hMatches.length === 2) {
        let t1H2HPoints = 0;
        let t2H2HPoints = 0;
        let t1H2HGoals = 0;
        let t2H2HGoals = 0;

        for (const m of h2hMatches) {
          const isT1Home = m.homeTeamId === t1.teamId;
          const t1Score = isT1Home ? m.homeScore : m.awayScore;
          const t2Score = isT1Home ? m.awayScore : m.homeScore;

          t1H2HGoals += t1Score;
          t2H2HGoals += t2Score;

          if (t1Score > t2Score) t1H2HPoints += 3;
          else if (t2Score > t1Score) t2H2HPoints += 3;
          else {
            t1H2HPoints += 1;
            t2H2HPoints += 1;
          }
        }

        if (t1H2HPoints !== t2H2HPoints) {
          sortedTable.push(...(t1H2HPoints > t2H2HPoints ? [t1, t2] : [t2, t1]));
          continue;
        }

        const t1H2HGD = t1H2HGoals - t2H2HGoals;
        const t2H2HGD = t2H2HGoals - t1H2HGoals;
        if (t1H2HGD !== t2H2HGD) {
          sortedTable.push(...(t1H2HGD > t2H2HGD ? [t1, t2] : [t2, t1]));
          continue;
        }
      }

      // H2H uncompleted or strictly tied -> Overall GD, GF, Fair Play
      cluster.sort((a, b) => {
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        if (a.fairPlayPoints !== b.fairPlayPoints) return a.fairPlayPoints - b.fairPlayPoints;
        return a.teamName.localeCompare(b.teamName);
      });
      sortedTable.push(...cluster);
    } else {
      // 3 or more teams tied on points -> Mini-league calculation
      const tiedTeamIds = new Set(cluster.map(c => c.teamId));

      const miniLeagueStats = new Map<string, { pts: number; gd: number; gf: number }>();
      cluster.forEach(c => miniLeagueStats.set(c.teamId, { pts: 0, gd: 0, gf: 0 }));

      // Find matches played between teams in the tied cluster
      const miniMatches = completedMatches.filter(
        m => m.completed && tiedTeamIds.has(m.homeTeamId) && tiedTeamIds.has(m.awayTeamId)
      );

      for (const m of miniMatches) {
        const home = miniLeagueStats.get(m.homeTeamId);
        const away = miniLeagueStats.get(m.awayTeamId);

        if (home && away) {
          home.gf += m.homeScore;
          home.gd += m.homeScore - m.awayScore;
          away.gf += m.awayScore;
          away.gd += m.awayScore - m.homeScore;

          if (m.homeScore > m.awayScore) {
            home.pts += 3;
          } else if (m.awayScore > m.homeScore) {
            away.pts += 3;
          } else {
            home.pts += 1;
            away.pts += 1;
          }
        }
      }

      cluster.sort((a, b) => {
        const statsA = miniLeagueStats.get(a.teamId)!;
        const statsB = miniLeagueStats.get(b.teamId)!;

        if (statsB.pts !== statsA.pts) return statsB.pts - statsA.pts;
        if (statsB.gd !== statsA.gd) return statsB.gd - statsA.gd;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        if (a.fairPlayPoints !== b.fairPlayPoints) return a.fairPlayPoints - b.fairPlayPoints;
        return a.teamName.localeCompare(b.teamName);
      });

      sortedTable.push(...cluster);
    }
  }

  // Assign ranks and European qualification / relegation zones
  return sortedTable.map((entry, index) => {
    const rank = index + 1;
    let zone: LaligaTableEntry['zone'] = 'NONE';

    if (rank <= 4) zone = 'CHAMPIONS_LEAGUE';
    else if (rank === 5) zone = 'EUROPA_LEAGUE';
    else if (rank === 6) zone = 'CONFERENCE_LEAGUE';
    else if (rank >= 18) zone = 'RELEGATION';

    return {
      ...entry,
      rank,
      zone,
    };
  });
}
