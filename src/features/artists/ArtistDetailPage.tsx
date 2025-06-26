import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Image, Spinner, Center, Button, VStack, Flex } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../../components/common/Layout';
import { formatReleaseDate } from '../../utils/formatters';
import {
  getArtistDetails,
  getArtistAlbums,
  Artist,
  Album,
  PaginationParams,
} from '../../services/spotifyApi';

const ArtistDetailPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const ArrowLeftIcon = () => React.createElement(FaArrowLeft as any);

  useEffect(() => {
    const loadArtistDetails = async () => {
      if (!artistId) return;

      try {
        setIsLoading(true);
        setError(null);

        const artistData = await getArtistDetails(artistId);
        setArtist(artistData);
      } catch (err) {
        setError(
          'Não foi possível carregar os detalhes deste artista. Tente novamente mais tarde.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadArtistDetails();
  }, [artistId]);

  useEffect(() => {
    const loadArtistAlbums = async () => {
      if (!artistId) return;

      try {
        setIsLoadingAlbums(true);

        const params: PaginationParams = { limit, offset: 0 };
        const response = await getArtistAlbums(artistId, params);

        setAlbums(response.items);
        setHasMore(!!response.next);
        setOffset(limit);
      } catch (err) {
        setError('Não foi possível carregar os álbuns deste artista. Tente novamente mais tarde.');
        setHasMore(false);
      } finally {
        setIsLoadingAlbums(false);
      }
    };

    void loadArtistAlbums();
  }, [artistId]);

  const loadMoreAlbums = useCallback(async () => {
    if (!artistId) return;

    try {
      const params: PaginationParams = { limit, offset };
      const response = await getArtistAlbums(artistId, params);

      const uniqueAlbums = response.items.filter(
        newAlbum => !albums.some(existingAlbum => existingAlbum.id === newAlbum.id)
      );

      setAlbums(prevAlbums => [...prevAlbums, ...uniqueAlbums]);
      setHasMore(!!response.next);
      setOffset(offset + limit);
    } catch (err) {
      setHasMore(false);
    }
  }, [artistId, albums, limit, offset]);

  useEffect(() => {
    if (hasMore && !isLoadingAlbums && albums.length > 0) {
      const checkAndLoadMore = () => {
        const container = document.getElementById('scrollableDiv');
        if (!container) return;

        const contentHeight = container.scrollHeight;
        const containerHeight = container.clientHeight;

        if (contentHeight <= containerHeight * 1.2) {
          loadMoreAlbums();
        }
      };

      setTimeout(checkAndLoadMore, 300);
    }
  }, [albums, hasMore, isLoadingAlbums, loadMoreAlbums]);

  const AlbumCard = ({ album }: { album: Album }) => (
    <Box display="flex" alignItems="center" p={3} overflow="hidden">
      <Image
        src={album.images[0]?.url || '/placeholder-album.png'}
        alt={`Capa do álbum ${album.name}`}
        boxSize={{ base: '60px', md: '80px' }}
        objectFit="cover"
        mr={4}
        borderRadius="md"
      />
      <Box flex="1">
        <Heading size="sm" truncate>
          {album.name}
        </Heading>
        <Text fontSize="sm" color="gray.400" mt={1}>
          {formatReleaseDate(album.release_date)}
        </Text>
      </Box>
    </Box>
  );

  const AlertBox = ({
    status,
    children,
    ...props
  }: {
    status: 'error' | 'info';
    children: React.ReactNode;
  }) => (
    <Box
      borderRadius="md"
      mb={status === 'error' ? 8 : 0}
      p={4}
      bg={status === 'error' ? 'red.100' : 'blue.100'}
      color={status === 'error' ? 'red.800' : 'blue.800'}
      borderWidth="1px"
      borderColor={status === 'error' ? 'red.300' : 'blue.300'}
      {...props}
    >
      <strong>{status === 'error' ? 'Erro: ' : 'Info: '}</strong> {children}
    </Box>
  );

  if (isLoading) {
    return (
      <Layout>
        <Center py={10}>
          <Spinner colorScheme="green" size="xl" />
        </Center>
      </Layout>
    );
  }

  if (error || !artist) {
    return (
      <Layout>
        <AlertBox status="error">{error || 'Artista não encontrado.'}</AlertBox>
        <RouterLink to="/artists">
          <Button variant="outline" size="sm">
            <ArrowLeftIcon />
            <Box as="span" ml={2}>
              Voltar para Artistas
            </Box>
          </Button>
        </RouterLink>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box py={6}>
        <Box mb={8}>
          <Flex align="center" justify="space-between">
            <RouterLink to="/artists">
              <Button size="lg" color="white">
                <ArrowLeftIcon />
                <Box as="span" ml={2}>
                  {artist.name}
                </Box>
              </Button>
            </RouterLink>
            <Image
              src={artist.images?.[0]?.url || '/placeholder-artist.png'}
              alt={artist.name}
              boxSize="56px"
              borderRadius="full"
              ml={4}
              objectFit="cover"
            />
          </Flex>
        </Box>

        {isLoadingAlbums && albums.length === 0 ? (
          <Center py={10}>
            <Spinner colorScheme="blue" size="lg" />
          </Center>
        ) : albums.length === 0 ? (
          <AlertBox status="info">Nenhum álbum encontrado para este artista.</AlertBox>
        ) : (
          <Box
            id="scrollableDiv"
            ref={scrollableDivRef}
            height="calc(100vh - 250px)"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#555', borderRadius: '4px' },
            }}
          >
            <InfiniteScroll
              dataLength={albums.length}
              next={loadMoreAlbums}
              hasMore={hasMore}
              loader={
                <Center py={5}>
                  <Spinner colorScheme="blue" />
                </Center>
              }
              endMessage={
                <Text textAlign="center" my={5} color="gray.500">
                  Você já viu todos os álbuns deste artista!
                </Text>
              }
              scrollableTarget="scrollableDiv"
              scrollThreshold={0.8}
              style={{ overflow: 'hidden' }}
            >
              <VStack gap={4} align="stretch">
                {albums.map(album => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </VStack>
            </InfiniteScroll>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default ArtistDetailPage;
