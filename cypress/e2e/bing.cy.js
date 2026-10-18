const SELETOR_CAMPO_BUSCA = 'textarea[name="q"], input[name="q"]';
const SELETOR_BOTAO_BUSCA = 'label[for="sb_form_go"], #sb_form_go';

describe('Bing Search', () => {
  const termoValido = 'Cypress.io';

  beforeEach(() => {
    cy.visit('/');
    cy.aceitarCookiesSeNecessario();
  });

  it('TC01 - Deve acessar a página inicial', () => {
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.title().should('include', 'Bing');
  });

  it('TC02 - Deve verificar se o campo de pesquisa está disponível', () => {
    cy.get(SELETOR_CAMPO_BUSCA).should('be.visible').and('be.enabled');
  });

  it('TC03 - Deve pesquisar um termo válido', () => {
    cy.get(SELETOR_CAMPO_BUSCA).type(`${termoValido}{enter}`);

    cy.location('pathname').should('include', '/search');
    cy.get('#b_results').should('exist');
  });

  it('TC04 - Deve validar se os resultados correspondem à pesquisa', () => {
    cy.get(SELETOR_CAMPO_BUSCA).type(`${termoValido}{enter}`);

    cy.get('#b_results').should('exist');
    // Verifica o texto dos blocos de resultado orgânico (`.b_algo`) em vez de
    // usar `cy.contains()` solto, que pode acertar elementos ocultos de
    // outros widgets da página (ex.: carrossel de "buscas relacionadas").
    cy.get('#b_results .b_algo').should('have.length.greaterThan', 0);
    cy.get('#b_results .b_algo').then(($resultados) => {
      const algumMencionaOTermo = [...$resultados].some((el) =>
        /cypress/i.test(el.textContent)
      );
      expect(algumMencionaOTermo, 'algum resultado menciona o termo pesquisado').to
        .be.true;
    });
  });

  it('TC05 - Deve pesquisar uma frase com espaços', () => {
    const frase = 'teste de automação com cypress';
    cy.get(SELETOR_CAMPO_BUSCA).type(`${frase}{enter}`);

    cy.location('pathname').should('include', '/search');
    cy.get('#b_results').should('exist');
  });

  it('TC06 - Deve pesquisar caracteres especiais', () => {
    const termoEspecial = 'C++ & @cypress #teste! 100%';
    cy.get(SELETOR_CAMPO_BUSCA).type(`${termoEspecial}{enter}`);

    // A busca deve ser processada sem travar a aplicação, mesmo com caracteres especiais
    cy.location('pathname').should('include', '/search');
    cy.get('body').should('be.visible');
  });

  it('TC07 - Deve pesquisar um termo sem resultados relevantes', () => {
    // Entre aspas para forçar correspondência exata da frase (sem fuzzy match),
    // garantindo que o Bing não encontre nenhum resultado parecido.
    const termoSemResultado =
      '"asdkjhqweoiuqwpoeiuzxcvbnmqwerty1234567890semresultadorelevante_xyzteste987"';
    cy.get(SELETOR_CAMPO_BUSCA).type(`${termoSemResultado}{enter}`);

    cy.location('pathname').should('include', '/search');
    cy.get('body', { timeout: 10000 }).should(($body) => {
      const texto = $body.text().toLowerCase();
      const semResultados =
        /there are no results|did not match|no results found|não há resultados|não encontrou|nenhum resultado/.test(
          texto
        );
      expect(semResultados, 'mensagem de ausência de resultados exibida').to.be.true;
    });
  });

  it('TC08 - Deve enviar uma pesquisa usando Enter', () => {
    cy.get(SELETOR_CAMPO_BUSCA).type(`${termoValido}{enter}`);

    cy.location('pathname').should('include', '/search');
  });

  it('TC09 - Deve enviar uma pesquisa usando o botão de busca, quando disponível', () => {
    cy.get(SELETOR_CAMPO_BUSCA).type(termoValido);
    // Fecha a lista de sugestões para que o botão de busca fique acessível
    cy.get(SELETOR_CAMPO_BUSCA).type('{esc}');

    cy.get('body').then(($body) => {
      const botaoBusca = $body.find(SELETOR_BOTAO_BUSCA);
      if (botaoBusca.length) {
        cy.wrap(botaoBusca.first()).click({ force: true });
      } else {
        // Fallback: caso o botão não esteja disponível no DOM, usa o Enter
        cy.get(SELETOR_CAMPO_BUSCA).type('{enter}');
      }
    });

    cy.location('pathname').should('include', '/search');
  });

  it('TC10 - Deve navegar de volta para a página anterior', () => {
    cy.get(SELETOR_CAMPO_BUSCA).type(`${termoValido}{enter}`);
    cy.location('pathname').should('include', '/search');

    cy.go('back');

    cy.location('pathname').should('eq', '/');
    cy.get(SELETOR_CAMPO_BUSCA).should('be.visible');
  });
});
