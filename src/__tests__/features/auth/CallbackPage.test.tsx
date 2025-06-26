import React from 'react';
import { render, screen } from '@testing-library/react';
import CallbackPage from '../../../features/auth/CallbackPage';
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
  Center: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Spinner: (props: any) => (
    <div role="status" {...props}>
      Loading...
    </div>
  ),
  Text: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

const mockNavigate = jest.fn();
const mockSearchParams = new URLSearchParams('code=test-code');

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams],
  }),
  { virtual: true }
);

describe('CallbackPage', () => {
  const stableHandleAuthCallback = jest.fn();
  const stableLogin = jest.fn();
  const stableLogout = jest.fn();

  beforeEach(() => {
    stableHandleAuthCallback.mockClear();
    stableLogin.mockClear();
    stableLogout.mockClear();
    mockNavigate.mockClear();

    stableHandleAuthCallback.mockResolvedValue(undefined);
  });

  it('deve renderizar spinner quando está carregando', () => {
    mockUseAuth.mockReturnValue({
      handleAuthCallback: stableHandleAuthCallback,
      isLoading: true,
      error: null,
      isAuthenticated: false,
      login: stableLogin,
      logout: stableLogout,
      user: null,
      tokens: null,
    });

    render(<CallbackPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('deve exibir erro quando há erro de autenticação', () => {
    mockUseAuth.mockReturnValue({
      handleAuthCallback: stableHandleAuthCallback,
      isLoading: false,
      error: 'Erro de autenticação específico',
      isAuthenticated: false,
      login: stableLogin,
      logout: stableLogout,
      user: null,
      tokens: null,
    });

    render(<CallbackPage />);

    expect(screen.getByText(/erro de autenticação específico/i)).toBeInTheDocument();
  });

  it('deve renderizar sem erros fatais', () => {
    mockUseAuth.mockReturnValue({
      handleAuthCallback: stableHandleAuthCallback,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login: stableLogin,
      logout: stableLogout,
      user: null,
      tokens: null,
    });

    const renderWrapper = () => {
      render(<CallbackPage />);
    };

    expect(renderWrapper).not.toThrow();
  });
});
