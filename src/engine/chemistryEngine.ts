import { DraftSlot } from '../types/football';
import { PLAYERS } from '../data/players';

export function calculateChemistry(slots: DraftSlot[]): number {
  const filledSlots = slots.filter(s => s.assignedPerformance !== undefined);
  if (filledSlots.length === 0) return 0;

  let baseChemistry = 50;

  // 1. Nationality synergy
  const nationalityCounts: Record<string, number> = {};
  const teamCounts: Record<string, number> = {};

  filledSlots.forEach(slot => {
    const perf = slot.assignedPerformance!;
    const player = PLAYERS[perf.playerId];
    const nation = player ? player.nationality : 'Unknown';

    nationalityCounts[nation] = (nationalityCounts[nation] || 0) + 1;
    teamCounts[perf.teamId] = (teamCounts[perf.teamId] || 0) + 1;
  });

  // Boost for matching nationalities (e.g. 2+ players = +8, 3+ = +16, 5+ = +30)
  Object.values(nationalityCounts).forEach(count => {
    if (count >= 5) baseChemistry += 25;
    else if (count >= 3) baseChemistry += 16;
    else if (count >= 2) baseChemistry += 9;
  });

  // Boost for matching exact edition teams (e.g. Argentina 2022 teammates)
  Object.values(teamCounts).forEach(count => {
    if (count >= 4) baseChemistry += 20;
    else if (count >= 2) baseChemistry += 10;
  });

  // 2. Position fit average impact
  const avgPosFit = filledSlots.reduce((sum, s) => sum + s.positionFit, 0) / filledSlots.length;
  baseChemistry += (avgPosFit - 80) * 0.5;

  // Clamp between 0 and 100
  return Math.min(100, Math.max(0, Math.round(baseChemistry)));
}
