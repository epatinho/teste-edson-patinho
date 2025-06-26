import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../../features/home/HomePage';
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
  Text: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar mensagem de login quando usuário não está autenticado', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      error: null,
      handleAuthCallback: jest.fn(),
      tokens: null,
    });

    render(<HomePage />);

    expect(screen.getByText(/faça login com sua conta do spotify/i)).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('não deve renderizar mensagem de login quando usuário está autenticado', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', display_name: 'Test User' } as any,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      error: null,
      handleAuthCallback: jest.fn(),
      tokens: null,
    });

    render(<HomePage />);

    expect(screen.queryByText(/faça login com sua conta do spotify/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
