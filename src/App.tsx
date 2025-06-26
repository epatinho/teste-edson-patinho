import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <ColorModeProvider>
      <AuthProvider>
        <ChakraProvider value={defaultSystem}>
          <BrowserRouter>
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
          </BrowserRouter>
        </ChakraProvider>
      </AuthProvider>
    </ColorModeProvider>
  );
}

export default App;
