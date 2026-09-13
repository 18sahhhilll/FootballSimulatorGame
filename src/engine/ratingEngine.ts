import { Position, PlayerEditionPerformance, DraftSlot } from '../types/football';

export function getPositionGroup(pos: Position): 'GK' | 'DEF' | 'MID' | 'FWD' {
  if (pos === 'GK') return 'GK';
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos)) return 'DEF';
  if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos)) return 'MID';
  return 'FWD'; // LW, RW, ST
}

export function calculatePositionFit(targetPosition: Position, perf: PlayerEditionPerformance): number {
  if (perf.position === targetPosition) return 100;
  if (perf.secondaryPositions && perf.secondaryPositions.includes(targetPosition)) return 92;

  const targetGroup = getPositionGroup(targetPosition);
  const playerGroup = getPositionGroup(perf.position);

  if (targetPosition === 'GK' || perf.position === 'GK') {
    return 15; // Huge penalty for GK playing outfield or vice-versa
  }

  if (targetGroup === playerGroup) {
    return 83; // Same group (e.g. LW at ST or CM at CAM)
  }

  if ((targetGroup === 'MID' && playerGroup === 'FWD') || (targetGroup === 'FWD' && playerGroup === 'MID')) {
    return 70; // Midfielder playing attack or vice-versa
  }

  if ((targetGroup === 'MID' && playerGroup === 'DEF') || (targetGroup === 'DEF' && playerGroup === 'MID')) {
    return 65; // Defender playing midfield or vice-versa
  }

  return 42; // Striker playing CB or Defender playing ST
}

export function calculateSquadRatings(slots: DraftSlot[]): {
  overall: number;
  attack: number;
  midfield: number;
  defense: number;
  goalkeeping: number;
} {
  const filledSlots = slots.filter(s => s.assignedPerformance !== undefined);
  if (filledSlots.length === 0) {
    return { overall: 0, attack: 0, midfield: 0, defense: 0, goalkeeping: 0 };
  }

  let totalAtt = 0, countAtt = 0;
  let totalMid = 0, countMid = 0;
  let totalDef = 0, countDef = 0;
  let totalGk = 0, countGk = 0;

  slots.forEach(slot => {
    if (!slot.assignedPerformance) return;

    const fit = slot.positionFit / 100;
    const effectiveRating = slot.assignedPerformance.overall * fit;
    const group = getPositionGroup(slot.slotConfig.position);

    if (group === 'FWD') {
      totalAtt += effectiveRating;
      countAtt++;
    } else if (group === 'MID') {
      totalMid += effectiveRating;
      countMid++;
    } else if (group === 'DEF') {
      totalDef += effectiveRating;
      countDef++;
    } else if (group === 'GK') {
      totalGk += effectiveRating;
      countGk++;
    }
  });

  const attack = countAtt > 0 ? Math.round(totalAtt / countAtt) : 0;
  const midfield = countMid > 0 ? Math.round(totalMid / countMid) : 0;
  const defense = countDef > 0 ? Math.round(totalDef / countDef) : 0;
  const goalkeeping = countGk > 0 ? Math.round(totalGk / countGk) : 0;

  const validSectors = [attack, midfield, defense, goalkeeping].filter(r => r > 0);
  const sum = validSectors.reduce((a, b) => a + b, 0);
  const overall = validSectors.length > 0 ? Math.round(sum / validSectors.length) : 0;

  return {
    overall,
    attack,
    midfield,
    defense,
    goalkeeping
  };
}
