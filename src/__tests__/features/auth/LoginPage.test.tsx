import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../../../features/auth/LoginPage';
import { useAuth } from '../../../context/AuthContext';

jest.mock('../../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('../../../components/common/ChakraPolyfill', () => ({
  useColorMode: () => ({
    colorMode: 'dark',
    toggleColorMode: jest.fn(),
  }),
}));

jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, disabled, isLoading, ...props }: any) => (
    <button onClick={onClick} disabled={disabled || isLoading} {...props}>
      {isLoading ? 'Carregando...' : children}
    </button>
  ),
  Text: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Image: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

jest.mock(
  'react-router-dom',
  () => ({
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to}>
        Redirecting to {to}
      </div>
    ),
  }),
  { virtual: true }
);

describe('LoginPage', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar página de login quando usuário não está autenticado', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      isLoading: false,
      logout: jest.fn(),
      user: null,
      error: null,
      handleAuthCallback: jest.fn(),
      tokens: null,
    });

    render(<LoginPage />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('deve chamar função de login quando botão é clicado', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      isLoading: false,
      logout: jest.fn(),
      user: null,
      error: null,
      handleAuthCallback: jest.fn(),
      tokens: null,
    });

    render(<LoginPage />);

    const loginButton = screen.getByRole('button');
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});
