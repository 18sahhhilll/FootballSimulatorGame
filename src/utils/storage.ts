import { UserSquad, TournamentState, LaligaState } from '../types/football';

const STORAGE_KEYS = {
  USER_SQUAD: 'FOOTBALL_USER_SQUAD',
  TOURNAMENT_STATE: 'FOOTBALL_TOURNAMENT_STATE',
  LALIGA_STATE: 'FOOTBALL_LALIGA_STATE',
  CURRENT_PAGE: 'FOOTBALL_CURRENT_PAGE',
};

export function saveUserSquadToStorage(squad: UserSquad | null) {
  if (!squad) {
    localStorage.removeItem(STORAGE_KEYS.USER_SQUAD);
  } else {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SQUAD, JSON.stringify(squad));
    } catch (e) {
      console.error('Error saving UserSquad to storage', e);
    }
  }
}

export function loadUserSquadFromStorage(): UserSquad | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SQUAD);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading UserSquad from storage', e);
    return null;
  }
}

export function saveTournamentStateToStorage(state: TournamentState | null) {
  if (!state) {
    localStorage.removeItem(STORAGE_KEYS.TOURNAMENT_STATE);
  } else {
    try {
      const serializableState = {
        ...state,
        stats: Array.from(state.stats.entries()), // Convert Map to Entries array for JSON
      };
      localStorage.setItem(STORAGE_KEYS.TOURNAMENT_STATE, JSON.stringify(serializableState));
    } catch (e) {
      console.error('Error saving TournamentState to storage', e);
    }
  }
}

export function loadTournamentStateFromStorage(): TournamentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOURNAMENT_STATE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Reconstruct Map from entries array
    const statsMap = new Map(parsed.stats || []);

    return {
      ...parsed,
      stats: statsMap,
    };
  } catch (e) {
    console.error('Error loading TournamentState from storage', e);
    return null;
  }
}

export function saveLaligaStateToStorage(state: LaligaState | null) {
  if (!state) {
    localStorage.removeItem(STORAGE_KEYS.LALIGA_STATE);
  } else {
    try {
      const serializableState = {
        ...state,
        stats: Array.from(state.stats.entries()), // Convert Map to Entries array for JSON
      };
      localStorage.setItem(STORAGE_KEYS.LALIGA_STATE, JSON.stringify(serializableState));
    } catch (e) {
      console.error('Error saving LaligaState to storage', e);
    }
  }
}

export function loadLaligaStateFromStorage(): LaligaState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LALIGA_STATE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    const statsMap = new Map(parsed.stats || []);

    return {
      ...parsed,
      stats: statsMap,
    };
  } catch (e) {
    console.error('Error loading LaligaState from storage', e);
    return null;
  }
}

export function saveCurrentPageToStorage(page: string) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page);
}

export function loadCurrentPageFromStorage(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
}

export function clearAllGameStorage() {
  localStorage.removeItem(STORAGE_KEYS.USER_SQUAD);
  localStorage.removeItem(STORAGE_KEYS.TOURNAMENT_STATE);
  localStorage.removeItem(STORAGE_KEYS.LALIGA_STATE);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
}
