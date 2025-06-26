import { AxiosInstance } from 'axios';
import { createSpotifyApiClient, AuthTokens } from './spotifyAuth';

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
  country: string;
  product: string;
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  followers: { total: number };
  popularity: number;
  external_urls: { spotify: string };
}

export interface Album {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  release_date: string;
  total_tracks: number;
  artists: { id: string; name: string }[];
  external_urls: { spotify: string };
}

export interface Track {
  id: string;
  name: string;
  duration_ms: number;
  artists: { id: string; name: string }[];
  album: Album;
  external_urls: { spotify: string };
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string; height: number; width: number }[];
  owner: { display_name: string; id: string };
  public: boolean;
  tracks: { total: number };
  external_urls: { spotify: string };
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

const getApiClient = (tokens?: AuthTokens): AxiosInstance => {
  return createSpotifyApiClient(tokens);
};

export const getCurrentUserProfile = async (tokens?: AuthTokens): Promise<UserProfile> => {
  const apiClient = getApiClient(tokens);
  const response = await apiClient.get<UserProfile>('/me');
  return response.data;
};

export const getUserTopArtists = async (
  params: PaginationParams = {},
  tokens?: AuthTokens
): Promise<PaginatedResponse<Artist>> => {
  try {
    const apiClient = getApiClient(tokens);
    const { limit = 20, offset = 0 } = params;

    const response = await apiClient.get<PaginatedResponse<Artist>>('/me/top/artists', {
      params: {
        limit,
        offset,
        time_range: 'medium_term',
      },
      timeout: 10000, // Timeout de 10 segundos
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArtistDetails = async (artistId: string, tokens?: AuthTokens): Promise<Artist> => {
  const apiClient = getApiClient(tokens);
  const response = await apiClient.get<Artist>(`/artists/${artistId}`);
  return response.data;
};

export const getArtistAlbums = async (
  artistId: string,
  params: PaginationParams = {}
): Promise<PaginatedResponse<Album>> => {
  const apiClient = getApiClient();
  const { limit = 20, offset = 0 } = params;

  const response = await apiClient.get<PaginatedResponse<Album>>(`/artists/${artistId}/albums`, {
    params: {
      limit,
      offset,
      include_groups: 'album,single',
    },
  });

  return response.data;
};

export const getAlbumDetails = async (albumId: string): Promise<Album> => {
  const apiClient = getApiClient();
  const response = await apiClient.get<Album>(`/albums/${albumId}`);
  return response.data;
};

export const getUserPlaylists = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Playlist>> => {
  const apiClient = getApiClient();
  const { limit = 20, offset = 0 } = params;

  const response = await apiClient.get<PaginatedResponse<Playlist>>('/me/playlists', {
    params: { limit, offset },
  });

  return response.data;
};

export const getPlaylistDetails = async (playlistId: string): Promise<Playlist> => {
  const apiClient = getApiClient();
  const response = await apiClient.get<Playlist>(`/playlists/${playlistId}`);
  return response.data;
};

export const createPlaylist = async (
  userId: string,
  name: string,
  description: string = '',
  isPublic: boolean = false
): Promise<Playlist> => {
  const apiClient = getApiClient();
  const response = await apiClient.post<Playlist>(`/users/${userId}/playlists`, {
    name,
    description,
    public: isPublic,
  });

  return response.data;
};

export const addTracksToPlaylist = async (
  playlistId: string,
  trackUris: string[]
): Promise<{ snapshot_id: string }> => {
  const apiClient = getApiClient();
  const response = await apiClient.post<{ snapshot_id: string }>(
    `/playlists/${playlistId}/tracks`,
    { uris: trackUris }
  );

  return response.data;
};
