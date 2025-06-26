import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const bgColor = '#121212';

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />

      <Box
        as="main"
        ml={{ base: 0, md: '60' }}
        p={{ base: '6', md: '8' }}
        pt={{ base: '16', md: '8' }}
        transition=".3s ease"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
