// Helper utility to resolve La Liga team logos imported from src/images/laliga-teams
const logoGlob = import.meta.glob<string>('../images/laliga-teams/*.png', { eager: true, import: 'default' });

const LOGO_MAP: Record<string, string> = {};

for (const path in logoGlob) {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  if (fileName) {
    LOGO_MAP[fileName.toLowerCase()] = logoGlob[path];
  }
}

export function getTeamLogoUrl(teamId?: string, teamName?: string): string | undefined {
  if (!teamId && !teamName) return undefined;

  const idLower = (teamId || '').toLowerCase();
  const nameLower = (teamName || '').toLowerCase();

  // Fantasy 11 User Team check
  if (
    idLower === 'user-xi' ||
    idLower.includes('fantasy') ||
    nameLower.includes('fantasy') ||
    nameLower.includes('user')
  ) {
    return LOGO_MAP['fantasy 11'];
  }

  if (idLower.includes('barcelona') || nameLower.includes('barcelona')) return LOGO_MAP['barcelona'];
  if (idLower.includes('real-madrid') || nameLower.includes('real madrid')) return LOGO_MAP['real madrid'];
  if (idLower.includes('atlético') || idLower.includes('atletico') || nameLower.includes('atlético')) return LOGO_MAP['atlético madrid'];
  if (idLower.includes('athletic') || nameLower.includes('athletic')) return LOGO_MAP['athletic club'];
  if (idLower.includes('sevilla') || nameLower.includes('sevilla')) return LOGO_MAP['sevilla fc'];
  if (idLower.includes('celta') || nameLower.includes('celta')) return LOGO_MAP['rc celta vigo'];
  if (idLower.includes('betis') || nameLower.includes('betis')) return LOGO_MAP['real betis'];
  if (idLower.includes('villarreal') || nameLower.includes('villarreal')) return LOGO_MAP['villarreal cf'];
  if (idLower.includes('sociedad') || nameLower.includes('sociedad')) return LOGO_MAP['real sociedad'];
  if (idLower.includes('valencia') || nameLower.includes('valencia')) return LOGO_MAP['valencia cf'];
  if (idLower.includes('getafe') || nameLower.includes('getafe')) return LOGO_MAP['getafe cf'];
  if (idLower.includes('osasuna') || nameLower.includes('osasuna')) return LOGO_MAP['ca osasuna'];
  if (idLower.includes('rayo') || nameLower.includes('rayo')) return LOGO_MAP['rayo vallecano'];
  if (idLower.includes('alav') || nameLower.includes('alav')) return LOGO_MAP['deportivo alavés'];
  if (idLower.includes('espanyol') || nameLower.includes('espanyol')) return LOGO_MAP['rcd espanyol'];
  if (idLower.includes('elche') || nameLower.includes('elche')) return LOGO_MAP['elche cf'];
  if (idLower.includes('levante') || nameLower.includes('levante')) return LOGO_MAP['levante ud'];
  if (idLower.includes('mál') || idLower.includes('malaga') || nameLower.includes('málaga') || nameLower.includes('malaga')) return LOGO_MAP['málaga cf'];
  if (idLower.includes('racing') || nameLower.includes('racing')) return LOGO_MAP['racing santander'];
  if (idLower.includes('coru') || nameLower.includes('coru') || nameLower.includes('depor')) return LOGO_MAP['deportivo la coruña'];

  return LOGO_MAP['fantasy 11'] || undefined;
}

export function getLaligaLogoUrl(): string | undefined {
  return LOGO_MAP['laliga-logo'];
}
