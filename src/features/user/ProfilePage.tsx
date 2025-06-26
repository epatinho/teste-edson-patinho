import React from 'react';
import { Box, Container, Flex, Heading, Text, Image, Button, Center } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Layout>
        <Center h="calc(100vh - 100px)">
          <Text>Carregando informações do usuário...</Text>
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <Center h="calc(100vh - 100px)">
        <Container maxW="md">
          <Flex direction="column" align="center" justify="center" textAlign="center" gap={4}>
            <Box position="relative">
              <Image
                borderRadius="full"
                boxSize="200px"
                src={user.images?.[0]?.url || '/placeholder-user.png'}
                alt={`Foto de ${user.display_name}`}
                border="4px solid"
                borderColor="green.400"
                mb={4}
              />
            </Box>

            <Heading as="h1" size="xl" mb={2}>
              {user.display_name}
            </Heading>

            <Button
              onClick={logout}
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
              Sair
            </Button>
          </Flex>
        </Container>
      </Center>
    </Layout>
  );
};

export default ProfilePage;
