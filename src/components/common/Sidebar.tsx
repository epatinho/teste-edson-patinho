import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, useBreakpointValue, IconButton, Image } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaMusic, FaListUl, FaUser, FaDownload, FaBars } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({
  icon: IconComponent,
  children,
  to,
}: {
  icon: React.ComponentType;
  children: React.ReactNode;
  to: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          fontWeight: 'bold',
        }}
        color="white"
        fontWeight={isActive ? 'bold' : 'normal'}
      >
        <Box mr="4">
          <IconComponent />
        </Box>
        <Text fontSize="md">{children}</Text>
      </Flex>
    </Link>
  );
};

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
    });
  };

  // Wrappers para resolver problemas de tipagem com react-icons
  const HomeIcon = () => React.createElement(FaHome as any);
  const MusicIcon = () => React.createElement(FaMusic as any);
  const ListIcon = () => React.createElement(FaListUl as any);
  const UserIcon = () => React.createElement(FaUser as any);
  const DownloadIcon = () => React.createElement(FaDownload as any);
  const BarsIcon = () => React.createElement(FaBars as any);

  const SidebarContent = () => (
    <Box
      bg="black"
      borderRight="1px"
      borderRightColor="gray.700"
      w={{ base: 'full', md: '60' }}
      pos="fixed"
      h="full"
      color="white"
      zIndex={isMobile ? 30 : 10}
      left={0}
      top={0}
      display={isMobile ? (showMobileMenu ? 'block' : 'none') : 'block'}
      transition="all 0.3s"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between" position="relative">
        <Image
          src={`${process.env.PUBLIC_URL}/spotify-logo.png`}
          alt="Spotify Logo"
          width="164px"
          height="49.06px"
          mt="31.04px"
          ml="0"
        />
        {isMobile && (
          <IconButton
            aria-label="Fechar menu"
            variant="outline"
            color="white"
            onClick={() => setShowMobileMenu(false)}
            size="sm"
            ml="auto"
          >
            <BarsIcon />
          </IconButton>
        )}
      </Flex>

      <Box h="20"></Box>

      {isAuthenticated && (
        <Flex direction="column">
          <NavItem icon={HomeIcon} to="/">
            Home
          </NavItem>
          <NavItem icon={MusicIcon} to="/artists">
            Artistas
          </NavItem>
          <NavItem icon={ListIcon} to="/playlists">
            Playlists
          </NavItem>
          <NavItem icon={UserIcon} to="/profile">
            Perfil
          </NavItem>
        </Flex>
      )}

      <Box position="absolute" bottom="8" width="100%" px="8">
        <Button
          colorScheme="green"
          variant="solid"
          width="100%"
          onClick={handleInstallClick}
          disabled={!deferredPrompt}
        >
          <Flex align="center">
            <DownloadIcon />
            <Box as="span" ml={2}>
              Instalar PWA
            </Box>
          </Flex>
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          aria-label="Abrir menu"
          position="fixed"
          top="4"
          left="4"
          colorScheme="blackAlpha"
          onClick={() => setShowMobileMenu(true)}
          zIndex={20}
        >
          <BarsIcon />
        </IconButton>
      )}

      <SidebarContent />

      {isMobile && showMobileMenu && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={20}
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
