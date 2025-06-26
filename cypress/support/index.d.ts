declare namespace Cypress {
  interface Chainable {
    loginWithSpotify(): Chainable<void>
    logoutFromSpotify(): Chainable<void>
    goOffline(): Chainable<void>
    goOnline(): Chainable<void>
  }
}
