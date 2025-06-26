import {} from '../../services/spotifyConfig';

const originalEnv = process.env;

Object.defineProperty(window, 'location', {
  value: {
    protocol: 'https:',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
  },
  writable: true,
});

describe('spotifyConfig', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      REACT_APP_CLIENT_ID: 'test-client-id',
      REACT_APP_CLIENT_SECRET: 'test-client-secret',
      REACT_APP_REDIRECT_URI: 'http://localhost:3000/callback',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('variáveis de configuração', () => {
    it('deve exportar as constantes corretas', () => {
      const {
        AUTH_ENDPOINT,
        TOKEN_ENDPOINT,
        SPOTIFY_API_BASE_URL,
      } = require('../../services/spotifyConfig');

      expect(AUTH_ENDPOINT).toBe('https://accounts.spotify.com/authorize');
      expect(TOKEN_ENDPOINT).toBe('https://accounts.spotify.com/api/token');
      expect(SPOTIFY_API_BASE_URL).toBe('https://api.spotify.com/v1');
    });

    it('deve definir os escopos corretos', () => {
      const { SCOPES } = require('../../services/spotifyConfig');

      const expectedScopes = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-private',
        'playlist-modify-public',
      ].join(' ');

      expect(SCOPES).toBe(expectedScopes);
    });
  });

  describe('getAuthUrl', () => {
    it('deve gerar URL de autenticação correta', () => {
      const { getAuthUrl, AUTH_ENDPOINT } = require('../../services/spotifyConfig');

      const authUrl = getAuthUrl();

      expect(authUrl).toContain(AUTH_ENDPOINT);
      expect(authUrl).toContain('response_type=code');
      expect(authUrl).toContain('show_dialog=true');
    });

    it('deve incluir redirect_uri na URL', () => {
      const { getAuthUrl } = require('../../services/spotifyConfig');

      const authUrl = getAuthUrl();
      expect(authUrl).toContain('redirect_uri=');
    });
  });
});
