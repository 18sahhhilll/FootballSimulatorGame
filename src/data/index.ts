import { PLAYERS } from './players';
import { TEAMS } from './teams';
import { EDITIONS } from './editions';
import { WC2022_PERFORMANCES } from './performances/wc2022';
import { WC2018_PERFORMANCES } from './performances/wc2018';
import { WC2014_PERFORMANCES } from './performances/wc2014';
import { PlayerEditionPerformance, Player, Team, Edition } from '../types/football';

export { PLAYERS, TEAMS, EDITIONS };

export const ALL_PERFORMANCES: PlayerEditionPerformance[] = [
  ...WC2022_PERFORMANCES,
  ...WC2018_PERFORMANCES,
  ...WC2014_PERFORMANCES,
];

export function getEditionById(id: string): Edition | undefined {
  return EDITIONS.find(e => e.id === id);
}

export function getTeamById(id: string): Team | undefined {
  return TEAMS[id];
}

export function getPlayerById(id: string): Player | undefined {
  return PLAYERS[id];
}

export function getPerformanceById(id: string): PlayerEditionPerformance | undefined {
  return ALL_PERFORMANCES.find(p => p.id === id);
}

export function getPerformancesByEdition(editionId: string): PlayerEditionPerformance[] {
  return ALL_PERFORMANCES.filter(p => p.editionId === editionId);
}
