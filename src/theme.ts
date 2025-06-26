import { ThemeConfig } from '@chakra-ui/theme';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = {
  config,
  colors: {
    white: '#CCCCCC',
    brand: {
      // Cores do Spotify - tema único escuro
      primary: '#1DB954', // Verde do Spotify (apenas para elementos de destaque)
      black: '#121212', // Preto do fundo do Spotify
      darkGray: '#212121', // Cinza escuro para áreas secundárias
      lightGray: '#b3b3b3', // Cinza claro para textos secundários
      white: '#FFFFFF', // Branco para textos principais
      accent: '#1ED760', // Verde accent para botões hover
    },
  },
  fonts: {
    body: '"Rubik", sans-serif',
    heading: '"Rubik", sans-serif',
    mono: 'monospace',
  },
  styles: {
    global: {
      body: {
        bg: '#121212', // Sempre fundo preto
        color: '#FFFFFF', // Sempre texto branco
        fontFamily: '"Rubik", sans-serif',
      },
    },
  },
};

export default theme;
