export {};

Cypress.Commands.add('loginWithSpotify', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('spotify_access_token', 'mock_token_' + Date.now());
    win.localStorage.setItem('spotify_refresh_token', 'mock_refresh_token');
    win.localStorage.setItem('spotify_token_expires', String(Date.now() + 3600000));
    win.localStorage.setItem('spotify_user', JSON.stringify({
      id: 'test_user',
      display_name: 'Test User',
      email: 'test@example.com',
      country: 'BR',
      followers: { total: 100 }
    }));
  });
});

Cypress.Commands.add('logoutFromSpotify', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

Cypress.Commands.add('goOffline', () => {
  cy.window().then((win) => {
    cy.stub(win.navigator, 'onLine').value(false);
    win.dispatchEvent(new Event('offline'));
  });
});

Cypress.Commands.add('goOnline', () => {
  cy.window().then((win) => {
    cy.stub(win.navigator, 'onLine').value(true);
    win.dispatchEvent(new Event('online'));
  });
});

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      loginWithSpotify(): Chainable<Subject>
      logoutFromSpotify(): Chainable<Subject>
      goOffline(): Chainable<Subject>
      goOnline(): Chainable<Subject>
    }
  }
}
