// Arquivo de suporte carregado antes de cada arquivo de teste.
// Veja: https://on.cypress.io/configuration
import './commands';

// O site de busca testado é de terceiros (fora do nosso controle) e às vezes
// lança erros de script não relacionados ao que estamos validando (ex.: scripts
// de analytics/experimentos minificados). Isso não deve derrubar nossos testes.
Cypress.on('uncaught:exception', () => false);
