import { PLAYERS } from './players';
import { EDITIONS } from './editions';
import { Player, Edition } from '../types/football';

export { PLAYERS, EDITIONS };

export function getEditionById(id: string): Edition | undefined {
  return EDITIONS.find(e => e.id === id);
}

export function getPlayerById(id: string): Player | undefined {
  return PLAYERS[id];
}
