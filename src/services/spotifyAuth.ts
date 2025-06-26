import axios, { AxiosInstance } from 'axios';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  TOKEN_ENDPOINT,
  SPOTIFY_API_BASE_URL,
} from './spotifyConfig';

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  expires_at?: number;
}

export const getAccessToken = async (code: string): Promise<AuthTokens> => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      throw new Error('Variáveis de ambiente do Spotify não estão definidas corretamente.');
    }

    const response = await axios.post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const expiresAt = Date.now() + response.data.expires_in * 1000;
    const tokenData = { ...response.data, expires_at: expiresAt };

    localStorage.setItem('spotify_tokens', JSON.stringify(tokenData));

    return tokenData;
  } catch (error) {
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      throw new Error('Variáveis de ambiente do Spotify não estão definidas corretamente.');
    }

    const response = await axios.post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const expiresAt = Date.now() + response.data.expires_in * 1000;
    const tokenData = {
      ...response.data,
      refresh_token: response.data.refresh_token || refreshToken,
      expires_at: expiresAt,
    };

    localStorage.setItem('spotify_tokens', JSON.stringify(tokenData));

    return tokenData;
  } catch (error) {
    throw error;
  }
};

export const isTokenExpired = (tokens: AuthTokens): boolean => {
  if (!tokens.expires_at) return true;
  return Date.now() >= tokens.expires_at - 300000;
};

export const createSpotifyApiClient = (tokens?: AuthTokens): AxiosInstance => {
  if (!tokens) {
    const storedTokens = localStorage.getItem('spotify_tokens');
    if (storedTokens) {
      try {
        tokens = JSON.parse(storedTokens);
      } catch (error) {
        localStorage.removeItem('spotify_tokens');
        throw new Error('Tokens inválidos. Por favor, faça login novamente.');
      }
    }
  }

  if (!tokens) {
    throw new Error('Tokens de autenticação não encontrados');
  }

  const apiClient = axios.create({
    baseURL: SPOTIFY_API_BASE_URL,
    headers: {
      Authorization: `${tokens.token_type} ${tokens.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  apiClient.interceptors.request.use(async config => {
    const storedTokens = localStorage.getItem('spotify_tokens');
    if (!storedTokens) {
      throw new Error('Tokens de autenticação não encontrados');
    }

    const currentTokens: AuthTokens = JSON.parse(storedTokens);

    if (isTokenExpired(currentTokens)) {
      try {
        const newTokens = await refreshAccessToken(currentTokens.refresh_token);
        config.headers.Authorization = `${newTokens.token_type} ${newTokens.access_token}`;
      } catch (error) {
        localStorage.removeItem('spotify_tokens');
        throw new Error('Falha na atualização do token. Por favor, faça login novamente.');
      }
    }

    return config;
  });

  apiClient.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        const data = error.response.data;

        if (error.response.status === 401) {
          localStorage.removeItem('spotify_tokens');
        }

        if (data && data.error && data.error.message) {
          error.message = `Spotify API: ${data.error.message}`;
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export const clearTokens = (): void => {
  localStorage.removeItem('spotify_tokens');
};
