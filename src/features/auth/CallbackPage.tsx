import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { useColorMode } from '../../components/common/ChakraPolyfill';

interface DebugInfo {
  code?: string;
  error?: string;
  callbackProcessed?: boolean;
  callbackError?: string;
  globalError?: string;
  redirectInitiated?: boolean;
  redirectTarget?: string;
  effectSkipped?: boolean;
}

const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const { colorMode } = useColorMode();
  const redirectInitiated = useRef(false);
  const effectHasRun = useRef(false);

  const bgColor = colorMode === 'dark' ? '#121212' : 'white';
  const textColor = colorMode === 'dark' ? 'white' : 'gray.800';

  const { handleAuthCallback, isLoading: authLoading, error: authError } = auth;

  const updateDebugInfo = useCallback((updates: Partial<DebugInfo>) => {
    setDebugInfo(prev => ({ ...prev, ...updates }));
  }, []);

  const navigateWithRedirect = useCallback(
    (path: string, delay: number = 0) => {
      if (redirectInitiated.current) return;

      redirectInitiated.current = true;
      updateDebugInfo({ redirectInitiated: true, redirectTarget: path });

      if (delay > 0) {
        setTimeout(() => {
          navigate(path, { replace: true });
        }, delay);
      } else {
        navigate(path, { replace: true });
      }
    },
    [navigate, updateDebugInfo]
  );

  const processAuth = useCallback(async () => {
    if (effectHasRun.current || redirectInitiated.current) {
      updateDebugInfo({ effectSkipped: true });
      return;
    }

    effectHasRun.current = true;

    try {
      const code = searchParams.get('code');
      updateDebugInfo({ code: code ? 'presente' : 'ausente' });

      if (!code) {
        const errorParam = searchParams.get('error');
        const errorMsg = errorParam
          ? `Erro de autorização: ${errorParam}`
          : 'Código de autorização não encontrado na URL';

        setLocalError(errorMsg);
        updateDebugInfo({ error: errorMsg });
        navigateWithRedirect('/login', 3000);
        return;
      }

      try {
        await handleAuthCallback(code);
        updateDebugInfo({ callbackProcessed: true });
      } catch (callbackError) {
        updateDebugInfo({ callbackError: String(callbackError) });
        throw callbackError;
      }

      navigateWithRedirect('/', 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setLocalError(`Falha ao processar autenticação: ${errorMessage}`);
      updateDebugInfo({ globalError: String(err) });
      navigateWithRedirect('/login', 3000);
    } finally {
      setLocalLoading(false);
    }
  }, [searchParams, handleAuthCallback, navigateWithRedirect, updateDebugInfo]);

  useEffect(() => {
    processAuth();
  }, [processAuth]);

  const isLoading = localLoading || authLoading,
    error = localError || authError;
  return (
    <Box bg={bgColor} minHeight="100vh" color={textColor}>
      <Center height="100vh" data-testid="callback-page">
        <Box textAlign="center" p={6} maxW="500px" w="100%">
          {isLoading && (
            <>
              <Spinner size="xl" color="green.500" m={4} />
              <Text>Autenticando com o Spotify...</Text>
            </>
          )}

          {error && (
            <Box bg="red.500" color="white" p={4} borderRadius="md">
              {error}
            </Box>
          )}

          {!isLoading && !error && <Text>Autenticação bem-sucedida! Redirecionando...</Text>}

          {/* Área de debug - será exibida apenas em modo de desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <Box
              mt={8}
              p={4}
              bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
              borderRadius="md"
              fontSize="xs"
              textAlign="left"
            >
              <Text fontWeight="bold">Informações de Debug:</Text>
              <pre style={{ color: colorMode === 'dark' ? '#f0f0f0' : '#333' }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
              <Text fontWeight="bold" mt={2}>
                Estado da autenticação:
              </Text>
              <pre style={{ color: colorMode === 'dark' ? '#f0f0f0' : '#333' }}>
                {JSON.stringify({ isLoading, error }, null, 2)}
              </pre>
            </Box>
          )}
        </Box>
      </Center>
    </Box>
  );
};

export default CallbackPage;
