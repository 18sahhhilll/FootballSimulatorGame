// Helper utility to resolve La Liga & World Cup team logos (via Flagcdn for World Cup national flags)
const laligaLogoGlob = import.meta.glob<string>('../images/laliga-teams/*.png', { eager: true, import: 'default' });
const plLogoGlob = import.meta.glob<string>('../images/Premier League/*.png', { eager: true, import: 'default' });
const uefaLogoGlob = import.meta.glob<string>('../images/UEFA/*.{png,jpg,jpeg}', { eager: true, import: 'default' });
const fifaLogoGlob = import.meta.glob<string>('../images/FIFA-Logo.png', { eager: true, import: 'default' });

const LOGO_MAP: Record<string, string> = {};

for (const path in laligaLogoGlob) {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  if (fileName) {
    LOGO_MAP[fileName.toLowerCase()] = laligaLogoGlob[path];
  }
}

// Uniform 160px CDN flag mappings for World Cup teams
const FLAG_CDN_MAP: Record<string, string> = {
  algeria: 'https://flagcdn.com/w160/dz.png',
  argentina: 'https://flagcdn.com/w160/ar.png',
  australia: 'https://flagcdn.com/w160/au.png',
  austria: 'https://flagcdn.com/w160/at.png',
  belgium: 'https://flagcdn.com/w160/be.png',
  brazil: 'https://flagcdn.com/w160/br.png',
  bulgaria: 'https://flagcdn.com/w160/bg.png',
  cameroon: 'https://flagcdn.com/w160/cm.png',
  chile: 'https://flagcdn.com/w160/cl.png',
  colombia: 'https://flagcdn.com/w160/co.png',
  'costa rica': 'https://flagcdn.com/w160/cr.png',
  croatia: 'https://flagcdn.com/w160/hr.png',
  'czech republic': 'https://flagcdn.com/w160/cz.png',
  denmark: 'https://flagcdn.com/w160/dk.png',
  ecuador: 'https://flagcdn.com/w160/ec.png',
  egypt: 'https://flagcdn.com/w160/eg.png',
  england: 'https://flagcdn.com/w160/gb-eng.png',
  france: 'https://flagcdn.com/w160/fr.png',
  germany: 'https://flagcdn.com/w160/de.png',
  ghana: 'https://flagcdn.com/w160/gh.png',
  greece: 'https://flagcdn.com/w160/gr.png',
  ireland: 'https://flagcdn.com/w160/ie.png',
  italy: 'https://flagcdn.com/w160/it.png',
  'ivory coast': 'https://flagcdn.com/w160/ci.png',
  japan: 'https://flagcdn.com/w160/jp.png',
  mexico: 'https://flagcdn.com/w160/mx.png',
  morocco: 'https://flagcdn.com/w160/ma.png',
  netherlands: 'https://flagcdn.com/w160/nl.png',
  nigeria: 'https://flagcdn.com/w160/ng.png',
  paraguay: 'https://flagcdn.com/w160/py.png',
  peru: 'https://flagcdn.com/w160/pe.png',
  poland: 'https://flagcdn.com/w160/pl.png',
  portugal: 'https://flagcdn.com/w160/pt.png',
  romania: 'https://flagcdn.com/w160/ro.png',
  russia: 'https://flagcdn.com/w160/ru.png',
  scotland: 'https://flagcdn.com/w160/gb-sct.png',
  senegal: 'https://flagcdn.com/w160/sn.png',
  serbia: 'https://flagcdn.com/w160/rs.png',
  'south korea': 'https://flagcdn.com/w160/kr.png',
  spain: 'https://flagcdn.com/w160/es.png',
  sweden: 'https://flagcdn.com/w160/se.png',
  switzerland: 'https://flagcdn.com/w160/ch.png',
  turkey: 'https://flagcdn.com/w160/tr.png',
  ukraine: 'https://flagcdn.com/w160/ua.png',
  uruguay: 'https://flagcdn.com/w160/uy.png',
  usa: 'https://flagcdn.com/w160/us.png',
};

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

  // Clean IDs and Names (remove year suffixes like -2014, -1970 and convert dashes to spaces)
  const cleanId = idLower.replace(/-\d{4}$/, '').replace(/-/g, ' ').trim();
  const cleanName = nameLower.replace(/-\d{4}$/, '').replace(/-/g, ' ').trim();

  // Check FlagCDN Mappings for World Cup teams
  if (FLAG_CDN_MAP[cleanId]) return FLAG_CDN_MAP[cleanId];
  if (FLAG_CDN_MAP[cleanName]) return FLAG_CDN_MAP[cleanName];

  for (const countryKey in FLAG_CDN_MAP) {
    if (
      cleanId === countryKey ||
      cleanName === countryKey ||
      (countryKey.length > 3 && (cleanId.includes(countryKey) || cleanName.includes(countryKey)))
    ) {
      return FLAG_CDN_MAP[countryKey];
    }
  }

  if (cleanId === 'usa' || cleanName === 'usa' || cleanId.includes('usa') || cleanName.includes('usa')) {
    return FLAG_CDN_MAP['usa'];
  }

  // Check La Liga Mappings
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

export function getPremierLeagueLogoUrl(): string | undefined {
  for (const path in plLogoGlob) {
    return plLogoGlob[path];
  }
  return undefined;
}

export function getUefaLogoUrl(): string | undefined {
  for (const path in uefaLogoGlob) {
    return uefaLogoGlob[path];
  }
  return undefined;
}

export function getFifaLogoUrl(): string | undefined {
  for (const path in fifaLogoGlob) {
    return fifaLogoGlob[path];
  }
  return undefined;
}
