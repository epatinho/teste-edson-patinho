import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Heading, Text, Spinner, Center, Image, VStack, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { getUserTopArtists, Artist, PaginationParams } from '../../services/spotifyApi';
import Layout from '../../components/common/Layout';
import { AlertIcon } from '../../components/common/ChakraPolyfill';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../../context/AuthContext';

const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const { isAuthenticated, tokens } = useAuth();
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {}, [isAuthenticated, tokens]);

  const loadArtists = useCallback(
    async (isInitialLoad: boolean = false) => {
      try {
        if (isInitialLoad) {
          setIsLoading(true);
          setOffset(0);
        } else {
          if (loadingMore) {
            return;
          }
          setLoadingMore(true);
        }

        setError(null);

        const params: PaginationParams = { limit, offset: isInitialLoad ? 0 : offset };
        const response = await getUserTopArtists(params);

        if (isInitialLoad) {
          setArtists(response.items);
        } else {
          setArtists(prevArtists => [...prevArtists, ...response.items]);
        }

        if (!response.next || response.items.length < limit) {
          setHasMore(false);
        } else {
          setOffset(prevOffset => prevOffset + limit);
        }
      } catch (err) {
        setError('Não foi possível carregar seus artistas favoritos. Tente novamente mais tarde.');
      } finally {
        if (isInitialLoad) {
          setIsLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [offset, limit, loadingMore]
  );

  const fetchMoreArtists = useCallback(() => {
    if (!isLoading && !loadingMore && hasMore) {
      loadArtists(false);
    }
  }, [isLoading, loadingMore, hasMore, loadArtists]);

  useEffect(() => {
    if (isAuthenticated && tokens) {
      loadArtists(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, tokens]);

  useEffect(() => {
    if (hasMore && !isLoading && !loadingMore && artists.length > 0) {
      const checkAndLoadMore = () => {
        const container = document.getElementById('scrollableDiv');
        if (!container) return;

        const contentHeight = container.scrollHeight;
        const containerHeight = container.clientHeight;

        if (contentHeight <= containerHeight * 1.2) {
          fetchMoreArtists();
        }
      };

      setTimeout(checkAndLoadMore, 300);
    }
  }, [artists, hasMore, isLoading, loadingMore, fetchMoreArtists]);

  return (
    <Layout>
      <Box py={6} height="100%">
        <Heading as="h1" size="xl" mb={2}>
          Top Artistas
        </Heading>

        <Text fontSize="md" mb={8} color="white">
          Aqui você encontra seus artistas preferidos
        </Text>

        {isLoading && artists.length === 0 && (
          <Center py={10}>
            <Spinner color="green.500" size="xl" />
          </Center>
        )}

        {error && artists.length === 0 && (
          <Box bg="red.100" borderRadius="md" mb={8} p={4} display="flex" alignItems="center">
            <AlertIcon />
            <Text color="red.800" ml={2}>
              {error}
            </Text>
          </Box>
        )}

        {!isLoading && artists.length === 0 && !error && (
          <Box bg="blue.100" borderRadius="md" mb={8} p={4} display="flex" alignItems="center">
            <AlertIcon />
            <Text color="blue.800" ml={2}>
              Não encontramos dados de artistas favoritos na sua conta. Talvez você precise ouvir
              mais música no Spotify para gerar esses dados.
            </Text>
          </Box>
        )}

        {artists.length > 0 && (
          <Box
            id="scrollableDiv"
            height="calc(100vh - 180px)"
            overflowY="auto"
            pr={2}
            ref={scrollableDivRef}
          >
            <InfiniteScroll
              dataLength={artists.length}
              next={fetchMoreArtists}
              hasMore={hasMore}
              loader={
                <Center py={4}>
                  <Spinner color="green.500" />
                </Center>
              }
              endMessage={
                <Text textAlign="center" fontSize="sm" color="gray.500" py={4}>
                  Você já viu todos seus artistas favoritos!
                </Text>
              }
              scrollableTarget="scrollableDiv"
              scrollThreshold="200px"
            >
              <VStack gap={4} align="stretch" width="100%" pb={4}>
                {artists.map(artist => (
                  <RouterLink
                    to={`/artists/${artist.id}`}
                    style={{ textDecoration: 'none' }}
                    key={artist.id}
                  >
                    <Flex
                      py={3}
                      px={4}
                      alignItems="center"
                      gap={4}
                      _hover={{
                        bg: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 'md',
                      }}
                    >
                      <Image
                        src={
                          artist.images?.[0]?.url || `${process.env.PUBLIC_URL}/spotify-logo.png`
                        }
                        alt={`Foto de ${artist.name}`}
                        boxSize="50px"
                        borderRadius="full"
                        objectFit="cover"
                      />
                      <Text fontWeight="medium" fontSize="md" color="white">
                        {artist.name}
                      </Text>
                    </Flex>
                  </RouterLink>
                ))}
              </VStack>
            </InfiniteScroll>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default ArtistsPage;
