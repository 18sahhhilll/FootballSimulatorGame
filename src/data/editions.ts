import { Edition } from '../types/football';

export const COMPETITION_EDITIONS: Edition[] = [
  {
    id: 'world-cup-mode',
    name: 'FIFA World Cup',
    type: 'WORLD_CUP',
    hostCountry: 'Global',
    hostFlag: '🌎',
    teams: ['argentina', 'france', 'croatia', 'morocco', 'brazil', 'england', 'germany', 'spain', 'italy', 'netherlands'],
    isAvailable: true,
    description: 'The ultimate international tournament. Spin iconic historical national teams across World Cup history (1970–2022) to build your dream XI.',
    badge: '🌎 WORLD CUP'
  },
  {
    id: 'champions-league-mode',
    name: 'UEFA Champions League',
    type: 'CHAMPIONS_LEAGUE',
    hostCountry: 'Europe',
    hostFlag: '⭐',
    teams: [],
    isAvailable: false,
    description: 'Spin legendary European club sides across UCL history (Real Madrid 2017, Barcelona 2011, Bayern 2020, Milan 2007).',
    badge: '⭐ UCL'
  },
  {
    id: 'premier-league-mode',
    name: 'Premier League',
    type: 'PREMIER_LEAGUE',
    hostCountry: 'England',
    hostFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    teams: [],
    isAvailable: false,
    description: 'Spin iconic English top-flight champions (Invincibles 2004, Man City 100pts 2018, Man Utd 1999).',
    badge: '🦁 PL'
  },
  {
    id: 'la-liga-mode',
    name: 'La Liga',
    type: 'LA_LIGA',
    hostCountry: 'Spain',
    hostFlag: '🇪🇸',
    teams: [],
    isAvailable: true,
    description: 'Spin legendary Spanish league clubs to build your XI and compete for the La Liga trophy.',
    badge: '🇪🇸 LALIGA'
  }
];

export const EDITIONS = COMPETITION_EDITIONS;
