import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../../components/common/Layout';

jest.mock('../../../components/common/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('Layout', () => {
  it('deve renderizar corretamente com children', () => {
    render(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('deve renderizar múltiplos children', () => {
    render(
      <Layout>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Layout>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});
