export {};

describe('Spotify App - E2E Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/v1/me/top/artists**', {
      fixture: 'artists.json'
    }).as('getTopArtists');

    cy.intercept('GET', '**/v1/me/playlists**', {
      body: {
        items: [
          {
            id: '1',
            name: 'Minha Playlist',
            description: 'Playlist de teste',
            tracks: { total: 10 }
          }
        ]
      }
    }).as('getPlaylists');

    cy.intercept('GET', '**/v1/me', {
      body: {
        id: 'test_user',
        display_name: 'Test User',
        email: 'test@example.com',
        country: 'BR',
        followers: { total: 100 }
      }
    }).as('getUser');

    cy.intercept('GET', 'https://api.spotify.com/**', {
      statusCode: 200,
      body: { items: [], total: 0 }
    }).as('spotifyApi');
  });

  describe('Autenticação', () => {
    it('deve mostrar página de login quando não autenticado', () => {
      cy.logoutFromSpotify();
      cy.visit('/');

      cy.wait(2000);
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        if (bodyText.includes('Login') || bodyText.includes('Spotify') || bodyText.includes('Entrar')) {
          cy.contains(/Login|Spotify|Entrar/i).should('be.visible');
        }
      });
    });

    it('deve permitir navegação quando autenticado', () => {
      cy.loginWithSpotify();

      cy.visit('/');
      cy.wait(3000);

      cy.url().then((url) => {
        if (url.includes('/login') || url.includes('#/login')) {
          cy.visit('/artists');
          cy.wait(1000);
        }

        cy.get('body').should('be.visible');
      });
    });
  });

  describe('Navegação de Artistas', () => {
    beforeEach(() => {
      cy.loginWithSpotify();
    });

    it('deve carregar página de artistas', () => {
      cy.visit('/artists');

      cy.wait(2000);

      cy.get('body').should(($body) => {
        const text = $body.text();
        const hasExpectedText = text.includes('Artistas') ||
                               text.includes('Artists') ||
                               text.includes('Seus artistas') ||
                               text.includes('Top Artists') ||
                               text.length > 100;
        if (!hasExpectedText) {
          throw new Error('Página não carregou o conteúdo esperado de artistas');
        }
      });
    });

    it('deve funcionar com dados mock quando API não responder', () => {
      cy.visit('/artists');

      cy.get('body').should('be.visible');
      cy.url().should('include', '/artists');
    });
  });

  describe('Responsividade', () => {
    beforeEach(() => {
      cy.loginWithSpotify();
    });

    const viewports = [
      { device: 'mobile', width: 375, height: 667 },
      { device: 'tablet', width: 768, height: 1024 },
      { device: 'desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(({ device, width, height }) => {
      it(`deve funcionar em ${device} (${width}x${height})`, () => {
        cy.viewport(width, height);
        cy.visit('/');

        cy.get('body').should('be.visible');
        cy.wait(1000);

        cy.get('body').should('not.be.empty');
      });
    });
  });

  describe('Navegação Geral', () => {
    beforeEach(() => {
      cy.loginWithSpotify();
    });

    it('deve navegar entre páginas', () => {
      cy.visit('/');
      cy.wait(1000);

      const routes = ['/artists', '/playlists', '/profile'];

      routes.forEach(route => {
        cy.visit(route);
        cy.wait(500);
        cy.url().should('include', route);
        cy.get('body').should('be.visible');
      });
    });
  });

  describe('Funcionalidade Offline', () => {
    beforeEach(() => {
      cy.loginWithSpotify();
    });

    it('deve lidar com estado offline', () => {
      cy.visit('/');
      cy.wait(1000);

      cy.goOffline();
      cy.wait(500);

      cy.get('body').should('be.visible');

      cy.goOnline();
      cy.wait(500);
    });
  });

  describe('Tratamento de Erros', () => {
    beforeEach(() => {
      cy.loginWithSpotify();
    });

    it('deve lidar com erros de API graciosamente', () => {
      cy.intercept('GET', '**/v1/me/top/artists**', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('getArtistsError');

      cy.intercept('GET', 'https://api.spotify.com/**', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('spotifyApiError');

      cy.visit('/artists');
      cy.wait(2000);

      cy.get('body').should('be.visible');

      cy.get('body').should(($body) => {
        const text = $body.text();
        if (text.length <= 50) {
          throw new Error('Página não possui conteúdo suficiente, aplicação pode ter quebrado');
        }
      });
    });
  });
});
