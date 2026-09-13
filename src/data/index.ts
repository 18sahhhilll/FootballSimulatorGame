import { PLAYERS } from './players';
import { TEAMS } from './teams';
import { EDITIONS } from './editions';
import { Player, Team, Edition } from '../types/football';

export { PLAYERS, TEAMS, EDITIONS };

export function getEditionById(id: string): Edition | undefined {
  return EDITIONS.find(e => e.id === id);
}

export function getTeamById(id: string): Team | undefined {
  return TEAMS[id];
}

export function getPlayerById(id: string): Player | undefined {
  return PLAYERS[id];
}
