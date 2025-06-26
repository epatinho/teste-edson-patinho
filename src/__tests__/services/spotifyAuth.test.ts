import axios from 'axios';
import {
  getAccessToken,
  refreshAccessToken,
  isTokenExpired,
  createSpotifyApiClient,
  AuthTokens,
} from '../../services/spotifyAuth';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const originalEnv = process.env;

describe('spotifyAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  describe('getAccessToken', () => {
    const mockTokenResponse = {
      access_token: 'test-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'test-refresh-token',
      scope: 'user-read-private',
    };

    it('deve obter token de acesso com código de autorização', async () => {
      const mockNow = 1640995200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      mockedAxios.post.mockResolvedValueOnce({ data: mockTokenResponse });

      const result = await getAccessToken('test-code');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.any(URLSearchParams),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      expect(result).toEqual({
        ...mockTokenResponse,
        expires_at: mockNow + 3600000,
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'spotify_tokens',
        JSON.stringify({
          ...mockTokenResponse,
          expires_at: mockNow + 3600000,
        })
      );
    });

    it('deve lançar erro quando variáveis de ambiente não estão definidas', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        new Error('Variáveis de ambiente do Spotify não estão definidas corretamente.')
      );

      delete process.env.REACT_APP_CLIENT_ID;

      await expect(getAccessToken('test-code')).rejects.toThrow(
        'Variáveis de ambiente do Spotify não estão definidas corretamente.'
      );
    });

    it('deve propagar erro de requisição', async () => {
      const error = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(getAccessToken('test-code')).rejects.toThrow(error);
    });
  });

  describe('refreshAccessToken', () => {
    const mockRefreshResponse = {
      access_token: 'new-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'user-read-private',
    };

    it('deve renovar token de acesso', async () => {
      const mockNow = 1640995200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      mockedAxios.post.mockResolvedValueOnce({ data: mockRefreshResponse });

      const result = await refreshAccessToken('test-refresh-token');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.any(URLSearchParams),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      expect(result).toEqual({
        ...mockRefreshResponse,
        refresh_token: 'test-refresh-token',
        expires_at: mockNow + 3600000,
      });
    });

    it('deve usar novo refresh_token quando fornecido na resposta', async () => {
      const mockNow = 1640995200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      const responseWithNewRefreshToken = {
        ...mockRefreshResponse,
        refresh_token: 'new-refresh-token',
      };

      mockedAxios.post.mockResolvedValueOnce({ data: responseWithNewRefreshToken });

      const result = await refreshAccessToken('old-refresh-token');

      expect(result.refresh_token).toBe('new-refresh-token');
    });

    it('deve lançar erro quando variáveis de ambiente não estão definidas', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        new Error('Variáveis de ambiente do Spotify não estão definidas corretamente.')
      );

      delete process.env.REACT_APP_CLIENT_SECRET;

      await expect(refreshAccessToken('test-refresh')).rejects.toThrow(
        'Variáveis de ambiente do Spotify não estão definidas corretamente.'
      );
    });
  });

  describe('isTokenExpired', () => {
    it('deve retornar true quando token não tem expires_at', () => {
      const tokens = {
        access_token: 'test',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test',
        scope: 'test',
      } as AuthTokens;

      expect(isTokenExpired(tokens)).toBe(true);
    });

    it('deve retornar true quando token está expirado', () => {
      const tokens = {
        access_token: 'test',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test',
        scope: 'test',
        expires_at: Date.now() - 1000,
      } as AuthTokens;

      expect(isTokenExpired(tokens)).toBe(true);
    });

    it('deve retornar true quando token está próximo do vencimento (menos de 5 minutos)', () => {
      const tokens = {
        access_token: 'test',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test',
        scope: 'test',
        expires_at: Date.now() + 200000,
      } as AuthTokens;

      expect(isTokenExpired(tokens)).toBe(true);
    });

    it('deve retornar false quando token ainda é válido', () => {
      const mockNow = 1640995200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      const tokens = {
        access_token: 'test',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test',
        scope: 'test',
        expires_at: mockNow + 600000,
      } as AuthTokens;

      expect(isTokenExpired(tokens)).toBe(false);

      jest.restoreAllMocks();
    });
  });

  describe('createSpotifyApiClient', () => {
    const mockTokens = {
      access_token: 'test-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'test-refresh-token',
      scope: 'user-read-private',
      expires_at: Date.now() + 600000,
    } as AuthTokens;

    beforeEach(() => {
      mockedAxios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      });
    });

    it('deve criar cliente API com tokens fornecidos', () => {
      createSpotifyApiClient(mockTokens);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.spotify.com/v1',
        headers: {
          Authorization: 'Bearer test-access-token',
          'Content-Type': 'application/json',
        },
      });
    });

    it('deve criar cliente API com tokens do localStorage quando não fornecidos', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockTokens));

      createSpotifyApiClient();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('spotify_tokens');
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.spotify.com/v1',
        headers: {
          Authorization: 'Bearer test-access-token',
          'Content-Type': 'application/json',
        },
      });
    });

    it('deve lançar erro quando não há tokens válidos', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      expect(() => createSpotifyApiClient()).toThrow('Tokens de autenticação não encontrados');
    });

    it('deve limpar localStorage e lançar erro quando tokens são inválidos', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid-json');

      expect(() => createSpotifyApiClient()).toThrow(
        'Tokens inválidos. Por favor, faça login novamente.'
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('spotify_tokens');
    });
  });
});
