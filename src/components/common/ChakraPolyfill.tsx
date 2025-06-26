import React, { createContext, useContext, useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

export const AlertIcon: React.FC = () => (
  <Box
    marginRight="2"
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    width="24px"
    height="24px"
  >
    ⚠️
  </Box>
);

type ColorMode = 'dark';
type ColorModeContextType = {
  colorMode: ColorMode;
  toggleColorMode: () => void; // mantido para compatibilidade, mas não fará nada
};

const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: 'dark',
  toggleColorMode: () => {},
});

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorMode] = useState<ColorMode>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-mode');

    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#FFFFFF';
    document.body.style.fontFamily = '"Rubik", sans-serif';

    const styleTag =
      document.getElementById('spotify-theme-styles') || document.createElement('style');
    styleTag.id = 'spotify-theme-styles';
    styleTag.innerHTML = `
      body {
        background-color: #121212;
        color: #FFFFFF;
        font-family: 'Rubik', sans-serif;
      }
      
      /* Textos e elementos em cores claras */
      h1, h2, h3, h4, h5, h6, p, span, label, input, select, textarea {
        color: #FFFFFF;
        font-family: 'Rubik', sans-serif;
      }
      
      /* Elementos secundários em cinza mais claro */
      .secondary-text, .text-muted {
        color: #b3b3b3;
      }
      
      /* Elementos interativos em verde do Spotify */
      a, button, .btn-primary { 
        color: #1DB954;
        font-family: 'Rubik', sans-serif;
      }
      a:hover, button:hover, .btn-primary:hover {
        color: #1ED760; 
      }
      
      /* Botões primários */
      .btn-primary { 
        background-color: #1DB954;
        color: white;
      }
      .btn-primary:hover { 
        background-color: #1ED760;
      }
      
      /* Elementos de interface secundários */
      .nav-item, .menu-item { 
        color: white;
      }
      .nav-item:hover, .menu-item:hover { 
        color: #1DB954;
      }
    `;
    document.head.appendChild(styleTag);
  }, []);

  const toggleColorMode = () => {
    // Não faz nada, pois temos apenas um tema
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  return useContext(ColorModeContext);
};
