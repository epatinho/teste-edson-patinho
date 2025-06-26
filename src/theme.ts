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
      primary: '#1DB954',
      black: '#121212',
      darkGray: '#212121',
      lightGray: '#b3b3b3',
      white: '#FFFFFF',
      accent: '#1ED760',
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
        bg: '#121212',
        color: '#FFFFFF',
        fontFamily: '"Rubik", sans-serif',
      },
    },
  },
};

export default theme;
