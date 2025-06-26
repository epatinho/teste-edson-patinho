import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import * as spotifyAuth from '../../services/spotifyAuth';
import * as spotifyApi from '../../services/spotifyApi';
import * as spotifyConfig from '../../services/spotifyConfig';

jest.mock('../../services/spotifyAuth', () => ({
  getAccessToken: jest.fn(),
  clearTokens: jest.fn(),
  createSpotifyApiClient: jest.fn(),
}));

jest.mock('../../services/spotifyApi', () => ({
  getCurrentUserProfile: jest.fn(),
}));

jest.mock('../../services/spotifyConfig', () => ({
  getAuthUrl: jest.fn(),
}));

const TestComponent = () => {
  const { isAuthenticated, user, login, logout, error, isLoading } = useAuth();

  return (
    <div>
      {isLoading && <div data-testid="loading">Carregando...</div>}
      {isAuthenticated ? (
        <>
          <div data-testid="authenticated">Usuário autenticado: {user?.display_name}</div>
          <button onClick={logout} data-testid="logout-button">
            Sair
          </button>
        </>
      ) : (
        <>
          <div data-testid="unauthenticated">Usuário não autenticado</div>
          <button onClick={login} data-testid="login-button">
            Login
          </button>
        </>
      )}
      {error && <div data-testid="error">Erro: {error}</div>}
    </div>
  );
};

describe('AuthContext', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  test('deve iniciar como não autenticado quando não há tokens', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(await screen.findByTestId('unauthenticated')).toBeInTheDocument();
  });

  test('deve chamar getAuthUrl quando o login é acionado', async () => {
    const mockAuthUrl = 'https://accounts.spotify.com/authorize?client_id=abc';
    (spotifyConfig.getAuthUrl as jest.Mock).mockReturnValue(mockAuthUrl);

    delete (window as any).location;
    (window as any).location = { ...originalLocation, href: '' };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = await screen.findByTestId('login-button');
    await userEvent.click(loginButton);

    expect(spotifyConfig.getAuthUrl).toHaveBeenCalled();
    expect(window.location.href).toBe(mockAuthUrl);
  });

  test('deve chamar clearTokens quando o logout é acionado', async () => {
    localStorage.setItem(
      'spotify_tokens',
      JSON.stringify({
        access_token: 'fake-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'fake-refresh',
        scope: 'user-read-private',
        expires_at: Date.now() + 3600000,
      })
    );

    (spotifyApi.getCurrentUserProfile as jest.Mock).mockResolvedValue({
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [],
      country: 'BR',
      product: 'premium',
      followers: { total: 10 },
      external_urls: { spotify: 'https://spotify.com/user' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toBeInTheDocument();
    });

    const logoutButton = await screen.findByTestId('logout-button');
    await userEvent.click(logoutButton);

    expect(spotifyAuth.clearTokens).toHaveBeenCalled();
    await screen.findByTestId('unauthenticated');
  });

  test('deve processar o código de autenticação corretamente', async () => {
    const mockTokens = {
      access_token: 'new-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'new-refresh',
      scope: 'user-read-private',
      expires_at: Date.now() + 3600000,
    };
    const mockUserProfile = {
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [],
      country: 'BR',
      product: 'premium',
      followers: { total: 10 },
      external_urls: { spotify: 'https://spotify.com/user' },
    };
    (spotifyAuth.getAccessToken as jest.Mock).mockResolvedValue(mockTokens);
    (spotifyApi.getCurrentUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

    const TestCallbackComponent = () => {
      const { isAuthenticated, error, handleAuthCallback } = useAuth();
      return (
        <div>
          <button data-testid="callback-btn" onClick={() => handleAuthCallback('test-auth-code')}>
            Callback
          </button>
          {isAuthenticated && <div data-testid="success">Autenticado com sucesso</div>}
          {error && <div data-testid="error">Erro: {error}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestCallbackComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByTestId('callback-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('success')).toBeInTheDocument();
    });

    expect(spotifyAuth.getAccessToken).toHaveBeenCalledWith('test-auth-code');
    expect(spotifyApi.getCurrentUserProfile).toHaveBeenCalled();
  });

  test('deve exibir mensagem de erro quando a autenticação falha', async () => {
    (spotifyAuth.getAccessToken as jest.Mock).mockRejectedValue(new Error('Falha na API'));
    const TestErrorComponent = () => {
      const { error, handleAuthCallback } = useAuth();
      return (
        <div>
          <button data-testid="callback-btn" onClick={() => handleAuthCallback('invalid-code')}>
            Callback
          </button>
          {error && <div data-testid="error">Erro: {error}</div>}
        </div>
      );
    };
    render(
      <AuthProvider>
        <TestErrorComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByTestId('callback-btn'));

    const errorElement = await screen.findByTestId('error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(
      'Erro: Falha na autenticação. Por favor, tente novamente.'
    );
    expect(spotifyAuth.clearTokens).toHaveBeenCalled();
  });

  test('deve lidar com a expiração da sessão ao inicializar', async () => {
    localStorage.setItem(
      'spotify_tokens',
      JSON.stringify({
        access_token: 'expired-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'fake-refresh',
        scope: 'user-read-private',
        expires_at: Date.now() - 3600000,
      })
    );

    (spotifyApi.getCurrentUserProfile as jest.Mock).mockRejectedValue(new Error('Token expirado'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const errorElement = await screen.findByTestId('error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(
      'Erro: Sessão expirada. Por favor, faça login novamente.'
    );

    expect(spotifyAuth.clearTokens).toHaveBeenCalled();
    expect(await screen.findByTestId('unauthenticated')).toBeInTheDocument();
  });

  test('deve inicializar corretamente quando há tokens válidos', async () => {
    localStorage.setItem(
      'spotify_tokens',
      JSON.stringify({
        access_token: 'valid-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'valid-refresh',
        scope: 'user-read-private',
        expires_at: Date.now() + 3600000,
      })
    );

    const mockUserProfile = {
      id: 'user456',
      display_name: 'Valid User',
      email: 'valid@example.com',
      images: [{ url: 'https://example.com/avatar.jpg' }],
      country: 'BR',
      product: 'premium',
      followers: { total: 42 },
      external_urls: { spotify: 'https://open.spotify.com/user/user456' },
    };

    (spotifyApi.getCurrentUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const authenticatedElement = await screen.findByTestId('authenticated');
    expect(authenticatedElement).toBeInTheDocument();
    expect(authenticatedElement).toHaveTextContent(
      `Usuário autenticado: ${mockUserProfile.display_name}`
    );
    expect(spotifyApi.getCurrentUserProfile).toHaveBeenCalled();
  });
});
