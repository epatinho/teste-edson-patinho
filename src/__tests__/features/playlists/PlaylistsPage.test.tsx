import React from 'react';
import { render, screen } from '@testing-library/react';
import PlaylistsPage from '../../../features/playlists/PlaylistsPage';
import { useAuth } from '../../../context/AuthContext';
import { getUserPlaylists } from '../../../services/spotifyApi';

jest.mock('../../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('../../../services/spotifyApi');
const mockGetUserPlaylists = getUserPlaylists as jest.MockedFunction<typeof getUserPlaylists>;

jest.mock('../../../components/common/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('react-infinite-scroll-component', () => {
  return function MockInfiniteScroll({ children }: { children: React.ReactNode }) {
    return <div data-testid="infinite-scroll">{children}</div>;
  };
});

jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  Text: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Center: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Image: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
  VStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  SimpleGrid: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  LinkBox: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('PlaylistsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar layout corretamente', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      tokens: { access_token: 'test-token' } as any,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      error: null,
      handleAuthCallback: jest.fn(),
    });

    mockGetUserPlaylists.mockImplementation(() => new Promise(() => {}));

    render(<PlaylistsPage />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
