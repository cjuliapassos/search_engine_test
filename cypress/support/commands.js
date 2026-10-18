// Arquivo para criação de comandos customizados do Cypress.
// Veja: https://on.cypress.io/custom-commands

// Aceita o diálogo de consentimento de cookies (LGPD/GDPR), caso ele apareça.
// No Bing, diferente do Google, esse banner reaparece a cada `cy.visit()`,
// então o comando precisa ser chamado antes de cada teste.
Cypress.Commands.add('aceitarCookiesSeNecessario', () => {
  cy.get('body').then(($body) => {
    const seletoresConsentimento = [
      '#bnp_btn_accept', // banner de privacidade da Microsoft/Bing
    ];
    seletoresConsentimento.forEach((seletor) => {
      if ($body.find(seletor).length) {
        cy.get(seletor).first().click({ force: true });
      }
    });
  });
});
