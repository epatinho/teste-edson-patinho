export const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
export const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

const getRedirectUri = (): string => {
  if (process.env.REACT_APP_REDIRECT_URI) {
    return process.env.REACT_APP_REDIRECT_URI;
  }

  const { protocol, hostname, pathname } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:${window.location.port || '3000'}/callback`;
  } else if (hostname.includes('github.io')) {
    const basePathMatch = pathname.match(/^(\/[^/]+)/);
    const basePath = basePathMatch ? basePathMatch[1] : '';

    return `${protocol}//${hostname}${basePath}/callback`;
  } else {
    return `${protocol}//${hostname}${pathname.split('/').slice(0, -1).join('/')}/callback`;
  }
};

export const REDIRECT_URI = getRedirectUri();

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error('Variáveis de ambiente do Spotify não estão definidas corretamente.');
}

export const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
].join(' ');

export const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
export const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
export const getAuthUrl = (): string => {
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: 'true',
  });

  return `${AUTH_ENDPOINT}?${queryParams.toString()}`;
};
