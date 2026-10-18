const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.bing.com",
    setupNodeEvents(on, config) {
      // implementar listeners de node events aqui, se necessário
    },
  },
});
