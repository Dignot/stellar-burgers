const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/*.cy.{js,ts}',
    supportFile: false,
    video: false,
    baseUrl: 'http://localhost:4000'
  }
});
