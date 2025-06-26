import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ColorModeProvider } from './components/common/ChakraPolyfill';
import HomePage from './features/home/HomePage';
import LoginPage from './features/auth/LoginPage';
import CallbackPage from './features/auth/CallbackPage';
import ArtistsPage from './features/artists/ArtistsPage';
import ArtistDetailPage from './features/artists/ArtistDetailPage';
import PlaylistsPage from './features/playlists/PlaylistsPage';
import ProfilePage from './features/user/ProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppWrapper: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    const isSpotifyCallback = window.location.pathname === '/callback';

    if (code && isSpotifyCallback) {
      window.location.href = `${window.location.origin}/#/callback?code=${code}`;
      return;
    }

    if (code && !window.location.hash) {
      window.location.href = `${window.location.origin}/#/callback?code=${code}`;
    }
  }, []);

  return <MainApp />;
};

const MainApp: React.FC = () => {
  return (
    <ColorModeProvider>
      <AuthProvider>
        <ChakraProvider value={defaultSystem}>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/callback/*" element={<CallbackPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artists"
                element={
                  <ProtectedRoute>
                    <ArtistsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artists/:artistId"
                element={
                  <ProtectedRoute>
                    <ArtistDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/playlists"
                element={
                  <ProtectedRoute>
                    <PlaylistsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </ChakraProvider>
      </AuthProvider>
    </ColorModeProvider>
  );
};

function App() {
  return <AppWrapper />;
}

export default App;
