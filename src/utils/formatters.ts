export function formatPlayerName(name?: string, playerId?: string): string {
  if (name && name.trim().length > 0) {
    const trimmed = name.trim();
    if (!trimmed.includes('-')) {
      return trimmed;
    }
  }

  const raw = (name && name.trim().length > 0 ? name : (playerId || '')).trim();
  if (!raw) return 'Player';

  if (raw.includes('-')) {
    return raw
      .split('-')
      .map(part => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ''))
      .join(' ');
  }

  if (raw.charAt(0) !== raw.charAt(0).toUpperCase()) {
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  return raw;
}
