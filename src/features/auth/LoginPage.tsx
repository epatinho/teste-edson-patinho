import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Text, Container, Flex, Image } from '@chakra-ui/react';
import { useColorMode } from '../../components/common/ChakraPolyfill';

const LoginPage: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const { colorMode } = useColorMode();

  const bgColor = colorMode === 'dark' ? '#121212' : 'white';
  const textColor = colorMode === 'dark' ? 'white' : 'gray.800';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      bg={bgColor}
      color={textColor}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      p={5}
    >
      <Container maxW="container.sm" textAlign="center">
        <Flex justify="center" align="center" mb={6}>
          <Image
            src="/spotify-logo.png"
            alt="Spotify Logo"
            width="164px"
            height="50px"
            objectFit="contain"
          />
        </Flex>

        <Text mb={8} fontSize="lg">
          Entra com sua conta Spotify clicando no botão abaixo
        </Text>

        <Flex justify="center" width="100%">
          <Button
            onClick={login}
            loading={isLoading}
            loadingText="Conectando..."
            bg="#57B660"
            size="md"
            borderRadius="24px"
            display="flex"
            flexDirection="row"
            alignItems="center"
            padding="0px 40px"
            gap="10px"
            width="133px"
            height="42px"
            color="#000000"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg', color: 'white' }}
            _active={{ transform: 'translateY(0)' }}
          >
            Entrar
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default LoginPage;
