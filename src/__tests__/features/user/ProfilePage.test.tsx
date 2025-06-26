import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../../../features/user/ProfilePage';
import { useAuth } from '../../../context/AuthContext';

jest.mock('../../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('../../../components/common/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  Text: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Image: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Center: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('ProfilePage', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar mensagem de carregamento quando user é null', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: mockLogout,
      isAuthenticated: true,
      login: jest.fn(),
      isLoading: false,
      error: null,
      handleAuthCallback: jest.fn(),
      tokens: null,
    });

    render(<ProfilePage />);

    expect(screen.getByText(/carregando informações do usuário/i)).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('deve renderizar informações do usuário quando user existe', () => {
    const mockUser = {
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [{ url: 'https://example.com/avatar.jpg' }],
      followers: { total: 100 },
      country: 'BR',
      product: 'premium',
      external_urls: { spotify: 'https://open.spotify.com/user/user123' },
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isAuthenticated: true,
      login: jest.fn(),
      isLoading: false,
      error: null,
      handleAuthCallback: jest.fn(),
      tokens: null,
    });

    render(<ProfilePage />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('deve chamar logout quando botão de sair é clicado', () => {
    const mockUser = {
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [],
      followers: { total: 0 },
      country: 'BR',
      product: 'free',
      external_urls: { spotify: 'https://open.spotify.com/user/user123' },
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isAuthenticated: true,
      login: jest.fn(),
      isLoading: false,
      error: null,
      handleAuthCallback: jest.fn(),
      tokens: null,
    });

    render(<ProfilePage />);

    const logoutButton = screen.getByRole('button');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
