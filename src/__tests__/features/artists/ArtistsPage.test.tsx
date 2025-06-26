import React from 'react';
import { render, screen } from '@testing-library/react';
import ArtistsPage from '../../../features/artists/ArtistsPage';
import { useAuth } from '../../../context/AuthContext';
import { getUserTopArtists } from '../../../services/spotifyApi';

jest.mock('../../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('../../../services/spotifyApi');
const mockGetUserTopArtists = getUserTopArtists as jest.MockedFunction<typeof getUserTopArtists>;

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
  Spinner: (props: any) => (
    <div role="status" {...props}>
      Loading...
    </div>
  ),
  Center: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Image: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
  VStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('../../../components/common/ChakraPolyfill', () => ({
  AlertIcon: () => <div data-testid="alert-icon">!</div>,
}));

jest.mock(
  'react-router-dom',
  () => ({
    Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }),
  { virtual: true }
);

describe('ArtistsPage', () => {
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

    mockGetUserTopArtists.mockImplementation(() => new Promise(() => {}));

    render(<ArtistsPage />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
