import {
  getCurrentUserProfile,
  getUserTopArtists,
  getArtistDetails,
  getUserPlaylists,
  UserProfile,
  Artist,
  PaginatedResponse,
} from '../../services/spotifyApi';
import { createSpotifyApiClient } from '../../services/spotifyAuth';

jest.mock('../../services/spotifyAuth');
const mockedCreateSpotifyApiClient = createSpotifyApiClient as jest.MockedFunction<
  typeof createSpotifyApiClient
>;

const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

describe('spotifyApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCreateSpotifyApiClient.mockReturnValue(mockApiClient as any);
  });

  describe('getCurrentUserProfile', () => {
    const mockUserProfile: UserProfile = {
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [{ url: 'https://example.com/image.jpg' }],
      country: 'BR',
      product: 'premium',
      followers: { total: 100 },
      external_urls: { spotify: 'https://open.spotify.com/user/user123' },
    };

    it('deve obter perfil do usuário atual', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockUserProfile });

      const result = await getCurrentUserProfile();

      expect(mockedCreateSpotifyApiClient).toHaveBeenCalledWith(undefined);
      expect(mockApiClient.get).toHaveBeenCalledWith('/me');
      expect(result).toEqual(mockUserProfile);
    });

    it('deve obter perfil do usuário com tokens fornecidos', async () => {
      const mockTokens = {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token',
        scope: 'user-read-private',
      };

      mockApiClient.get.mockResolvedValueOnce({ data: mockUserProfile });

      const result = await getCurrentUserProfile(mockTokens);

      expect(mockedCreateSpotifyApiClient).toHaveBeenCalledWith(mockTokens);
      expect(result).toEqual(mockUserProfile);
    });

    it('deve propagar erro de API', async () => {
      const error = new Error('API Error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(getCurrentUserProfile()).rejects.toThrow(error);
    });
  });

  describe('getUserTopArtists', () => {
    const mockArtistsResponse: PaginatedResponse<Artist> = {
      items: [
        {
          id: 'artist1',
          name: 'Artist 1',
          genres: ['rock', 'pop'],
          images: [{ url: 'https://example.com/artist1.jpg', height: 640, width: 640 }],
          followers: { total: 1000000 },
          popularity: 85,
          external_urls: { spotify: 'https://open.spotify.com/artist/artist1' },
        },
        {
          id: 'artist2',
          name: 'Artist 2',
          genres: ['jazz'],
          images: [{ url: 'https://example.com/artist2.jpg', height: 640, width: 640 }],
          followers: { total: 500000 },
          popularity: 75,
          external_urls: { spotify: 'https://open.spotify.com/artist/artist2' },
        },
      ],
      total: 50,
      limit: 20,
      offset: 0,
      next: 'https://api.spotify.com/v1/me/top/artists?offset=20&limit=20',
      previous: null,
    };

    it('deve obter artistas mais ouvidos com parâmetros padrão', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockArtistsResponse });

      const result = await getUserTopArtists();

      expect(mockApiClient.get).toHaveBeenCalledWith('/me/top/artists', {
        params: {
          limit: 20,
          offset: 0,
          time_range: 'medium_term',
        },
        timeout: 10000,
      });
      expect(result).toEqual(mockArtistsResponse);
    });

    it('deve obter artistas mais ouvidos com parâmetros customizados', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockArtistsResponse });

      const params = { limit: 10, offset: 5 };
      const result = await getUserTopArtists(params);

      expect(mockApiClient.get).toHaveBeenCalledWith('/me/top/artists', {
        params: {
          limit: 10,
          offset: 5,
          time_range: 'medium_term',
        },
        timeout: 10000,
      });
      expect(result).toEqual(mockArtistsResponse);
    });

    it('deve propagar erro de API', async () => {
      const error = new Error('Network Error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(getUserTopArtists()).rejects.toThrow(error);
    });
  });

  describe('getArtistDetails', () => {
    const mockArtist: Artist = {
      id: 'artist1',
      name: 'Test Artist',
      genres: ['rock', 'alternative'],
      images: [{ url: 'https://example.com/artist.jpg', height: 640, width: 640 }],
      followers: { total: 2000000 },
      popularity: 90,
      external_urls: { spotify: 'https://open.spotify.com/artist/artist1' },
    };

    it('deve obter detalhes de um artista específico', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockArtist });

      const result = await getArtistDetails('artist1');

      expect(mockApiClient.get).toHaveBeenCalledWith('/artists/artist1');
      expect(result).toEqual(mockArtist);
    });

    it('deve propagar erro quando artista não é encontrado', async () => {
      const error = new Error('Artist not found');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(getArtistDetails('invalid-id')).rejects.toThrow(error);
    });
  });

  describe('getUserPlaylists', () => {
    const mockPlaylistsResponse = {
      items: [
        {
          id: 'playlist1',
          name: 'My Playlist',
          description: 'A great playlist',
          images: [{ url: 'https://example.com/playlist1.jpg', height: 640, width: 640 }],
          owner: { display_name: 'Test User', id: 'user123' },
          public: true,
          tracks: { total: 25 },
          external_urls: { spotify: 'https://open.spotify.com/playlist/playlist1' },
        },
      ],
      total: 1,
      limit: 20,
      offset: 0,
      next: null,
      previous: null,
    };

    it('deve obter playlists do usuário com parâmetros padrão', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockPlaylistsResponse });

      const result = await getUserPlaylists();

      expect(mockApiClient.get).toHaveBeenCalledWith('/me/playlists', {
        params: {
          limit: 20,
          offset: 0,
        },
      });
      expect(result).toEqual(mockPlaylistsResponse);
    });

    it('deve obter playlists com parâmetros customizados', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockPlaylistsResponse });

      const params = { limit: 20, offset: 10 };
      await getUserPlaylists(params);

      expect(mockApiClient.get).toHaveBeenCalledWith('/me/playlists', {
        params: {
          limit: 20,
          offset: 10,
        },
      });
    });
  });
});
