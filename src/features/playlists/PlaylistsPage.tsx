import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, Flex, Heading, Text, Image, Center, LinkBox } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  getUserPlaylists,
  createPlaylist,
  Playlist,
  PaginationParams,
} from '../../services/spotifyApi';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';

const Spinner = () => (
  <span
    style={{
      display: 'inline-block',
      width: 32,
      height: 32,
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #38a169',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }}
  />
);
const Alert = ({ status, children, ...rest }: any) => (
  <div
    style={{
      background: status === 'error' ? '#fed7d7' : '#bee3f8',
      color: status === 'error' ? '#c53030' : '#2b6cb0',
      borderRadius: 8,
      padding: 16,
      marginBottom: 32,
      display: 'flex',
      alignItems: 'center',
      ...rest.style,
    }}
  >
    {children}
  </div>
);
const AlertIcon = ({ status }: any) => (
  <span style={{ marginRight: 8 }}>{status === 'error' ? '❌' : 'ℹ️'}</span>
);
const Switch = ({ isChecked, onChange }: any) => (
  <input type="checkbox" checked={isChecked} onChange={onChange} style={{ marginLeft: 8 }} />
);
const Modal = ({ isOpen, onClose, children }: any) =>
  isOpen ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#303030',
          borderRadius: 8,
          maxWidth: 600,
          maxHeight: 500,
          margin: '30vh auto',
          padding: 24,
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 8, right: 8, color: 'white', marginRight: 10 }}
        >
          X
        </button>
      </div>
    </div>
  ) : null;

const PlaylistsPage: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const toast = (opts: any) => window.alert(`${opts.title}: ${opts.description}`);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const loadInitialPlaylists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: PaginationParams = { limit, offset: 0 };
      const response = await getUserPlaylists(params);
      setPlaylists(response.items);
      setHasMore(!!response.next);
      setOffset(limit);
    } catch (err) {
      setError('Não foi possível carregar suas playlists. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePlaylists = useCallback(async () => {
    try {
      const params: PaginationParams = { limit, offset };
      const response = await getUserPlaylists(params);
      setPlaylists(prevPlaylists => [...prevPlaylists, ...response.items]);
      setHasMore(!!response.next);
      setOffset(offset + limit);
    } catch (err) {}
  }, [offset, limit]);

  const handleCreatePlaylist = async () => {
    if (!user || !user.id) {
      toast({
        title: 'Erro',
        description: 'Usuário não autenticado',
        status: 'error',
      });
      return;
    }
    if (!newPlaylistName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, informe um nome para a playlist',
        status: 'warning',
      });
      return;
    }
    try {
      setIsCreating(true);
      const newPlaylist = await createPlaylist(
        user.id,
        newPlaylistName,
        newPlaylistDescription,
        newPlaylistPublic
      );
      setPlaylists([newPlaylist, ...playlists]);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setNewPlaylistPublic(false);
      onClose();
      toast({
        title: 'Playlist criada',
        description: `A playlist "${newPlaylist.name}" foi criada com sucesso`,
        status: 'success',
      });
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a playlist. Tente novamente mais tarde.',
        status: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    loadInitialPlaylists();
  }, []);

  useEffect(() => {
    if (hasMore && !isLoading) {
      const checkAndLoadMore = () => {
        if (!scrollContainerRef.current) return;

        const container = document.getElementById('scrollableDiv');
        if (!container) return;

        const contentHeight = container.scrollHeight;
        const containerHeight = container.clientHeight;

        if (contentHeight <= containerHeight * 1.2) {
          loadMorePlaylists();
        }
      };

      setTimeout(checkAndLoadMore, 300);
    }
  }, [playlists, hasMore, isLoading, loadMorePlaylists]);

  const PlaylistCard = ({ playlist }: { playlist: Playlist }) => (
    <LinkBox
      overflow="hidden"
      style={{
        marginBottom: 16,
        display: 'block',
        textDecoration: 'none',
        width: '100%',
      }}
    >
      <Flex alignItems="center" p={4}>
        <Image
          src={
            Array.isArray(playlist.images) && playlist.images[0]?.url
              ? playlist.images[0].url
              : '/logo512.png'
          }
          alt={`Capa da playlist ${playlist.name}`}
          width="60px"
          height="60px"
          objectFit="cover"
          borderRadius="md"
          mr={4}
        />
        <Box>
          <Heading
            size="md"
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {playlist.name}
          </Heading>
          <Text fontSize="sm" color="white">
            {playlist.owner.display_name} • {playlist.tracks.total}{' '}
            {playlist.tracks.total === 1 ? 'faixa' : 'faixas'}
          </Text>
        </Box>
      </Flex>
    </LinkBox>
  );

  return (
    <Layout>
      <Box py={6}>
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Minhas Playlists
            </Heading>
            <Text fontSize="md" mb={8} color="white">
              Sua coleção pessoal de playlists
            </Text>
          </Box>
          <Button
            onClick={onOpen}
            bg="#57B660"
            size="md"
            borderRadius="24px"
            display="flex"
            flexDirection="row"
            alignItems="center"
            padding="10px 60px"
            gap="10px"
            width="133px"
            height="42px"
            color="#000000"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg', color: 'white' }}
            _active={{ transform: 'translateY(0)' }}
          >
            Criar playlist
          </Button>
        </Flex>
        {isLoading && (
          <Center py={10}>
            <Spinner />
          </Center>
        )}
        {error && (
          <Alert status="error">
            <AlertIcon status="error" />
            {error}
          </Alert>
        )}
        {!isLoading && playlists.length === 0 && !error && (
          <Alert status="info">
            <AlertIcon status="info" />
            Você não tem nenhuma playlist. Crie sua primeira playlist agora!
          </Alert>
        )}
        {playlists.length > 0 && (
          <Box
            id="scrollableDiv"
            ref={scrollContainerRef}
            height="calc(100vh - 250px)"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#555', borderRadius: '4px' },
            }}
          >
            <InfiniteScroll
              dataLength={playlists.length}
              next={loadMorePlaylists}
              hasMore={hasMore}
              loader={
                <Center py={5}>
                  <Spinner />
                </Center>
              }
              endMessage={
                <Text textAlign="center" my={5} color="gray.500">
                  Você viu todas as suas playlists!
                </Text>
              }
              scrollableTarget="scrollableDiv"
              scrollThreshold={0.8}
              style={{ overflow: 'hidden' }}
            >
              <Box width="100%">
                {playlists.map(playlist => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </Box>
            </InfiniteScroll>
          </Box>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <div style={{ alignItems: 'center', marginBottom: 16 }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '20%',
              marginBottom: 16,
              width: '100%',
              textAlign: 'center',
            }}
          >
            Dê um nome a sua playlist
          </label>
          <input
            value={newPlaylistName}
            onChange={e => setNewPlaylistName(e.target.value)}
            placeholder="Minha playlist #1"
            style={{
              width: '100%',
              padding: 8,
              marginTop: 4,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #ccc',
              color: '#fff',
              outline: 'none',
              textAlign: 'center',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <label style={{ marginRight: 8 }}>Tornar pública?</label>
          <Switch
            isChecked={newPlaylistPublic}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPlaylistPublic(e.target.checked)
            }
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleCreatePlaylist}
            disabled={isCreating}
            bg="#57B660"
            size="md"
            borderRadius="24px"
            display="flex"
            flexDirection="row"
            alignItems="center"
            padding="10px 60px"
            gap="10px"
            width="133px"
            height="42px"
            color="#000000"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg', color: 'white' }}
            _active={{ transform: 'translateY(0)' }}
          >
            {isCreating ? 'Criando...' : 'Criar Playlist'}
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default PlaylistsPage;
