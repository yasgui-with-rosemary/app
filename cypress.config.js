const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    defaultCommandTimeout: 20000,  // ⏱️ Default timeout for commands (30 seconds)
    requestTimeout: 20000,         // ⏱️ Timeout for network requests (30 seconds)
    responseTimeout: 20000         // ⏱️ Timeout for responses (30 seconds)
  }
});