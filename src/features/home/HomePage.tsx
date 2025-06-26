import React from 'react';
import { Box, Text } from '@chakra-ui/react';

import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Layout>
      <Box py={6}>
        {!(isAuthenticated && user) && (
          <Text fontSize="lg" color="gray.600">
            Faça login com sua conta do Spotify para explorar seus artistas, álbuns e playlists
            favoritos.
          </Text>
        )}
      </Box>
    </Layout>
  );
};

export default HomePage;
